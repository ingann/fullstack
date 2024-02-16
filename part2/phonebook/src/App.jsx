import { useState } from 'react'
import Person from './components/Person'
import AddPerson from './components/PersonForm'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setnewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

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

  return (
    <div>
      <h2>Phonebook</h2>
      <AddPerson addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange}
      handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <table>
        {persons.map(person =>
        <Person key={person.id} name={person.name} number={person.number}/>
        )}
      </table>
    </div>
  )
}

export default App