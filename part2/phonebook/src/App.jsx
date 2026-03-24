import { useState, useEffect } from 'react'
import Services from './services/backPerson'
import Notification from './components/Notification'
import './index.css'

const Note = ({ id, name, number, arr, Funct, setErrorMessage }) => {
  return (
    <>
      <p>{name} {number}
        <button onClick={() => deleteAndUpdate(name, id, arr, Funct, setErrorMessage)}>delete</button></p>
    </>
  )
}

const deleteAndUpdate = (name, id, persons, setPersons, setErrorMessage) => {
  if (window.confirm(`Delete ${name} ?`)) {
    Services.deletePerson(id).then(() => {
      setPersons(persons.filter(p => p.id !== id))
    }).catch(error => {
      setErrorMessage(`Information of ${name} has already been removed from the server`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    })
  }
}

const Input = ({ text, value, onChange }) => {
  return (
    <div>
      {text}: <input value={value}
        onChange={onChange} />
    </div>
  )
}

const Persons = ({ persons, filter, setPersons, setErrorMessage }) => {
  return (
    <>
      {persons
      .filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
      .map(person => {
        return (
          <Note
            key={person.id}
            name={person.name}
            number={person.number}
            id={person.id}
            arr={persons}
            Funct={setPersons}
            setErrorMessage={setErrorMessage} />
        )
      }
      )}
    </>
  )
}

const Form = ({ onSubmit, inputs }) => {
  return (
    <form onSubmit={onSubmit}>
      {inputs.map(input =>
        <Input key={input.text} text={input.text} value={input.value} onChange={input.onChange} />
      )}
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)


  const hook = () => {
    Services.getData().then(response =>
      setPersons(persons.concat(response.data))
    )
  }

  useEffect(hook, [])

  const AddValue = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    let pres = false
    let id
    for (let i = 0; i < persons.length; i++) {
      if (newName == persons[i].name) {
        pres = true
        id = persons[i].id
      }
    }

    if (pres) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        Services.update(id, personObject, setPersons, persons, setErrorMessage)
        setNewName('')
        setNewNumber('')
      }
    } else {
      Services.AddPerson(personObject, setPersons, persons)
      setNewName('')
      setNewNumber('')
      setMessage(`Added ${newName}`)
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }

  const HandleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const HandleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const HandleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const inputs = [{
    text: 'name',
    value: newName,
    onChange: HandleNameChange
  }, {
    text: 'number',
    value: newNumber,
    onChange: HandleNumberChange
  }]

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type="message"/>
      <Notification message={errorMessage} type="error"/>
      <Input text="filter shown with" value={filter} onChange={HandleFilterChange} />

      <h2>add a new</h2>
      <Form onSubmit={AddValue} inputs={inputs} />

      <h2>Numbers</h2>
      <Persons
        persons={persons}
        filter={filter}
        setPersons={setPersons}
        setErrorMessage={setErrorMessage} />
    </div>
  )
}

export default App