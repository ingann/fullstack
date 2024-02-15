import { useState } from 'react'
import Person from './components/Person'
import AddPerson from './components/PersonForm'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas'},
    { name: 'Ada Lovelace'}
  ])
  const [newName, setnewName] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const exist = persons.filter(person => person.name === newName)
    if (exist.length !== 0) {
      window.alert(`${newName} is already added to phonebook`)
    }
    else {
      const person = {
        name: newName
      }
      setPersons(persons.concat(person))
      setnewName('')
    }
  }

  const handleBookChange = (event) => {
    setnewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <AddPerson addPerson={addPerson} newName={newName} handleBookChange={handleBookChange}/>
      <h2>Numbers</h2>
      <div>{persons.map(person =>
        <Person key={person.name} name={person.name}/>
        )}
      </div>
    </div>
  )
}

export default App