const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

let content

morgan.token('content', (req, res) => { return  content})

app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens['content'](req, res)
  ].join(' ')
}))

let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

const generateRandomId = () => {
  genId = Math.floor(Math.random() * 1000000)
  console.log(genId)
  return genId;
}

app.post('/api/persons', (request, response) =>{
  const body = request.body
  if(!body.name || !body.number){
    response.status(400).json({
      error: 'name or number missing'
    })
  }else{
    const person = {
      id: generateRandomId(),
      name: body.name,
      number: body.number
    }
  
    const present = persons.find(pers => pers.name == body.name)
    if(present){
      response.status(400).json({
        error:'name already present'
      })
    }else{
      content =JSON.stringify(person)
      persons.concat(person)
      response.json(person)
    }
  }

})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response)=> {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if(person){
    response.json(person)
  }else{
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  console.log()
  response.send(`<h1>Phonebook has info for ${persons.length} people</h1>
    <h1>${Date()}</h1>`)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})