import { useState } from 'react'
import AddPerson from './components/PersonForm'
import Display from './components/Persons'
import Filter from './components/Filter'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setnewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setNewSearch] = useState('')
  const [showFiltered, setShowFiltered] = useState([])

  const addPerson = (event) => {
    event.preventDefault()
    const exist = persons.filter(person => person.name === newName)
    if (exist.length !== 0) {
      window.alert(`${newName} is already added to phonebook`)
    }
    else {
      const person = {
        name: newName,
        number: newNumber,
        id: persons.length + 1
      }
      setPersons(persons.concat(person))
    }
    setnewName('')
    setNewNumber('')
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
      <AddPerson addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange}
      handleNumberChange={handleNumberChange}/>
      <h3>Numbers</h3>
      <Display persons={showFiltered.length === 0 ? persons: showFiltered}/>
    </div>
  )
}

export default App