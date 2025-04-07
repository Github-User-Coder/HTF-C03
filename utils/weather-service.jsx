// Weather impact mapping for construction activities
const WEATHER_IMPACT = {
  // Main weather conditions
  Clear: {
    impact: "Low",
    activities: {
      Excavation: { delay: 0, status: "Optimal" },
      Foundation: { delay: 0, status: "Optimal" },
      Framing: { delay: 0, status: "Optimal" },
      Roofing: { delay: 0, status: "Optimal" },
      Exterior: { delay: 0, status: "Optimal" },
      Interior: { delay: 0, status: "Optimal" },
    },
  },
  Clouds: {
    impact: "Low",
    activities: {
      Excavation: { delay: 0, status: "Optimal" },
      Foundation: { delay: 0, status: "Optimal" },
      Framing: { delay: 0, status: "Optimal" },
      Roofing: { delay: 0, status: "Optimal" },
      Exterior: { delay: 0, status: "Optimal" },
      Interior: { delay: 0, status: "Optimal" },
    },
  },
  Rain: {
    impact: "Moderate",
    activities: {
      Excavation: { delay: 2, status: "Delayed" },
      Foundation: { delay: 2, status: "Delayed" },
      Framing: { delay: 1, status: "Caution" },
      Roofing: { delay: 3, status: "Halted" },
      Exterior: { delay: 2, status: "Delayed" },
      Interior: { delay: 0, status: "Optimal" },
    },
  },
  Drizzle: {
    impact: "Low",
    activities: {
      Excavation: { delay: 1, status: "Caution" },
      Foundation: { delay: 1, status: "Caution" },
      Framing: { delay: 0, status: "Optimal" },
      Roofing: { delay: 2, status: "Delayed" },
      Exterior: { delay: 1, status: "Caution" },
      Interior: { delay: 0, status: "Optimal" },
    },
  },
  Thunderstorm: {
    impact: "High",
    activities: {
      Excavation: { delay: 3, status: "Halted" },
      Foundation: { delay: 3, status: "Halted" },
      Framing: { delay: 3, status: "Halted" },
      Roofing: { delay: 3, status: "Halted" },
      Exterior: { delay: 3, status: "Halted" },
      Interior: { delay: 1, status: "Caution" },
    },
  },
  Snow: {
    impact: "High",
    activities: {
      Excavation: { delay: 3, status: "Halted" },
      Foundation: { delay: 3, status: "Halted" },
      Framing: { delay: 2, status: "Delayed" },
      Roofing: { delay: 3, status: "Halted" },
      Exterior: { delay: 3, status: "Halted" },
      Interior: { delay: 1, status: "Caution" },
    },
  },
  Mist: {
    impact: "Low",
    activities: {
      Excavation: { delay: 1, status: "Caution" },
      Foundation: { delay: 1, status: "Caution" },
      Framing: { delay: 1, status: "Caution" },
      Roofing: { delay: 1, status: "Caution" },
      Exterior: { delay: 1, status: "Caution" },
      Interior: { delay: 0, status: "Optimal" },
    },
  },
  Fog: {
    impact: "Moderate",
    activities: {
      Excavation: { delay: 1, status: "Caution" },
      Foundation: { delay: 1, status: "Caution" },
      Framing: { delay: 2, status: "Delayed" },
      Roofing: { delay: 2, status: "Delayed" },
      Exterior: { delay: 2, status: "Delayed" },
      Interior: { delay: 0, status: "Optimal" },
    },
  },
  Haze: {
    impact: "Low",
    activities: {
      Excavation: { delay: 1, status: "Caution" },
      Foundation: { delay: 0, status: "Optimal" },
      Framing: { delay: 0, status: "Optimal" },
      Roofing: { delay: 1, status: "Caution" },
      Exterior: { delay: 1, status: "Caution" },
      Interior: { delay: 0, status: "Optimal" },
    },
  },
  Dust: {
    impact: "Moderate",
    activities: {
      Excavation: { delay: 1, status: "Caution" },
      Foundation: { delay: 1, status: "Caution" },
      Framing: { delay: 1, status: "Caution" },
      Roofing: { delay: 1, status: "Caution" },
      Exterior: { delay: 2, status: "Delayed" },
      Interior: { delay: 1, status: "Caution" },
    },
  },
  default: {
    impact: "Unknown",
    activities: {
      Excavation: { delay: 1, status: "Caution" },
      Foundation: { delay: 1, status: "Caution" },
      Framing: { delay: 1, status: "Caution" },
      Roofing: { delay: 1, status: "Caution" },
      Exterior: { delay: 1, status: "Caution" },
      Interior: { delay: 0, status: "Optimal" },
    },
  },
}

