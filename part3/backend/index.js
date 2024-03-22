require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('dist'))

morgan.token('req-body', (req, res) => {
  return JSON.stringify(req.body)
})
const morganConfig = morgan(':method :url :status :res[content-length] - :response-time ms :req-body')

app.use(express.json())
app.use(morganConfig)

app.get('/', (req, res) => {
  res.send('<h1>Welcome to my app!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!(body.name && body.number)) {
    return response.status(400).json({
      error: 'name and/or number is missing'
    })
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.get('/info', (request, response) => {
  Person.find({}).then(people => {
    response.send(
      `<p>Phonebook has info for ${people.length} people</p>
      <p>${new Date()}</p>`
  )
  })
    
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person=> {
      response.json(person)
    })
  })

app.delete('/api/persons/:id', (request, response) => {
const id = Number(request.params.id)
persons = persons.filter(person => person.id !== id)

response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})