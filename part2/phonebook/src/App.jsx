import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Display from './components/Persons'
import Filter from './components/Filter'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setnewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setNewSearch] = useState('')
  const [showFiltered, setShowFiltered] = useState([])

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        alert(`fail`)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const exist = persons.filter(person => person.name.toLowerCase() === newName.toLowerCase())
    if (exist.length !== 0) {
      if (window.confirm(`${newName} is already added to phonebook,
      replace the old number with a new one?`)) {
        const personObject = {
          name: newName,
          number: newNumber
        }
        personService
          .update(exist[0].id, personObject)
          .then(updatedPerson => {
            setPersons(persons.map(person => person.id !== updatedPerson.id ?
              person : updatedPerson))
          })
          .catch(error => {
            alert(`fail`)
          })
      }
    }
    else {
      const person = {
        name: newName,
        number: newNumber
      }

      personService
        .create(person)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
        })
        .catch(error => {
          alert(`fail`)
        })
    setnewName('')
    setNewNumber('')
    }
  }

  const removePerson = (personId, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService
        .remove(personId)
        .then(() => {
          const newPersons = persons.filter(person => person.id !== personId)
          setPersons(newPersons)
        })
        .catch(error => {
          alert(`fail`)
        })
    }
  }

  const handleNameChange = (event) => {
    setnewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    const result = event.target.value.toLowerCase()
    setNewSearch(result)
    setShowFiltered(persons.filter(person => person.name.toLowerCase().includes(result)))
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} handleSearchChange={handleSearchChange}/>
      <h3>add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange}
      handleNumberChange={handleNumberChange}/>
      <h3>Numbers</h3>
      <Display persons={showFiltered.length === 0 ? persons: showFiltered} removePerson={removePerson}/>
    </div>
  )
}

export default App