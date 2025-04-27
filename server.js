
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dataFilePath = path.join(__dirname, 'data.json');

function readData() {
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify({ members: [], trainers: [] }, null, 2));
  }
  const rawData = fs.readFileSync(dataFilePath);
  return JSON.parse(rawData);
}

function writeData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// API Routes
app.get('/api/members', (req, res) => {
  const data = readData();
  res.json(data.members);
});

app.post('/api/members', (req, res) => {
  const data = readData();
  const newMember = { id: uuidv4(), ...req.body };
  data.members.push(newMember);
  writeData(data);
  res.status(201).json(newMember);
});

app.put('/api/members/:id', (req, res) => {
  const data = readData();
  const memberId = req.params.id;
  const index = data.members.findIndex(m => m.id === memberId);
  if (index !== -1) {
    data.members[index] = { ...data.members[index], ...req.body };
    writeData(data);
    res.json(data.members[index]);
  } else {
    res.status(404).json({ message: 'Member not found' });
  }
});

app.delete('/api/members/:id', (req, res) => {
  const data = readData();
  const memberId = req.params.id;
  data.members = data.members.filter(m => m.id !== memberId);
  writeData(data);
  res.json({ message: 'Member deleted' });
});

app.get('/api/trainers', (req, res) => {
  const data = readData();
  res.json(data.trainers);
});

app.post('/api/trainers', (req, res) => {
  const data = readData();
  const newTrainer = { id: uuidv4(), ...req.body };
  data.trainers.push(newTrainer);
  writeData(data);
  res.status(201).json(newTrainer);
});

app.delete('/api/trainers/:id', (req, res) => {
  const data = readData();
  const trainerId = req.params.id;
  data.trainers = data.trainers.filter(t => t.id !== trainerId);
  writeData(data);
  res.json({ message: 'Trainer deleted' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'gym-management-2.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