// Get current weather data
export async function getWeather(location) {
  try {
    // Ensure location is a string
    const locationStr = typeof location === "object" ? "Mumbai" : String(location)

    console.log("Fetching weather data for:", locationStr)

    const response = await fetch(`/api/weather?location=${encodeURIComponent(locationStr)}`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
      },
    })

    if (!response.ok) {
      console.error("Weather API response not OK:", response.status, response.statusText)
      throw new Error(`Failed to fetch weather data: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Weather data received:", data ? "success" : "empty")
    return data
  } catch (error) {
    console.error("Error in getWeather function:", error.message)
    // Return a minimal valid weather object that won't break the UI
    return {
      weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
      main: { temp: 30, humidity: 60 },
      wind: { speed: 3 },
      name: typeof location === "string" ? location : "Mumbai",
    }
  }
}

// Get 5-day forecast
export async function getWeatherForecast(location) {
  try {
    // Ensure location is a string
    const locationStr = typeof location === "object" ? "Mumbai" : String(location)

    console.log("Fetching forecast data for:", locationStr)

    const response = await fetch(`/api/forecast?location=${encodeURIComponent(locationStr)}`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
      },
    })

    if (!response.ok) {
      console.error("Forecast API response not OK:", response.status, response.statusText)
      throw new Error(`Failed to fetch forecast data: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Forecast data received:", data && data.list ? "success" : "empty")
    return data
  } catch (error) {
    console.error("Error in getWeatherForecast function:", error.message)
    // Return minimal valid forecast data
    return {
      list: [
        {
          dt: Math.floor(Date.now() / 1000),
          main: { temp: 30 },
          weather: [{ main: "Clear" }],
          wind: { speed: 3 },
        },
      ],
    }
  }
}

// Analyze weather impact on construction
export function analyzeWeatherImpact(weatherData) {
  if (!weatherData || !weatherData.weather || !weatherData.weather[0]) {
    return WEATHER_IMPACT.default
  }

  const mainWeather = weatherData.weather[0].main
  const impact = WEATHER_IMPACT[mainWeather] || WEATHER_IMPACT.default

  // Adjust for temperature extremes
  const temp = weatherData.main.temp
  let tempImpact = { impact: "Low", activities: {} }

  if (temp > 35) {
    tempImpact = {
      impact: "Moderate",
      activities: {
        Excavation: { delay: 1, status: "Caution" },
        Foundation: { delay: 2, status: "Delayed" }, // Concrete curing issues
        Framing: { delay: 1, status: "Caution" },
        Roofing: { delay: 2, status: "Delayed" }, // Heat exposure risk
        Exterior: { delay: 1, status: "Caution" },
        Interior: { delay: 0, status: "Optimal" },
      },
    }
  } else if (temp < 5) {
    tempImpact = {
      impact: "Moderate",
      activities: {
        Excavation: { delay: 1, status: "Caution" },
        Foundation: { delay: 2, status: "Delayed" }, // Concrete freezing risk
        Framing: { delay: 1, status: "Caution" },
        Roofing: { delay: 1, status: "Caution" },
        Exterior: { delay: 2, status: "Delayed" },
        Interior: { delay: 0, status: "Optimal" },
      },
    }
  }

  // Combine weather and temperature impacts
  const combinedImpact = {
    impact:
      impact.impact === "High"
        ? "High"
        : impact.impact === "Moderate" || tempImpact.impact === "Moderate"
          ? "Moderate"
          : "Low",
    activities: {},
  }

  // Combine activity impacts (take the worse of the two)
  for (const activity in impact.activities) {
    const weatherDelay = impact.activities[activity].delay
    const tempDelay = tempImpact.activities[activity]?.delay || 0
    const maxDelay = Math.max(weatherDelay, tempDelay)

    let status
    if (maxDelay === 0) status = "Optimal"
    else if (maxDelay === 1) status = "Caution"
    else if (maxDelay === 2) status = "Delayed"
    else status = "Halted"

    combinedImpact.activities[activity] = {
      delay: maxDelay,
      status: status,
    }
  }

  return {
    ...combinedImpact,
    condition: mainWeather,
    temperature: temp,
    humidity: weatherData.main.humidity,
    windSpeed: weatherData.wind.speed,
    description: weatherData.weather[0].description,
    icon: weatherData.weather[0].icon,
  }
}

