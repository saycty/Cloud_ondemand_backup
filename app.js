const express = require("express");
const bodyParser = require("body-parser");
const DB = require("./db");
const backupRoutes = require("./routes/backup_routes");
const app = express();
app.use(bodyParser.json());
DB()
  .then(() => {
    const PORT = process.env.PORT || 2000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });
app.use("/api", backupRoutes);
