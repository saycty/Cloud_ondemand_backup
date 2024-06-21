const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const sqlAdmin = google.sqladmin('v1beta4');
const app = express();
app.use(bodyParser.json());

app.post('/trigger-backup', (req, res) => {
  const { project, instance } = req.body;

  if (!project || !instance) {
    return res.status(400).json({ error: 'Missing required fields: project, instance, description' });
  }

  google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  }).then(authClient => {
    const request = {
      project: project,
      instance: instance,
      resource: {
        
      },
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
  }).catch(err => {
    console.error('Authentication failed:', err);
    return res.status(500).json({ error: 'Authentication failed', details: err });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