// Process forecast data into daily summaries
export function processForecast(forecastData) {
  if (!forecastData || !forecastData.list) {
    return []
  }

  const dailyForecasts = {}

  // Group forecast by day
  forecastData.list.forEach((item) => {
    const date = new Date(item.dt * 1000)
    const day = date.toISOString().split("T")[0]

    if (!dailyForecasts[day]) {
      dailyForecasts[day] = {
        date: day,
        forecasts: [],
      }
    }

    dailyForecasts[day].forecasts.push(item)
  })

  // Process each day to get summary
  const processedForecast = Object.values(dailyForecasts).map((day) => {
    // Find the worst weather condition for the day
    let worstImpact = "Low"
    let mainWeather = "Clear"
    let icon = "01d"
    let maxTemp = -100
    let minTemp = 100
    let maxWind = 0

    day.forecasts.forEach((forecast) => {
      const weather = forecast.weather[0].main
      const impact = WEATHER_IMPACT[weather]?.impact || "Low"
      const temp = forecast.main.temp
      const wind = forecast.wind.speed

      // Update worst impact
      if (
        impact === "High" ||
        (impact === "Moderate" && worstImpact !== "High") ||
        (impact === "Low" && worstImpact === "Unknown")
      ) {
        worstImpact = impact
        mainWeather = weather
        icon = forecast.weather[0].icon
      }

      // Update temperature range
      if (temp > maxTemp) maxTemp = temp
      if (temp < minTemp) minTemp = temp

      // Update max wind
      if (wind > maxWind) maxWind = wind
    })

    // Get impact on activities
    const activities = WEATHER_IMPACT[mainWeather]?.activities || WEATHER_IMPACT.default.activities

    return {
      date: day.date,
      condition: mainWeather,
      impact: worstImpact,
      icon: icon,
      temperature: {
        min: Math.round(minTemp),
        max: Math.round(maxTemp),
      },
      windSpeed: maxWind,
      activities: activities,
    }
  })

  return processedForecast
}

// Generate schedule recommendations based on weather forecast
export function generateScheduleRecommendations(forecast, currentActivities) {
  if (!forecast || forecast.length === 0 || !currentActivities) {
    return []
  }

  const recommendations = []

  // Check each activity against the forecast
  for (const activity of currentActivities) {
    const activityName = activity.name
    const bestDays = []
    const worstDays = []

    // Find best and worst days for this activity
    forecast.forEach((day) => {
      const impact = day.activities[activityName]
      if (impact) {
        if (impact.status === "Optimal") {
          bestDays.push({
            date: day.date,
            condition: day.condition,
          })
        } else if (impact.status === "Halted" || impact.status === "Delayed") {
          worstDays.push({
            date: day.date,
            condition: day.condition,
            status: impact.status,
          })
        }
      }
    })

    // Generate recommendations
    if (bestDays.length > 0) {
      recommendations.push({
        activity: activityName,
        type: "optimal",
        message: `Schedule ${activityName} on ${bestDays.map((d) => formatDate(d.date)).join(", ")} for optimal conditions.`,
        days: bestDays,
      })
    }

    if (worstDays.length > 0) {
      recommendations.push({
        activity: activityName,
        type: "avoid",
        message: `Avoid ${activityName} on ${worstDays.map((d) => formatDate(d.date)).join(", ")} due to ${worstDays[0].condition.toLowerCase()} conditions.`,
        days: worstDays,
      })
    }
  }

  return recommendations
}

// Helper function to format date
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}

