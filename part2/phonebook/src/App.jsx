import { useState, useEffect } from 'react'
import personService from './service/persons.js'
import Notification from './components/Notification.jsx'
import Persons from './components/Persons.jsx'
import Filter from './components/Filter.jsx'
import PersonForm from './components/PersonForm.jsx'



const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchWord, setSearchWord] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

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

    //if already exists
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
            setErrorMessage({error: false, message: `Updated ${newName}`})
            setTimeout(() => {
              setErrorMessage(null)
            }, 3000);
            setNewNumber('')
            setNewName('')
          })
          .catch(error => {
            console.log(error)
            setErrorMessage({
              error: true,
              message: `Information of ${newName} has already been removed from server`
            })
            setPersons(persons.filter(person => person.name !== newName))
            setTimeout(() => {
              setErrorMessage(null)
            }, 3000)
          })
      }
      setNewNumber('')
      setNewName('')
      return 
    }

    // add new person
    const personObject = {
      name: newName,
      number: newNumber,
      id: String(persons.length + 1)
    }

    personService
      .create(personObject)
      .then(response => {
        setPersons(persons.concat(response))
        setErrorMessage({error: false, message: `Added ${newName}`})
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000);
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        console.log(error)
        setErrorMessage({
          error: true, 
          message: `Information of ${newName} has already been removed from server`
        })
      })
      setPersons(persons.filter(person => person.name !== newName))
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
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

  const personToShow = persons.filter(
    item => item.name.toLowerCase().includes(searchWord)
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification errorMessage={errorMessage}/>
      <Filter 
        searchWord={searchWord}
        handleSearchChange={handleSearchChange}
      />
      <h2>add a new</h2>
      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons
        persons={personToShow}
        handleDelete={deletePerson}
      />
    </div>
  )
}

export default App
