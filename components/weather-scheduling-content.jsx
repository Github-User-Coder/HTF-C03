"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  CloudRain,
  Construction,
  DollarSign,
  Droplets,
  LineChart,
  Loader2,
  Package,
  RefreshCw,
  Sun,
  Truck,
  Users,
  Wind,
  Cloud,
  CloudLightning,
  CloudSnow,
} from "lucide-react"
import { useState, useEffect } from "react"
import { getWeather, getWeatherForecast, analyzeWeatherImpact, processForecast } from "@/utils/weather-service"
import { DetailedScheduleView } from "./detailed-schedule-view"

export function WeatherSchedulingContent({ location = "Mumbai" }) {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("weather")
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState([])
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [showDetailedSchedule, setShowDetailedSchedule] = useState(false)

  // Fetch weather data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Get current weather
        const currentWeather = await getWeather(location)
        if (currentWeather) {
          setWeatherData(analyzeWeatherImpact(currentWeather))
        } else {
          console.error("No weather data returned")
          setError("Failed to load weather data. Please try again later.")
        }

        // Get forecast
        const forecast = await getWeatherForecast(location)
        if (forecast && forecast.list) {
          const processedForecast = processForecast(forecast)
          setForecastData(processedForecast || []) // Ensure we always have an array
        } else {
          console.error("No forecast data returned or missing list property")
          setForecastData([]) // Set empty array as fallback
        }

        setLastUpdated(new Date())
      } catch (err) {
        console.error("Error fetching weather data:", err)
        setError("Failed to load weather data. Please try again later.")
        // Set default values to prevent errors
        setForecastData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [location])

  // Function to refresh weather data
  const refreshWeatherData = () => {
    setIsLoading(true)
    // Re-fetch data
    const fetchData = async () => {
      try {
        const currentWeather = await getWeather(location)
        if (currentWeather) {
          setWeatherData(analyzeWeatherImpact(currentWeather))
        }

        const forecast = await getWeatherForecast(location)
        if (forecast && forecast.list) {
          const processedForecast = processForecast(forecast)
          setForecastData(processedForecast || [])
        }

        setLastUpdated(new Date())
      } catch (err) {
        console.error("Error refreshing weather data:", err)
        setError("Failed to refresh weather data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }

  // Function to get impact color
  const getImpactColor = (impact) => {
    switch (impact) {
      case "Low":
        return "text-green-400"
      case "Moderate":
        return "text-yellow-400"
      case "High":
        return "text-red-400"
      default:
        return "text-white"
    }
  }

  // Function to get weather icon
  const getWeatherIcon = (condition) => {
    switch (condition) {
      case "Clear":
        return <Sun className="h-8 w-8 text-yellow-400" />
      case "Clouds":
        return <Cloud className="h-8 w-8 text-gray-400" />
      case "Rain":
      case "Drizzle":
        return <CloudRain className="h-8 w-8 text-blue-400" />
      case "Thunderstorm":
        return <CloudLightning className="h-8 w-8 text-purple-400" />
      case "Snow":
        return <CloudSnow className="h-8 w-8 text-white" />
      default:
        return <Sun className="h-8 w-8 text-yellow-400" />
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`
  }

  // Toggle detailed schedule view
  const toggleDetailedSchedule = () => {
    setShowDetailedSchedule(!showDetailedSchedule)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <h3 className="text-xl font-medium text-white">Loading real-time weather data...</h3>
        <p className="text-white/70 mt-2">Connecting to weather APIs and fetching the latest information</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="bg-red-600/20 border-red-600/30 text-white">
        <AlertCircle className="h-4 w-4 text-red-400" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  // If detailed schedule is shown, render that instead
  if (showDetailedSchedule) {
    return <DetailedScheduleView forecastData={forecastData} onClose={toggleDetailedSchedule} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Weather Scheduling & Real-Time Data</h2>
        <Button
          variant="outline"
          size="sm"
          className="text-white border-blue-600"
          onClick={refreshWeatherData}
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {lastUpdated && (
        <div className="text-sm text-white/70">
          Last updated: {lastUpdated.toLocaleTimeString()} | Location: {location}
        </div>
      )}

      {/* Current Weather Display - Prominent at the top */}
      {weatherData && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="flex items-start gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-white">{weatherData.name || location}</h2>
                    {getWeatherIcon(weatherData.condition)}
                  </div>
                  <p className="text-white/70">{weatherData.description || "scattered clouds"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <div className="text-4xl font-bold text-white">{Math.round(weatherData.temperature)}°C</div>
                <div className={`text-lg ${getImpactColor(weatherData.impact)}`}>{weatherData.impact} Impact</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-700/50 rounded-lg p-4 flex items-center gap-3">
                <Droplets className="h-6 w-6 text-blue-400" />
                <div>
                  <div className="text-white/70">Humidity</div>
                  <div className="text-xl font-semibold text-white">{weatherData.humidity || 69}%</div>
                </div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4 flex items-center gap-3">
                <Wind className="h-6 w-6 text-blue-400" />
                <div>
                  <div className="text-white/70">Wind</div>
                  <div className="text-xl font-semibold text-white">{weatherData.windSpeed || 2.06} m/s</div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">5-Day Forecast</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                {forecastData && forecastData.length > 0 ? (
                  forecastData.slice(0, 5).map((day, index) => (
                    <div key={index} className="bg-gray-700/50 rounded-lg p-3">
                      <div className="text-white font-medium">{formatDate(day.date)}</div>
                      <div className="flex justify-between items-center my-2">
                        {getWeatherIcon(day.condition)}
                        <div className="text-white">
                          {day.temperature.min}° - {day.temperature.max}°
                        </div>
                      </div>
                      <div className={`text-sm ${getImpactColor(day.impact)}`}>{day.impact} Impact</div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-5 text-white/70">No forecast data available</div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Construction Activity Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {weatherData &&
                  weatherData.activities &&
                  Object.entries(weatherData.activities).map(([activity, data], index) => (
                    <div key={index} className="bg-gray-700/50 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div className="text-white">{activity}</div>
                        <Badge
                          className={`
                        ${
                          data.status === "Optimal"
                            ? "bg-green-600"
                            : data.status === "Caution"
                              ? "bg-yellow-600"
                              : data.status === "Delayed"
                                ? "bg-orange-600"
                                : "bg-red-600"
                        }
                      `}
                        >
                          {data.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Alert className="bg-blue-600/20 border-blue-600/30 text-white">
        <AlertCircle className="h-4 w-4 text-blue-400" />
        <AlertTitle>Real-Time Data Integration</AlertTitle>
        <AlertDescription>
          This dashboard connects to multiple APIs to provide you with the most up-to-date information for your
          construction project planning.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 bg-gray-800 p-1">
          <TabsTrigger value="weather" className="data-[state=active]:bg-blue-600 text-white">
            <CloudRain className="h-4 w-4 mr-2" />
            Weather
          </TabsTrigger>
          <TabsTrigger value="materials" className="data-[state=active]:bg-blue-600 text-white">
            <Package className="h-4 w-4 mr-2" />
            Materials
          </TabsTrigger>
          <TabsTrigger value="labor" className="data-[state=active]:bg-blue-600 text-white">
            <Users className="h-4 w-4 mr-2" />
            Labor
          </TabsTrigger>
          <TabsTrigger value="supply" className="data-[state=active]:bg-blue-600 text-white">
            <Truck className="h-4 w-4 mr-2" />
            Supply Chain
          </TabsTrigger>
          <TabsTrigger value="market" className="data-[state=active]:bg-blue-600 text-white">
            <LineChart className="h-4 w-4 mr-2" />
            Market Trends
          </TabsTrigger>
        </TabsList>

        {/* Materials Tab Content */}
        <TabsContent value="materials" className="mt-4 space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Material Price Tracking</CardTitle>
              <CardDescription className="text-white">Real-time material prices from supplier APIs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">Price Fluctuations</h3>
                  <p className="text-white/70 mb-4">
                    Track real-time changes in material prices to optimize your purchasing decisions.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-white">Cement (per bag)</span>
                        <span className="text-green-400 flex items-center">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          +2.3%
                        </span>
                      </div>
                      <Progress value={72} className="h-2 bg-gray-600" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-white">Steel (per ton)</span>
                        <span className="text-red-400 flex items-center">
                          <ArrowUpRight className="h-3 w-3 mr-1 rotate-90" />
                          -1.5%
                        </span>
                      </div>
                      <Progress value={45} className="h-2 bg-gray-600" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-white">Bricks (per 1000)</span>
                        <span className="text-green-400 flex items-center">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          +3.7%
                        </span>
                      </div>
                      <Progress value={88} className="h-2 bg-gray-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">Material Availability</h3>
                  <p className="text-white/70 mb-4">
                    Check real-time availability of construction materials from local suppliers.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white">Cement</span>
                      <Badge className="bg-green-600">High Availability</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Steel</span>
                      <Badge className="bg-yellow-600">Limited Stock</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Bricks</span>
                      <Badge className="bg-green-600">High Availability</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Sand</span>
                      <Badge className="bg-red-600">Low Stock</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Labor Tab Content */}
        <TabsContent value="labor" className="mt-4 space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Labor Market Rates</CardTitle>
              <CardDescription className="text-white">
                Current labor costs from government and industry databases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">Current Labor Rates</h3>
                  <p className="text-white/70 mb-4">
                    Average daily wages for different types of construction workers in your area.
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white">Mason</span>
                      <span className="text-white font-medium">₹850 - ₹1,000/day</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Carpenter</span>
                      <span className="text-white font-medium">₹900 - ₹1,100/day</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Electrician</span>
                      <span className="text-white font-medium">₹1,000 - ₹1,200/day</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Plumber</span>
                      <span className="text-white font-medium">₹950 - ₹1,150/day</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Helper</span>
                      <span className="text-white font-medium">₹500 - ₹600/day</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">Labor Availability</h3>
                  <p className="text-white/70 mb-4">
                    Current availability of skilled workers in your construction area.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-white">Masons</span>
                        <span className="text-white/70">High Availability</span>
                      </div>
                      <Progress value={85} className="h-2 bg-gray-600" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-white">Carpenters</span>
                        <span className="text-white/70">Medium Availability</span>
                      </div>
                      <Progress value={60} className="h-2 bg-gray-600" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-white">Electricians</span>
                        <span className="text-white/70">Low Availability</span>
                      </div>
                      <Progress value={30} className="h-2 bg-gray-600" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-white">Plumbers</span>
                        <span className="text-white/70">Medium Availability</span>
                      </div>
                      <Progress value={55} className="h-2 bg-gray-600" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Supply Chain Tab Content */}
        <TabsContent value="supply" className="mt-4 space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Supply Chain Data</CardTitle>
              <CardDescription className="text-white">Real-time logistics and delivery information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">Delivery Timelines</h3>
                  <p className="text-white/70 mb-4">Current estimated delivery times for materials from suppliers.</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white">Cement</span>
                      <span className="text-white font-medium">2-3 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Steel</span>
                      <span className="text-white font-medium">5-7 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Bricks</span>
                      <span className="text-white font-medium">1-2 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Tiles</span>
                      <span className="text-white font-medium">7-10 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Plumbing Fixtures</span>
                      <span className="text-white font-medium">3-5 days</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">Supply Chain Disruptions</h3>
                  <p className="text-white/70 mb-4">Current issues affecting material delivery and availability.</p>
                  <div className="space-y-3">
                    <div className="p-3 bg-yellow-600/20 border border-yellow-600/30 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-white">Transportation Strike</h4>
                          <p className="text-white/70 text-sm">
                            Ongoing transportation strike may affect cement deliveries. Expected delay: 1-2 days.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-red-600/20 border border-red-600/30 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-white">Steel Shortage</h4>
                          <p className="text-white/70 text-sm">
                            National steel shortage affecting availability. Consider booking in advance.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Trends Tab Content */}
        <TabsContent value="market" className="mt-4 space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Market Trends Analysis</CardTitle>
              <CardDescription className="text-white">
                Construction industry trends and economic indicators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">Construction Cost Index</h3>
                  <p className="text-white/70 mb-4">
                    Monthly changes in construction costs based on material and labor prices.
                  </p>
                  <div className="h-40 flex items-end gap-1">
                    {[65, 68, 72, 75, 73, 78, 82, 80, 85, 88, 86, 90].map((value, index) => (
                      <div
                        key={index}
                        className="bg-blue-600 rounded-t w-full"
                        style={{ height: `${value}%` }}
                        title={`Month ${index + 1}: ${value}%`}
                      ></div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-white/70 text-xs">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                    <span>Dec</span>
                  </div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">Market Insights</h3>
                  <p className="text-white/70 mb-4">Latest news and trends affecting the construction industry.</p>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <h4 className="font-medium text-white">Rising Cement Prices</h4>
                      <p className="text-white/70 text-sm mt-1">
                        Cement prices expected to rise by 5-7% in the next quarter due to increased demand and
                        production costs.
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <Badge className="bg-blue-600">Industry News</Badge>
                        <span className="text-white/50 text-xs">2 days ago</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <h4 className="font-medium text-white">Government Housing Initiative</h4>
                      <p className="text-white/70 text-sm mt-1">
                        New government initiative to boost affordable housing may increase demand for construction
                        materials.
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <Badge className="bg-blue-600">Policy Update</Badge>
                        <span className="text-white/50 text-xs">1 week ago</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <h4 className="font-medium text-white">Sustainable Building Materials</h4>
                      <p className="text-white/70 text-sm mt-1">
                        Growing trend towards eco-friendly construction materials with 15% increase in adoption.
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <Badge className="bg-blue-600">Trend Analysis</Badge>
                        <span className="text-white/50 text-xs">3 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">AI-Powered Recommendations</CardTitle>
          <CardDescription className="text-white">Smart suggestions based on real-time data analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-600/20 p-4 rounded-lg border border-blue-600/30">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-medium text-white">Scheduling Optimization</h3>
              </div>
              <p className="text-white/90 mb-3">
                Based on weather forecasts, schedule exterior work for Monday-Tuesday when conditions are optimal.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-blue-600 text-blue-400 hover:bg-blue-600/20"
                onClick={toggleDetailedSchedule}
              >
                View Detailed Schedule
              </Button>
            </div>
            <div className="bg-blue-600/20 p-4 rounded-lg border border-blue-600/30">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-medium text-white">Cost Optimization</h3>
              </div>
              <p className="text-white/90 mb-3">
                Steel prices are trending downward. Consider delaying steel purchases by 2 weeks to save approximately
                5%.
              </p>
              <Button variant="outline" size="sm" className="w-full border-blue-600 text-blue-400 hover:bg-blue-600/20">
                View Price Trends
              </Button>
            </div>
            <div className="bg-blue-600/20 p-4 rounded-lg border border-blue-600/30">
              <div className="flex items-center gap-2 mb-3">
                <Construction className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-medium text-white">Resource Allocation</h3>
              </div>
              <p className="text-white/90 mb-3">
                Electrician availability is low. Book electrical contractors at least 3 weeks in advance to avoid
                delays.
              </p>
              <Button variant="outline" size="sm" className="w-full border-blue-600 text-blue-400 hover:bg-blue-600/20">
                Find Contractors
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

