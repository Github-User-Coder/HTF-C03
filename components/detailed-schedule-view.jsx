"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertCircle,
  Calendar,
  Clock,
  CloudRain,
  Construction,
  DollarSign,
  FileText,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react"

// Generate a schedule for a specific day based on weather conditions
const generateDailySchedule = (date, weatherCondition, impact, laborAvailability) => {
  // Base activities for construction
  const activities = [
    { name: "Excavation", duration: "3 hours", priority: "High", laborNeeded: 4 },
    { name: "Foundation Work", duration: "5 hours", priority: "Critical", laborNeeded: 6 },
    { name: "Framing", duration: "4 hours", priority: "High", laborNeeded: 5 },
    { name: "Roofing", duration: "6 hours", priority: "Medium", laborNeeded: 4 },
    { name: "Exterior Finishing", duration: "4 hours", priority: "Medium", laborNeeded: 3 },
    { name: "Interior Work", duration: "5 hours", priority: "Low", laborNeeded: 4 },
    { name: "Electrical Installation", duration: "3 hours", priority: "Medium", laborNeeded: 2 },
    { name: "Plumbing", duration: "3 hours", priority: "Medium", laborNeeded: 2 },
    { name: "Painting", duration: "4 hours", priority: "Low", laborNeeded: 3 },
    { name: "Final Inspection", duration: "2 hours", priority: "Critical", laborNeeded: 1 },
  ]

  // Filter activities based on weather conditions
  let filteredActivities = [...activities]

  // Weather impact on activities
  if (impact === "High") {
    filteredActivities = filteredActivities.filter(
      (activity) => !["Excavation", "Foundation Work", "Roofing", "Exterior Finishing"].includes(activity.name),
    )
  } else if (impact === "Moderate") {
    filteredActivities = filteredActivities.filter(
      (activity) => !["Roofing", "Exterior Finishing"].includes(activity.name),
    )
  }

  // Specific weather conditions
  if (weatherCondition === "Rain" || weatherCondition === "Thunderstorm") {
    filteredActivities = filteredActivities.filter(
      (activity) => !["Excavation", "Foundation Work", "Roofing", "Exterior Finishing"].includes(activity.name),
    )
  } else if (weatherCondition === "Snow") {
    filteredActivities = filteredActivities.filter(
      (activity) =>
        !["Excavation", "Foundation Work", "Roofing", "Exterior Finishing", "Painting"].includes(activity.name),
    )
  }

  // Labor availability impact
  filteredActivities = filteredActivities.filter((activity) => activity.laborNeeded <= laborAvailability)

  // Sort by priority
  const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 }
  filteredActivities.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  // Assign time slots (simplified)
  let startTime = 8 // 8 AM
  filteredActivities = filteredActivities.map((activity) => {
    const hours = Number.parseInt(activity.duration.split(" ")[0])
    const timeSlot = `${startTime}:00 - ${startTime + hours}:00`
    startTime += hours

    // Status based on weather and labor
    let status = "Scheduled"
    if (
      impact === "High" &&
      ["Excavation", "Foundation Work", "Roofing", "Exterior Finishing"].includes(activity.name)
    ) {
      status = "Postponed (Weather)"
    } else if (activity.laborNeeded > laborAvailability) {
      status = "Postponed (Labor)"
    }

    return {
      ...activity,
      timeSlot,
      status,
    }
  })

  return {
    date,
    weatherCondition,
    impact,
    laborAvailability,
    activities: filteredActivities,
  }
}

// Generate a weekly schedule
const generateWeeklySchedule = (forecastData, laborAvailability) => {
  if (!forecastData || !forecastData.length) return []

  return forecastData.map((day) => {
    // Adjust labor availability slightly each day for realism
    const dailyLaborVariation = Math.floor(Math.random() * 3) - 1 // -1, 0, or 1
    const dailyLabor = Math.max(1, laborAvailability + dailyLaborVariation)

    return generateDailySchedule(day.date, day.condition, day.impact, dailyLabor)
  })
}

