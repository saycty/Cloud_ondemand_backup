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

    if (response.status === 'DONE') {
      return res.status(200).json({
        message: 'Backup completed successfully',
        response: response
      });
    } else {
      return res.status(500).json({
        error: 'Backup operation did not complete successfully',
        response: response
      });
    }
  } catch (err) {
    console.error('Error in triggerBackup:', err);
    return res.status(500).json({ error: 'Error triggering backup', details: err.message });
  }
});

module.exports = router;
