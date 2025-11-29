// Plow Daddy Cloud - Simple Express server with shared JSON state
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, 'data.json');

function readState() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return { customers: [], jobs: [] };
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8') || '{"customers":[],"jobs":[]}';
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading data.json', e);
    return { customers: [], jobs: [] };
  }
}

function writeState(state) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing data.json', e);
  }
}

app.use(express.json());

app.get('/api/state', (req, res) => {
  res.json(readState());
});

app.put('/api/state', (req, res) => {
  const body = req.body || {};
  const customers = Array.isArray(body.customers) ? body.customers : [];
  const jobs = Array.isArray(body.jobs) ? body.jobs : [];
  writeState({ customers, jobs });
  res.json({ ok: true });
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Plow Daddy Cloud running on port ${PORT}`);
});
