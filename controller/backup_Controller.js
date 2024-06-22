const { google } = require("googleapis");
const sqlAdmin = google.sqladmin("v1beta4");
const Backup = require("../models/Backupmodel");

async function triggerBackup(project, instance, description,id) {
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
    const backupOperation = await new Promise((resolve, reject) => {
      sqlAdmin.backupRuns.insert(request, async (err, response) => {
        if (err) {
          console.error("Error triggering backup:", err);
          reject(err);
          return;
        }
        console.log("Backup triggered successfully:", response.data);
        resolve(response.data);
      });
    });

    const operationId = backupOperation.name;

    const status = await pollBackupStatus(project, instance, operationId, authClient);

    if (status.status === 'DONE') {
      try {
        await Backup.create({ id });
      } catch (err) {
        console.error("Error saving backup ID to MongoDB:", err);
        throw err;
      }
    } else {
      throw new Error('Backup operation did not complete successfully');
    }

    return status;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
}

async function pollBackupStatus(project, instance, operationId, authClient) {
  try {
    while (true) {
      const operation = await sqlAdmin.operations.get({
        project: project,
        operation: operationId,
        auth: authClient,
      });

      const status = operation.data.status;
      console.log(`Backup operation status: ${status}`);

      if (status === 'DONE') {
        return operation.data;
      } else if (status === 'PENDING' || status === 'RUNNING') {
        await new Promise(resolve => setTimeout(resolve, 10000)); 
      } else {
        throw new Error(`Backup operation failed or in unexpected state: ${status}`);
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
