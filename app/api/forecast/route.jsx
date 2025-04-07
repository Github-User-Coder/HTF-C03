import { NextResponse } from "next/server"

// Generate a 5-day forecast with mock data
function generateMockForecast(location) {
  const list = []
  const now = Date.now()
  const day = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

  // Weather conditions to cycle through
  const conditions = ["Clear", "Clouds", "Rain", "Clear", "Clouds"]
  const icons = ["01d", "02d", "10d", "01d", "03d"]

  // Generate 5 days of forecast data with 3-hour intervals
  for (let i = 0; i < 5; i++) {
    // Create 8 entries per day (3-hour intervals)
    for (let j = 0; j < 8; j++) {
      const timestamp = now + i * day + j * 3 * 60 * 60 * 1000
      const hourOfDay = new Date(timestamp).getHours()

      // Temperature varies by time of day
      let temp = 30 // base temp
      if (hourOfDay >= 10 && hourOfDay <= 16) {
        temp += 5 // warmer during day
      } else if (hourOfDay >= 0 && hourOfDay <= 5) {
        temp -= 5 // cooler at night
      }

      // Add some randomness
      temp += Math.random() * 3 - 1.5

      list.push({
        dt: Math.floor(timestamp / 1000),
        main: {
          temp: temp,
          feels_like: temp + 2,
          temp_min: temp - 1,
          temp_max: temp + 1,
          pressure: 1010,
          humidity: 65 + Math.random() * 20,
        },
        weather: [
          {
            id: 800,
            main: conditions[i],
            description: conditions[i].toLowerCase(),
            icon: icons[i],
          },
        ],
        clouds: { all: Math.floor(Math.random() * 100) },
        wind: { speed: 2 + Math.random() * 5, deg: Math.floor(Math.random() * 360) },
        visibility: 10000,
        pop: Math.random(),
        sys: { pod: hourOfDay >= 6 && hourOfDay < 18 ? "d" : "n" },
        dt_txt: new Date(timestamp).toISOString(),
      })
    }
  }

  return {
    cod: "200",
    message: 0,
    cnt: list.length,
    list: list,
    city: {
      id: 1275339,
      name: location,
      coord: { lat: 19.0144, lon: 72.8479 },
      country: "IN",
      population: 12442373,
      timezone: 19800,
      sunrise: Math.floor(now / 1000 - 21600),
      sunset: Math.floor(now / 1000 + 21600),
    },
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  let location = searchParams.get("location")

  // Ensure location is a valid string
  if (!location || typeof location === "object") {
    location = "Mumbai" // Default to Mumbai if location is invalid
  }

  try {
    console.log("Forecast API called for location:", location)

    // Generate mock forecast data
    const mockForecast = generateMockForecast(location)

    return NextResponse.json(mockForecast)
  } catch (error) {
    console.error("Error in forecast API route:", error.message)

    // Return mock data as fallback
    const mockForecast = generateMockForecast(location)
    return NextResponse.json(mockForecast)
  }
}