// Calculate cost implications
const calculateCostImplications = (schedule) => {
  let totalSavings = 0
  let totalAdditionalCosts = 0
  let delayedDays = 0

  schedule.forEach((day) => {
    const postponedActivities = day.activities.filter((a) => a.status.includes("Postponed"))

    if (postponedActivities.length > 0) {
      // Each postponed activity adds delay cost
      totalAdditionalCosts += postponedActivities.length * 5000
      delayedDays += 0.5
    } else {
      // Optimal scheduling saves money
      totalSavings += 8000
    }

    // Weather impact affects costs
    if (day.impact === "Low") {
      totalSavings += 3000
    } else if (day.impact === "High") {
      totalAdditionalCosts += 10000
    }
  })

  return {
    totalSavings,
    totalAdditionalCosts,
    netImpact: totalSavings - totalAdditionalCosts,
    delayedDays,
  }
}

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`
}

export function DetailedScheduleView({ forecastData, onClose }) {
  const [activeTab, setActiveTab] = useState("schedule")
  const [laborAvailability, setLaborAvailability] = useState(6)
  const [schedule, setSchedule] = useState([])
  const [costImplications, setCostImplications] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)

    // Simulate API call delay
    const timer = setTimeout(() => {
      const generatedSchedule = generateWeeklySchedule(forecastData, laborAvailability)
      setSchedule(generatedSchedule)
      setCostImplications(calculateCostImplications(generatedSchedule))
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [forecastData, laborAvailability])

  // Handle labor availability change
  const handleLaborChange = (newValue) => {
    setLaborAvailability(newValue)
  }

  // Get status icon
  const getStatusIcon = (status) => {
    if (status === "Scheduled") {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    } else if (status.includes("Weather")) {
      return <CloudRain className="h-4 w-4 text-red-500" />
    } else {
      return <Users className="h-4 w-4 text-yellow-500" />
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700 w-full">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-white text-lg">Generating optimal schedule based on weather conditions...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700 w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white text-xl">Detailed Construction Schedule</CardTitle>
          <CardDescription className="text-white/70">
            Optimized based on weather conditions and resource availability
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" className="text-white border-gray-600" onClick={onClose}>
          Close
        </Button>
      </CardHeader>

      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="bg-gray-700/50 rounded-lg p-4 flex-1">
            <h3 className="text-white font-medium mb-2">Schedule Parameters</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Labor Availability:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0 text-white"
                    onClick={() => handleLaborChange(Math.max(1, laborAvailability - 1))}
                  >
                    -
                  </Button>
                  <span className="text-white w-6 text-center">{laborAvailability}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0 text-white"
                    onClick={() => handleLaborChange(laborAvailability + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Weather Data:</span>
                <Badge className="bg-blue-600">Real-time</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Schedule Period:</span>
                <span className="text-white">{schedule.length} days</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4 flex-1">
            <h3 className="text-white font-medium mb-2">Cost Implications</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Potential Savings:</span>
                <span className="text-green-400">₹{costImplications?.totalSavings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Additional Costs:</span>
                <span className="text-red-400">₹{costImplications?.totalAdditionalCosts.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Net Impact:</span>
                <span className={costImplications?.netImpact >= 0 ? "text-green-400" : "text-red-400"}>
                  ₹{costImplications?.netImpact.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Project Delay:</span>
                <span className="text-white">{costImplications?.delayedDays} days</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="schedule" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 bg-gray-700 p-1">
            <TabsTrigger value="schedule" className="data-[state=active]:bg-blue-600 text-white">
              <Calendar className="h-4 w-4 mr-2" />
              Daily Schedule
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-blue-600 text-white">
              <Construction className="h-4 w-4 mr-2" />
              Resource Allocation
            </TabsTrigger>
            <TabsTrigger value="costs" className="data-[state=active]:bg-blue-600 text-white">
              <DollarSign className="h-4 w-4 mr-2" />
              Cost Breakdown
            </TabsTrigger>
          </TabsList>

          {/* Daily Schedule Tab */}
          <TabsContent value="schedule" className="mt-4">
            <div className="space-y-4">
              {schedule.map((day, index) => (
                <Card key={index} className="bg-gray-700 border-gray-600">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white text-lg">{formatDate(day.date)}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`
                          ${
                            day.impact === "Low"
                              ? "bg-green-600"
                              : day.impact === "Moderate"
                                ? "bg-yellow-600"
                                : "bg-red-600"
                          }
                        `}
                        >
                          {day.impact} Impact
                        </Badge>
                        <Badge className="bg-gray-600">{day.weatherCondition}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {day.activities.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-600">
                            <TableHead className="text-white">Time</TableHead>
                            <TableHead className="text-white">Activity</TableHead>
                            <TableHead className="text-white">Priority</TableHead>
                            <TableHead className="text-white">Labor</TableHead>
                            <TableHead className="text-white">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {day.activities.map((activity, actIndex) => (
                            <TableRow key={actIndex} className="border-gray-600">
                              <TableCell className="text-white">{activity.timeSlot}</TableCell>
                              <TableCell className="text-white">{activity.name}</TableCell>
                              <TableCell>
                                <Badge
                                  className={`
                                  ${
                                    activity.priority === "Critical"
                                      ? "bg-red-600"
                                      : activity.priority === "High"
                                        ? "bg-orange-600"
                                        : activity.priority === "Medium"
                                          ? "bg-yellow-600"
                                          : "bg-green-600"
                                  }
                                `}
                                >
                                  {activity.priority}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-white">{activity.laborNeeded} workers</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(activity.status)}
                                  <span
                                    className={`
                                    ${activity.status === "Scheduled" ? "text-green-400" : "text-red-400"}
                                  `}
                                  >
                                    {activity.status}
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <Alert className="bg-red-600/20 border-red-600/30">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <AlertTitle className="text-white">No Activities Scheduled</AlertTitle>
                        <AlertDescription className="text-white/70">
                          Due to severe weather conditions, no construction activities are recommended for this day.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Resource Allocation Tab */}
          <TabsContent value="resources" className="mt-4">
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Resource Allocation Overview</CardTitle>
                <CardDescription className="text-white/70">
                  Optimized distribution of labor and equipment based on schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-white font-medium mb-3">Labor Distribution</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {["Mason", "Carpenter", "Electrician", "Plumber", "Helper"].map((worker, index) => (
                        <div key={index} className="bg-gray-800 p-3 rounded-lg">
                          <div className="flex justify-between mb-1">
                            <span className="text-white">{worker}</span>
                            <span className="text-white/70">{Math.floor(Math.random() * 3) + 1} workers</span>
                          </div>
                          <Progress value={Math.floor(Math.random() * 60) + 40} className="h-2 bg-gray-600" />
                          <div className="flex justify-between mt-1 text-xs">
                            <span className="text-white/50">Utilization</span>
                            <span className={Math.random() > 0.5 ? "text-green-400" : "text-yellow-400"}>
                              {Math.random() > 0.5 ? "Optimal" : "Underutilized"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-3">Equipment Allocation</h3>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-600">
                          <TableHead className="text-white">Equipment</TableHead>
                          <TableHead className="text-white">Allocation</TableHead>
                          <TableHead className="text-white">Utilization</TableHead>
                          <TableHead className="text-white">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { name: "Concrete Mixer", allocation: "3 days", utilization: 75, status: "Optimal" },
                          { name: "Excavator", allocation: "2 days", utilization: 60, status: "Underutilized" },
                          { name: "Crane", allocation: "4 days", utilization: 90, status: "High Demand" },
                          { name: "Scaffolding", allocation: "5 days", utilization: 85, status: "Optimal" },
                          { name: "Power Tools", allocation: "5 days", utilization: 70, status: "Optimal" },
                        ].map((equipment, index) => (
                          <TableRow key={index} className="border-gray-600">
                            <TableCell className="text-white">{equipment.name}</TableCell>
                            <TableCell className="text-white">{equipment.allocation}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress value={equipment.utilization} className="h-2 w-24 bg-gray-600" />
                                <span className="text-white">{equipment.utilization}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`
                                ${
                                  equipment.status === "Optimal"
                                    ? "bg-green-600"
                                    : equipment.status === "Underutilized"
                                      ? "bg-yellow-600"
                                      : "bg-blue-600"
                                }
                              `}
                              >
                                {equipment.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cost Breakdown Tab */}
          <TabsContent value="costs" className="mt-4">
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Cost Optimization Analysis</CardTitle>
                <CardDescription className="text-white/70">
                  Financial impact of weather-optimized scheduling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-white mb-2">Potential Savings</h3>
                      <p className="text-3xl font-bold text-green-400">
                        ₹{costImplications?.totalSavings.toLocaleString()}
                      </p>
                      <p className="text-white/70 mt-2">Through optimal scheduling and resource allocation</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-white mb-2">Additional Costs</h3>
                      <p className="text-3xl font-bold text-red-400">
                        ₹{costImplications?.totalAdditionalCosts.toLocaleString()}
                      </p>
                      <p className="text-white/70 mt-2">Due to weather delays and rescheduling</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-white mb-2">Net Impact</h3>
                      <p
                        className={`text-3xl font-bold ${costImplications?.netImpact >= 0 ? "text-green-400" : "text-red-400"}`}
                      >
                        ₹{costImplications?.netImpact.toLocaleString()}
                      </p>
                      <p className="text-white/70 mt-2">Overall financial impact on project</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-3">Cost Breakdown by Category</h3>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-white">Labor Costs</span>
                            <div className="flex items-center">
                              <span className="text-green-400 flex items-center mr-2">
                                <ArrowUpRight className="h-3 w-3 mr-1 rotate-180" />
                                -8%
                              </span>
                              <span className="text-white">
                                ₹{(Math.floor(Math.random() * 50) + 150).toLocaleString()},000
                              </span>
                            </div>
                          </div>
                          <Progress value={72} className="h-2 bg-gray-600" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-white">Material Costs</span>
                            <div className="flex items-center">
                              <span className="text-green-400 flex items-center mr-2">
                                <ArrowUpRight className="h-3 w-3 mr-1 rotate-180" />
                                -3%
                              </span>
                              <span className="text-white">
                                ₹{(Math.floor(Math.random() * 100) + 300).toLocaleString()},000
                              </span>
                            </div>
                          </div>
                          <Progress value={85} className="h-2 bg-gray-600" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-white">Equipment Rental</span>
                            <div className="flex items-center">
                              <span className="text-red-400 flex items-center mr-2">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                +5%
                              </span>
                              <span className="text-white">
                                ₹{(Math.floor(Math.random() * 40) + 80).toLocaleString()},000
                              </span>
                            </div>
                          </div>
                          <Progress value={45} className="h-2 bg-gray-600" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-white">Overhead Costs</span>
                            <div className="flex items-center">
                              <span className="text-red-400 flex items-center mr-2">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                +2%
                              </span>
                              <span className="text-white">
                                ₹{(Math.floor(Math.random() * 30) + 50).toLocaleString()},000
                              </span>
                            </div>
                          </div>
                          <Progress value={30} className="h-2 bg-gray-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-3">Cost Optimization Recommendations</h3>
                    <div className="space-y-3">
                      <Alert className="bg-blue-600/20 border-blue-600/30">
                        <FileText className="h-4 w-4 text-blue-400" />
                        <AlertTitle className="text-white">Reschedule Exterior Work</AlertTitle>
                        <AlertDescription className="text-white/70">
                          Rescheduling exterior work to days with favorable weather conditions can save approximately
                          ₹25,000 in labor and material costs.
                        </AlertDescription>
                      </Alert>
                      <Alert className="bg-green-600/20 border-green-600/30">
                        <Clock className="h-4 w-4 text-green-400" />
                        <AlertTitle className="text-white">Optimize Equipment Rental</AlertTitle>
                        <AlertDescription className="text-white/70">
                          Consolidating equipment rental to specific days can reduce rental costs by up to ₹15,000.
                        </AlertDescription>
                      </Alert>
                      <Alert className="bg-yellow-600/20 border-yellow-600/30">
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                        <AlertTitle className="text-white">Labor Allocation Warning</AlertTitle>
                        <AlertDescription className="text-white/70">
                          Current labor allocation shows potential inefficiencies. Redistributing workers could improve
                          productivity by 12%.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

