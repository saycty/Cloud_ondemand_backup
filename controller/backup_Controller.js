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

    const response = await new Promise((resolve, reject) => {
      sqlAdmin.backupRuns.insert(request, async (err, response) => {
        if (err) {
          console.error("Error triggering backup:", err);
          reject(err);
          return;
        }

        console.log(
          "Backup triggered successfully:",
          JSON.stringify(response.data, null, 2)
        );

        try {
          await Backup.create({ id });
        } catch (err) {
          console.error("Error saving backup ID to MongoDB:", err);
        }

        resolve(response.data);
      });
    });

    return response;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
}

module.exports = {
  triggerBackup,
};
