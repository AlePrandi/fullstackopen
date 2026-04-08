require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Person = require('./models/person')
const mongoose = require('mongoose')
const app = express()

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)
app.use(cors())


app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (!body.name || !body.number) {
    response.status(400).json({
      error: 'name or number missing'
    })
  } else {
    const person = new Person({
      name: body.name,
      number: body.number,
    })

    person.save().then(savedPerson => {
      console.log(savedPerson)
      response.send(savedPerson.toJSON())
    }).catch(error => next(error))

  }

})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.toJSON())
    })
    response.send(result)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(result => {
    console.log(result)
    response.send(result.toJSON())
  }).catch(error => response.status(404).end())
})

app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body
  Person.findById(request.params.id)
    .then(person => {
      person.number = number
      person.save().then(updated => {
        response.send(updated.toJSON())
      })
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  response.send(`<h1>Phonebook has info for ${Person.length} people</h1>
    <h1>${Date()}</h1>`)
})


app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(result => {
    response.status(204).end()
  }).catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  console.error(error.name)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if(error.name === 'ValidationError'){
    return response.status(400).send({error: error.message})
  }

  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})