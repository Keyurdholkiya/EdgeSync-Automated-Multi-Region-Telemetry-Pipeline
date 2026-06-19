const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const mongoURI = process.env.MONGO_URI || 'mongodb://telemetry-db:27017/edgesync';
mongoose.connect(mongoURI)
  .then(() => console.log('🛡️ Private Cluster Connection Verified.'))
  .catch(err => console.error('Cluster Auth Error:', err));

const LogSchema = new mongoose.Schema({
  service: String,
  status: String,
  latency: Number,
  timestamp: { type: Date, default: Date.now }
});
const Log = mongoose.model('Log', LogSchema);

app.post('/telemetry', async (req, res) => {
  try {
    const data = new Log(req.body);
    await data.save();
    res.status(201).send({ status: "Ingested", id: data._id });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.get('/telemetry/stream', async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }).limit(15);
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.get('/health', (req, res) => res.status(200).json({ status: "Healthy Cluster" }));

app.listen(5000, () => console.log('Ingestion engine active on 5000'));