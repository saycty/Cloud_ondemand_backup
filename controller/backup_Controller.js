const { google } = require('googleapis');
const sqlAdmin = google.sqladmin('v1beta4');

async function triggerBackup(req, res) {
  const { project, instance } = req.body;

  if (!project || !instance) {
    return res.status(400).json({ error: 'Missing required fields: project, instance' });
  }

  try {
    const authClient = await google.auth.getClient({
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    const request = {
      project: project,
      instance: instance,
      resource: {},
      auth: authClient,
    };

    sqlAdmin.backupRuns.insert(request, (err, response) => {
      if (err) {
        console.error('Error triggering backup:', err);
        return res.status(500).json({ error: 'Error triggering backup', details: err });
      }

      console.log('Backup triggered successfully:', JSON.stringify(response.data, null, 2));
      return res.status(200).json({
        message: 'Backup triggered successfully',
        response: response.data
      });
    });

  } catch (err) {
    console.error('Authentication failed:', err);
    return res.status(500).json({ error: 'Authentication failed', details: err });
  }
}

module.exports = {
  triggerBackup
};
