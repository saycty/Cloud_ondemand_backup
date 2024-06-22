const express = require('express');
const router = express.Router();
const backup_Controller = require('../controller/backup_Controller');

router.post('/trigger-backup', async (req, res) => {
  const { project, instance, description, id } = req.body;

  if (!project || !instance || !description || !id) {
    return res.status(400).json({ error: 'Missing required fields: project, instance, description, id' });
  }

  try {
    const response = await backup_Controller.triggerBackup(project, instance, description, id);
    return res.status(200).json({
      message: 'Backup triggered successfully',
      response: response
    });
  } catch (err) {
    console.error('Error in triggerBackup:', err);
    if (err.message === 'Backup with this ID already exists') {
      return res.status(400).json({ error: 'Backup with this ID already exists' });
    }
    return res.status(500).json({ error: 'Error triggering backup', details: err.message });
  }
});

module.exports = router;
