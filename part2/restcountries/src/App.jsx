import { useState, useEffect } from 'react'
import axios from 'axios'

const countriesUrl = "https://studies.cs.helsinki.fi/restcountries/"
const api_key = import.meta.env.VITE_API_KEY

const Note = ({ message }) => {
  return (
    <>
      <p>{message}</p>
    </>
  )
}

const List = ({ state, name, onShow }) => {
  return (
    <>
      <p>{name}
        <button onClick={() => onShow(state)}>Show</button>
      </p>
    </>
  )
}

const getWeather = (country, api_key) => {
  return axios
    .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${api_key}`)
}


const Specific = ({ state }) => {
  const [weather, setWeather] = useState({})

  const hook = () => {
    getWeather(state, api_key).then(response => setWeather(response.data))
  }

  useEffect(hook, [state])

  return (
    <>
      <h1>{state.name.common}</h1>
      <p>Capital {state.capital}</p>
      <p>Area {state.area}</p>
      <h1>Languages</h1>
      <ul>
        {Object.values(state.languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img src={state.flags.png} alt={state.flags.alt} />
      <h1>Weather in {state.capital}</h1>
      <p>Temperature {weather.main ? (weather.main.temp - 273.15).toFixed(2) : null} celsius</p>
      <img
        src={weather.weather ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png` : null}
        alt={weather.weather ? weather.weather[0].description : null}
      />
      <p>Wind {weather.main ? (weather.wind.speed).toFixed(2) : null} m/s</p>
    </>
  )
}

const Input = ({ text, value, onChange }) => {
  return (
    <div>
      {text}: <input value={value}
        onChange={onChange} />
    </div>
  )
}

const Countries = ({ countries, filter, selected, setSelected }) => {
  let states = countries.filter(countrie => countrie.name.common.toLowerCase().includes(filter.toLowerCase()))
  let i = 0
  states.forEach(element => {
    i++
  })
  if (i == 1) {
    return (
      <>
        {states.map(state => {
          return (
            <Specific key={state.name.common} state={state} />
          )
        }
        )
        }
      </>
    )
  } else if (i > 1 && i < 10) {
    if (selected) {
      return (
        <>
          <Specific key={selected.name.common} state={selected} />
        </>
      )
    } else {
      return (
        <>
          {states.map(state => {
            return (
              <List
                key={state.name.common}
                state={state}
                name={state.name.common}
                onShow={setSelected} />
            )
          }
          )}
        </>
      )
    }
  } else {
    return (
      <Note message="Too many matches, specify another filter" />
    )
  }
}

const getCountries = () => {
  return axios.get(`${countriesUrl}/api/all`)
}


function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState(null)

  const hook = () => {
    getCountries().then(response => {
      setCountries(response.data)
    })
  }

  useEffect(hook, [])

  const HandleFilterChange = (event) => {
    setFilter(event.target.value)
    setSelected(null)
  }

  return (
    <>
      <Input text="filter shown with" value={filter} onChange={HandleFilterChange} />
      <Countries
        countries={countries}
        filter={filter}
        selected={selected}
        setSelected={setSelected} />
    </>
  )
}

export default App
