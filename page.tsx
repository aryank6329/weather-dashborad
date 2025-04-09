"use client"

import { useState } from "react"
import { Search, Cloud, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Weather condition options with their corresponding icons
const weatherConditions = [
  { condition: "clear sky", icon: "01d" },
  { condition: "few clouds", icon: "02d" },
  { condition: "scattered clouds", icon: "03d" },
  { condition: "broken clouds", icon: "04d" },
  { condition: "shower rain", icon: "09d" },
  { condition: "rain", icon: "10d" },
  { condition: "thunderstorm", icon: "11d" },
  { condition: "snow", icon: "13d" },
  { condition: "mist", icon: "50d" },
]

// List of random cities
const cities = [
  { name: "New York", country: "US" },
  { name: "London", country: "GB" },
  { name: "Paris", country: "FR" },
  { name: "Tokyo", country: "JP" },
  { name: "Sydney", country: "AU" },
  { name: "Berlin", country: "DE" },
  { name: "Rome", country: "IT" },
  { name: "Madrid", country: "ES" },
  { name: "Moscow", country: "RU" },
  { name: "Dubai", country: "AE" },
  { name: "Singapore", country: "SG" },
  { name: "Toronto", country: "CA" },
]

// Function to generate random weather data
const generateRandomWeather = (cityName) => {
  // Find the city in our list or create a random one
  const cityMatch = cities.find((city) => city.name.toLowerCase() === cityName.toLowerCase())

  const city = cityMatch || {
    name: cityName,
    country: ["US", "GB", "FR", "DE", "JP", "AU"][Math.floor(Math.random() * 6)],
  }

  // Random weather condition
  const weatherIndex = Math.floor(Math.random() * weatherConditions.length)
  const weather = weatherConditions[weatherIndex]

  // Random temperature between -10 and 40 degrees Celsius
  const temp = Math.floor(Math.random() * 50) - 10

  // Random feels like temperature (close to actual temperature)
  const feelsLike = temp + (Math.random() * 6 - 3)

  // Random humidity between 30% and 100%
  const humidity = Math.floor(Math.random() * 70) + 30

  // Random wind speed between 0 and 30 km/h
  const windSpeed = Math.random() * 30

  // Random pressure between 980 and 1040 hPa
  const pressure = Math.floor(Math.random() * 60) + 980

  // Random visibility between 1 and 10 km (in meters)
  const visibility = (Math.floor(Math.random() * 9) + 1) * 1000

  return {
    name: city.name,
    sys: {
      country: city.country,
    },
    weather: [
      {
        description: weather.condition,
        icon: weather.icon,
      },
    ],
    main: {
      temp: temp,
      feels_like: feelsLike,
      humidity: humidity,
      pressure: pressure,
    },
    wind: {
      speed: windSpeed / 3.6, // Convert to m/s for consistency with API
    },
    visibility: visibility,
  }
}

export default function WeatherDashboard() {
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchWeather = async (e) => {
    e.preventDefault()
    if (!city.trim()) return

    setLoading(true)
    setError("")
    setWeather(null)

    // Simulate network delay
    setTimeout(() => {
      try {
        // 10% chance of error for realism
        if (Math.random() < 0.1) {
          throw new Error("City not found. Please check the spelling and try again.")
        }

        const data = generateRandomWeather(city)
        setWeather(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }, 800) // Simulate network delay of 800ms
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center my-8 text-blue-800">Weather Dashboard</h1>

        <form onSubmit={fetchWeather} className="flex gap-2 mb-8">
          <Input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            <span className="ml-2">Search</span>
          </Button>
        </form>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && (
          <div className="flex justify-center my-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>
        )}

        {weather && (
          <Card className="w-full overflow-hidden shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">
                    {weather.name}, {weather.sys.country}
                  </CardTitle>
                  <CardDescription className="text-blue-100 mt-1">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt={weather.weather[0].description}
                    width={80}
                    height={80}
                    className="mb-1"
                  />
                  <span className="capitalize text-sm">{weather.weather[0].description}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-gray-800">{Math.round(weather.main.temp)}°C</span>
                  <div className="mt-2 text-gray-500">
                    <span>Feels like: {Math.round(weather.main.feels_like)}°C</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-500 text-sm">Humidity</span>
                    <span className="text-xl font-semibold text-gray-800">{weather.main.humidity}%</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-500 text-sm">Wind Speed</span>
                    <span className="text-xl font-semibold text-gray-800">
                      {(weather.wind.speed * 3.6).toFixed(1)} km/h
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-500 text-sm">Pressure</span>
                    <span className="text-xl font-semibold text-gray-800">{weather.main.pressure} hPa</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-500 text-sm">Visibility</span>
                    <span className="text-xl font-semibold text-gray-800">
                      {(weather.visibility / 1000).toFixed(1)} km
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 px-6 py-3">
              <div className="flex items-center text-gray-500 text-sm">
                <Cloud className="h-4 w-4 mr-2" />
                <span>Demo mode: Using randomly generated weather data</span>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
