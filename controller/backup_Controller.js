const { google } = require("googleapis");
const sqlAdmin = google.sqladmin("v1beta4");
const Backup = require("../models/Backupmodel");

async function triggerBackup(project, instance, description, id) {
  try {
    const existingBackup = await Backup.findOne({ id });
    if (existingBackup) {
      throw new Error("Backup with this ID already exists");
    }

    const authClient = await google.auth.getClient({
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    const request = {
      project: project,
      instance: instance,
      resource: {
        description: description,
      },
      auth: authClient,
    };

    const backupOperation = await sqlAdmin.backupRuns.insert(request);
    const operationId = backupOperation.data.name;

    const operationResponse = await waitForOperationToComplete(
      project,
      instance,
      operationId,
      authClient
    );

    if (operationResponse.status === "DONE") {
      await Backup.create({ id });

      return {
        status: "DONE",
        message: "Backup completed successfully",
        operation: operationResponse,
      };
    } else {
      throw new Error("Backup operation did not complete successfully");
    }
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
}

async function waitForOperationToComplete(
  project,
  instance,
  operationId,
  authClient
) {
  try {
    while (true) {
      const operation = await sqlAdmin.operations.get({
        project: project,
        operation: operationId,
        auth: authClient,
      });

      console.log(`Backup operation status: ${operation.data.status}`);

      if (operation.data.status === "DONE") {
        return operation.data;
      } else if (
        operation.data.status === "PENDING" ||
        operation.data.status === "RUNNING"
      ) {
      } else {
        throw new Error(
          `Backup operation failed or in unexpected state: ${operation.data.status}`
        );
      }
    }
  } catch (err) {
    console.error("Error polling backup operation status:", err);
    throw err;
  }
}

module.exports = {
  triggerBackup,
};
