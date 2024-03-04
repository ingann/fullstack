import { useEffect, useState } from "react"
import axios from "axios"

const Weather = ( {capital} ) => {
    const api_key = import.meta.env.VITE_SOME_KEY
    const [weather, setWeather] = useState([])
}