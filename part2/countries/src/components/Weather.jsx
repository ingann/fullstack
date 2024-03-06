import { useEffect, useState } from "react"
import axios from "axios"

const Weather = ({ capital }) => {
    const api_key = import.meta.env.VITE_SOME_KEY
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const response = await axios
                    .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`)
                setWeather(response.data)
            } catch (error) {
                console.error("Error fetching weather data:", error)
            }
        }
        fetchWeatherData()
    }, [capital, api_key])

    if (weather) {
        return (
            <div>
                <h2>Weather in {capital}</h2>
                <p>temperature {weather.main.temp} Celcius</p>
                <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={`${weather.weather[0].description} icon`}/>
                <p>wind {weather.wind.speed} m/s</p>
            </div>
        )
    }
}

export default Weather
