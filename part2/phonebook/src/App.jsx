import { useState } from 'react'
import AddPerson from './components/PersonForm'
import Display from './components/Persons'
import Filter from './components/Filter'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setnewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setNewSearch] = useState('')

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
    setNewSearch(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter persons={persons} search={search} handleSearchChange={handleSearchChange}/>
      <h3>add a new</h3>
      <AddPerson addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange}
      handleNumberChange={handleNumberChange}/>
      <h3>Numbers</h3>
      <Display persons={persons}/>
    </div>
  )
}

export default App