const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 4000;

app.use(express.json());

let history = loadHistory(); 

function calculate(operations) {
  try {
    return eval(operations);
  } catch (error) {
    return 'Invalid operation';
  }
}

app.get('/', (req, res) => {
  res.send('The arithmetic operator');
});

app.get('/history', (req, res) => {
  res.json(history);
});

app.get('/:operations*', (req, res) => {
  const segments = req.path.split('/').filter(segment => segment !== '');
  let sanitizedPath = '';

  for (const segment of segments) {
    switch (segment) {
      case 'plus':
        sanitizedPath += '+';
        break;
      case 'minus':
        sanitizedPath += '-';
        break;
      case 'into':
        sanitizedPath += '*';
        break;
      case 'modulo':
        sanitizedPath += '%';
        break;
      default:
        sanitizedPath += segment;
        break;
    }
  }

  const answer = calculate(sanitizedPath);

  if (answer !== 'Invalid operation') {
    addToHistory(sanitizedPath, answer);
  }

  res.json({ question: sanitizedPath, answer });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function addToHistory(question, answer) {
  history.unshift({ question, answer });
  if (history.length > 20) {
    history.pop();
  }
  saveHistory(); 
}

function loadHistory() {
  try {
    const historyData = fs.readFileSync('history.json', 'utf8');
    return JSON.parse(historyData);
  } catch (error) {
    return [];
  }
}

function saveHistory() {
  fs.writeFileSync('history.json', JSON.stringify(history));
}
