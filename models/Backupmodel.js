const mongoose = require("mongoose");
const BackupSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
  },
});
const Backup = mongoose.model("Backup", BackupSchema);
module.exports = Backup;
