import { useState, useEffect } from 'react'
import personService from './service/persons.js'

const Persons = ({persons, handleDelete}) => {
  return (
  <ul>
        {persons.map(person => 
          (<li key={person.name}>
            {person.name} {person.number}
            <button onClick={() => {handleDelete(person.id, person.name)}}>
              delete
            </button>
          </li>
        ))}
  </ul>
  )
}

const PersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange
}) => (
  <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
)

const Filter = ({
  searchWord,
  handleSearchChange
}) => (
  <div>
        filter shown with <input value={searchWord} onChange={handleSearchChange}/>
  </div>
) 

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchWord, setSearchWord] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearchWord(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const exist = persons.find(person => person.name == newName)
    if (exist){
      if(window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)){
        const newObject = {
          ...exist,
          number: newNumber
        }
        personService
          .update(exist.id, newObject)
          .then(response => {
            setPersons(persons.map(person => person.id !== exist.id ? person : response))
            setNewNumber('')
            setNewName('')
          })
      }
      setNewNumber('')
      setNewName('')
      return 
    }
    const personObject = {
      name: newName,
      number: newNumber,
      id: String(persons.length + 1)
    }
    if (persons.some(item => item.name === newName)){
      alert(`${newName} is already added to phonebook`)
      return
    }

    personService
      .create(personObject)
      .then(response => {
        setPersons(persons.concat(response))
        setNewName('')
        setNewNumber('')
      })
  }

  const deletePerson = (id, name) => {
      if (window.confirm(`Delete ${name}`)){
        personService
          .remove(id)
          .then(() => {
            setPersons(persons.filter(person => person.id !== id))
          })
          .catch(error => {
            console.log(error)
            alert(`The person ${name} was already deleted from the server.`)
            setPersons(persons.filter(person => person.id !== id))
          })
      }
    }

  const personToShow = persons.filter(item => item.name.toLowerCase().includes(searchWord))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchWord={searchWord} handleSearchChange={handleSearchChange}/>
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons persons={personToShow} handleDelete={deletePerson}/>
    </div>
  )
}

export default App
