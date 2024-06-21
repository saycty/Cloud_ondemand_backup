const express = require('express');
const bodyParser = require('body-parser');
const backupRoutes = require('./routes/backup');

const app = express();
app.use(bodyParser.json());

app.use('/api', backupRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
