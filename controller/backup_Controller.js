const { google } = require('googleapis');
const sqlAdmin = google.sqladmin('v1beta4');

async function triggerBackup(project, instance, description) {
  try {
    const authClient = await google.auth.getClient({
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    const request = {
      project: project,
      instance: instance,
      resource: {
        description: description,
      },
      auth: authClient,
    };

    return new Promise((resolve, reject) => {
      sqlAdmin.backupRuns.insert(request, (err, response) => {
        if (err) {
          console.error('Error triggering backup:', err);
          reject(err);
          return;
        }

        console.log('Backup triggered successfully:', JSON.stringify(response.data, null, 2));
        resolve(response.data);
      });
    });

  } catch (err) {
    console.error('Authentication failed:', err);
    throw err; 
  }
}

module.exports = {
  triggerBackup
};
