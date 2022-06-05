const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

let phonebook = 
[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(cors());

morgan.token("person", (req, res) => {
  if (req.method === "POST") return JSON.stringify(req.body);
  return null;
});


app.use(express.json());

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :person"
  )
);

app.get('/info', (request, response) => {
  response.send(
      `<div>
          <p>Phonebook has info for ${phonebook.length} people</p>
      </div>
      <div>
      <p>${Date().toString()}</p>
      </div>
      `
  )
})
app.get('/api/persons', (request, response) => {
  response.json(phonebook)
})
app.get('/', (request, response) => {
  response.send('<p>Please go to this page <a href="http://localhost:3001/api/persons">page</a></p>')
})


app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = phonebook.find(person => person.id === id);

  if (person) {
    res.json(person);
  } 
    
  res.status(404).end();
  
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  
  phonebook = phonebook.filter(person => person.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const generateId = () => (Math.random() * 10000).toFixed(0);
  const { body } = req;

  
  if (!body.name) {
    return res.status(400).json({
      error: "name is required"
    });
  }
  if (!body.number) {
    return res.status(400).json({
      error: "number is required"
    });
  }

  
  const dejaExiste = phonebook.some(person => person.name === body.name);
  if (dejaExiste) {
    return res.status(400).json({
      error: "name must be unique"
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  };

  phonebook = phonebook.concat(person);

  res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});