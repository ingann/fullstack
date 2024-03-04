import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Display from './components/Countries'
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('')
  const [showFiltered, setShowFiltered] = useState([])

  useEffect(() => {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => {
          setCountries(response.data)
        })
        .catch(error => {
          console.error(`Error fetching data: ${error}`)
        })
  }, [])

  const onSearch = (event) => {
    const search = event.target.value.toLowerCase()
    setCountry(search)
    setShowFiltered(countries.filter(country => country.name.common.toLowerCase().includes(search)))
  }

  return (
    <div>
      <Filter search={country} handleChange={onSearch}/>
      <Display countries={showFiltered.length === 0 ? countries: showFiltered}/>
    </div>
  )
}

export default App