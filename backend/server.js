const cors = require('cors');
const express = require('express');
const ambulanceRouter = require('./routes/ambulance');
const vehicleRouter = require('./routes/vehicle');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(ambulanceRouter);
app.use(vehicleRouter);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
