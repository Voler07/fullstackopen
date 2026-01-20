import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import Countries from './components/Countries'

const App = () => {
  const [searchWord, setSearchWord] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearchWord(event.target.value)
  }

  const countryToShow = countries.filter(
    item => item.name.common.toLowerCase().includes(searchWord.toLowerCase())
  )

  return (
    <div>
      <Filter 
        searchWord={searchWord}
        handleSearchChange={handleSearchChange}
      />
      <Countries
        countryToshow={countryToShow}
        setSearchWord={setSearchWord}
      />
    </div>
  )
}

export default App