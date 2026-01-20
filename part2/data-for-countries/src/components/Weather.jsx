import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ 
    city,
    lat,
    lon,
 }) => {
    const [weather, setWeather] = useState(null)
    const api_key = import.meta.env.VITE_WEATHER_KEY

    useEffect(() => {
        axios
          .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`)
          .then(response => {
            setWeather(response.data)
          })
    }, [city])

    if (!weather) return null

    return (
        <div>
            <h2>Weather in {city}</h2>
            <p>Temperature {weather.main.temp} Celsius</p>
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="icon" />
            <p>Wind {weather.wind.speed} m/s</p>
        </div>
    )
}

export default Weather