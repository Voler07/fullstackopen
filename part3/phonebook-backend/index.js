require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

morgan.token('body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    'id': '1',
    'name': 'Arto Hellas',
    'number': '040-123456'
  },
  {
    'id': '2',
    'name': 'Ada Lovelace',
    'number': '39-44-5323523'
  },
  {
    'id': '3',
    'name': 'Dan Abramov',
    'number': '12-43-234345'
  },
  {
    'id': '4',
    'name': 'Mary Poppendieck',
    'number': '39-23-6423122'
  }
]

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons)
    })
})

app.get('/info', (request, response) => {
  const date = new Date()
  Person
    .find({})
    .then(persons => {
      response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
  <p>${date}</p>`)
    })

})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(p => {
      if (p) {
        response.json(p)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons/', (request, response, next) => {
  const body = request.body

  if (!body.number || !body.name) {
    return response.status(400).json({
      error: 'number or name missing'
    })
  }

  const existed = persons.find(item => item.name === body.name)
  if (existed) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = new Person({
    number: body.number,
    name: body.name,
    //id: String(Math.floor(Math.random() * 1000000))
  })

  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(p => {
      if (!p) {
        return response.status(404).end()
      }

      p.name = name
      p.number = number

      return p.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})