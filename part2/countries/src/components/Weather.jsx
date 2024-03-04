import { useEffect, useState } from "react"
import axios from "axios"

const Weather = ( {capital} ) => {
    const api_key = import.meta.env.VITE_SOME_KEY
    const [weather, setWeather] = useState([])

    useEffect(() => {
        axios
            .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}}`)
            .then(response => {
                setWeather(response.data)
            })
    }, [])
    return (
        <div>
            <h2>Weather in {capital}</h2>
        </div>
    )
}

export default Weather