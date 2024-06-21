const express = require('express');
const router = express.Router();
const backupController = require('../controller/backup_Controller');

router.post('/trigger-backup', backupController.triggerBackup);

module.exports = router;
