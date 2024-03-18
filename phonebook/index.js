const express = require('express')
var morgan = require('morgan')

const app = express()

morgan.token('req-body', (req, res) => {
  return JSON.stringify(req.body)
});

const morganConfig = morgan(':method :url :status :res[content-length] - :response-time ms :req-body')

let persons = [
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

app.use(express.json())
app.use(morganConfig)

app.get('/api/persons', (request, response) => {
  response.json(persons)
})


app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!(body.name && body.number)) {
    return response.status(400).json({
      error: 'name and/or number is missing'
    })
  }
  else if (persons.filter(person => person.name.toLowerCase() === body.name.toLowerCase()).length !== 0) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  const person = {
    id: Math.floor(Math.random()*1000),
    name: body.name,
    number: body.number
  }
  persons = persons.concat(person)
  response.json(person)
})

app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
      response.json(person)
    } else {
      console.log('Person not found')
      response.status(404).end()
    }
  })

app.delete('/api/persons/:id', (request, response) => {
const id = Number(request.params.id)
persons = persons.filter(person => person.id !== id)

response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})