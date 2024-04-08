const express = require('express');
const app = express();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const PORT = 3000;
const dataFile = 'generated_numbers.json';

function loadData() {
    try {
        const data = fs.readFileSync(dataFile);
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

/*not sure about this approach, mb would be better to keep generatedNumbers in memory
and update from file system only when retrieving ids. So, while adding new entry - 
- just use in-memory structure to avoid slow reading operations*/
function appendData(id, number) {
    const generatedNumbers = loadData()
    generatedNumbers[id] = number
    fs.writeFileSync(dataFile, JSON.stringify(generatedNumbers));
}

app.get('/retrieve/:id', (req, res) => {
    const generatedNumbers = loadData()
    const id = req.params.id;
    const number = generatedNumbers[id];
    if (number) {
        res.json({ id, number });
    } else {
        res.json({ error: 'Number not found' });
    }
});

//supposed, that it doesnt have to be tested with browser and can be executed simply by curl
app.post('/generate', (req, res) => {
    const id = uuidv4();
    const randomNumber = Math.floor(Math.random() * 1000) + 1;
    appendData(id, randomNumber)
    res.json({ id, number: randomNumber });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
