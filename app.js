const express = require('express');
const bodyParser = require('body-parser');
const backup = require('./routes/backup');

const app = express();
app.use(bodyParser.json());

app.use('/api', backup);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
