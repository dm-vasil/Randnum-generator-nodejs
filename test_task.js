const express = require('express');
const app = express();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const PORT = 3000;

const dataFile = 'generated_numbers.json';
let generatedNumbers = loadData();

function loadData() {
  try {
    const data = fs.readFileSync(dataFile);
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data));
}

app.get('/generate', (req, res) => {
  const id = uuidv4();
  const randomNumber = Math.floor(Math.random() * 1000) + 1;
  generatedNumbers[id] = randomNumber;
  saveData(generatedNumbers); 
  res.json({ id, number: randomNumber });
});

app.get('/retrieve/:id', (req, res) => {
    const id = req.params.id;
    const number = generatedNumbers[id];
    if (number) {
        res.json({ id, number });
    } else {
        res.json({ error: 'Number not found' });
    }
    });

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});