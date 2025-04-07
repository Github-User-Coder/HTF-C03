"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BrainCircuit, Download, Loader2, Package, RefreshCw, Truck, Users, Leaf, AlertTriangle } from "lucide-react"

// Function to format numbers in Indian currency format
function formatIndianCurrency(num) {
  const numStr = num.toString()
  let result = ""

  // Handle the decimal part if exists
  const parts = numStr.split(".")
  const intPart = parts[0]
  const decimalPart = parts.length > 1 ? "." + parts[1] : ""

  // Format the integer part with commas (Indian format: 1,23,456)
  let i = intPart.length
  let count = 0

  while (i--) {
    result = intPart[i] + result
    count++
    if (count === 3 && i !== 0) {
      result = "," + result
      count = 0
    } else if (count === 2 && i !== 0 && result.indexOf(",") !== -1) {
      result = "," + result
      count = 0
    }
  }

  return result + decimalPart
}

export default function ResourcePrediction() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("materials")
  const [projectType, setProjectType] = useState("")
  const [projectSize, setProjectSize] = useState("")
  const [location, setLocation] = useState("")
  const [predictionResult, setPredictionResult] = useState(null)
  const [confidenceLevel, setConfidenceLevel] = useState(0)

  // Run prediction
  const runPrediction = () => {
    if (!projectType || !projectSize || !location) return

    setIsLoading(true)

    // Simulate API call to prediction model
    setTimeout(() => {
      // Generate prediction results based on inputs
      const result = generatePredictionResults(projectType, projectSize, location)
      setPredictionResult(result)
      setConfidenceLevel(85)
      setIsLoading(false)
    }, 2500)
  }

  // Generate prediction results
  const generatePredictionResults = (type, size, loc) => {
    // Base rates for different project types (per sq ft)
    const baseRates = {
      house: {
        materials: 1200,
        labor: 800,
        equipment: 300,
        timeline: 0.15, // days per sq ft
        materialBreakdown: {
          cement: 0.4, // bags per sq ft
          steel: 0.008, // tons per sq ft
          bricks: 10, // pieces per sq ft
          sand: 0.06, // cubic meters per sq ft
          aggregate: 0.08, // cubic meters per sq ft
        },
        laborBreakdown: {
          mason: 0.04, // worker-days per sq ft
          helper: 0.08, // worker-days per sq ft
          carpenter: 0.02, // worker-days per sq ft
          electrician: 0.01, // worker-days per sq ft
          plumber: 0.01, // worker-days per sq ft
        },
      },
      building: {
        materials: 1500,
        labor: 1000,
        equipment: 500,
        timeline: 0.2, // days per sq ft
        materialBreakdown: {
          cement: 0.5, // bags per sq ft
          steel: 0.012, // tons per sq ft
          bricks: 12, // pieces per sq ft
          sand: 0.08, // cubic meters per sq ft
          aggregate: 0.1, // cubic meters per sq ft
        },
        laborBreakdown: {
          mason: 0.05, // worker-days per sq ft
          helper: 0.1, // worker-days per sq ft
          carpenter: 0.025, // worker-days per sq ft
          electrician: 0.015, // worker-days per sq ft
          plumber: 0.015, // worker-days per sq ft
        },
      },
      commercial: {
        materials: 1800,
        labor: 1200,
        equipment: 700,
        timeline: 0.25, // days per sq ft
        materialBreakdown: {
          cement: 0.6, // bags per sq ft
          steel: 0.015, // tons per sq ft
          bricks: 8, // pieces per sq ft
          sand: 0.09, // cubic meters per sq ft
          aggregate: 0.12, // cubic meters per sq ft
        },
        laborBreakdown: {
          mason: 0.06, // worker-days per sq ft
          helper: 0.12, // worker-days per sq ft
          carpenter: 0.03, // worker-days per sq ft
          electrician: 0.02, // worker-days per sq ft
          plumber: 0.02, // worker-days per sq ft
        },
      },
    }

    // Location factors
    const locationFactors = {
      mumbai: 1.3,
      delhi: 1.2,
      bangalore: 1.25,
      chennai: 1.15,
      kolkata: 1.1,
      hyderabad: 1.2,
      pune: 1.15,
      ahmedabad: 1.05,
      jaipur: 1,
      lucknow: 0.95,
    }

    // Parse size to number
    const sizeNum = Number.parseInt(size)

    // Get base rates for project type
    const baseRate = baseRates[type]

    // Get location factor
    const locationFactor = locationFactors[loc.toLowerCase()] || 1

    // Calculate material costs
    const materialCost = baseRate.materials * sizeNum * locationFactor

    // Calculate labor costs
    const laborCost = baseRate.labor * sizeNum * locationFactor

    // Calculate equipment costs
    const equipmentCost = baseRate.equipment * sizeNum * locationFactor

    // Calculate overhead costs (20% of direct costs)
    const overheadCost = (materialCost + laborCost + equipmentCost) * 0.2

    // Calculate total cost
    const totalCost = materialCost + laborCost + equipmentCost + overheadCost

    // Calculate timeline
    const timeline = Math.ceil(baseRate.timeline * sizeNum)

    // Calculate material quantities
    const materialQuantities = {}
    Object.entries(baseRate.materialBreakdown).forEach(([material, rate]) => {
      materialQuantities[material] = Math.round(rate * sizeNum * 10) / 10
    })

    // Calculate labor requirements
    const laborRequirements = {}
    Object.entries(baseRate.laborBreakdown).forEach(([labor, rate]) => {
      laborRequirements[labor] = Math.ceil(rate * sizeNum)
    })

    // Calculate equipment needs
    const equipmentNeeds = [
      { name: "Concrete Mixer", days: Math.ceil(timeline * 0.3), dailyRate: 1500 },
      { name: "Excavator", days: Math.ceil(timeline * 0.1), dailyRate: 8000 },
      { name: "Scaffolding", days: Math.ceil(timeline * 0.7), dailyRate: 500 },
      { name: "Crane", days: type === "building" ? Math.ceil(timeline * 0.5) : 0, dailyRate: 12000 },
      { name: "Power Tools", days: timeline, dailyRate: 300 },
    ].filter((item) => item.days > 0)

    // Calculate carbon footprint
    const carbonFootprint = {
      cement: materialQuantities.cement * 100, // kg CO2 per bag
      steel: materialQuantities.steel * 1800, // kg CO2 per ton
      transport: sizeNum * 0.5, // kg CO2 per sq ft
      equipment: equipmentNeeds.reduce((sum, item) => sum + item.days * 50, 0), // kg CO2 per day
      total: 0,
    }
    carbonFootprint.total =
      carbonFootprint.cement + carbonFootprint.steel + carbonFootprint.transport + carbonFootprint.equipment

    // Calculate water usage
    const waterUsage = sizeNum * 0.3 // kiloliters

    return {
      projectType: type,
      projectSize: sizeNum,
      location: loc,
      costs: {
        materials: materialCost,
        labor: laborCost,
        equipment: equipmentCost,
        overhead: overheadCost,
        total: totalCost,
      },
      timeline: timeline,
      materials: materialQuantities,
      labor: laborRequirements,
      equipment: equipmentNeeds,
      sustainability: {
        carbonFootprint: carbonFootprint,
        waterUsage: waterUsage,
      },
      riskFactors: [
        {
          factor: "Weather Delays",
          probability: loc.toLowerCase() === "mumbai" ? "High" : "Medium",
          impact: "Moderate",
        },
        { factor: "Material Price Volatility", probability: "Medium", impact: "High" },
        { factor: "Labor Availability", probability: "Low", impact: "High" },
        { factor: "Permit Delays", probability: "Medium", impact: "High" },
      ],
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">AI Resource Prediction</h1>
          </div>
          <p className="text-white mt-2">Predict resource requirements for your construction project</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-type" className="text-white">
                    Project Type
                  </Label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger id="project-type" className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="building">Building</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-size" className="text-white">
                    Project Size (sq ft)
                  </Label>
                  <Input
                    id="project-size"
                    type="number"
                    placeholder="e.g., 2000"
                    value={projectSize}
                    onChange={(e) => setProjectSize(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-white">
                    Location
                  </Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger id="location" className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                      <SelectItem value="Delhi">Delhi</SelectItem>
                      <SelectItem value="Bangalore">Bangalore</SelectItem>
                      <SelectItem value="Chennai">Chennai</SelectItem>
                      <SelectItem value="Kolkata">Kolkata</SelectItem>
                      <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="Pune">Pune</SelectItem>
                      <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
                      <SelectItem value="Jaipur">Jaipur</SelectItem>
                      <SelectItem value="Lucknow">Lucknow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 mt-4"
                  onClick={runPrediction}
                  disabled={isLoading || !projectType || !projectSize || !location}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="h-4 w-4" />
                      Generate Prediction
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Data Sources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Historical Projects</span>
                  <span className="px-2 py-1 bg-green-600/30 text-green-400 rounded-full text-xs">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Market Prices</span>
                  <span className="px-2 py-1 bg-green-600/30 text-green-400 rounded-full text-xs">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Regional Factors</span>
                  <span className="px-2 py-1 bg-green-600/30 text-green-400 rounded-full text-xs">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Weather Patterns</span>
                  <span className="px-2 py-1 bg-green-600/30 text-green-400 rounded-full text-xs">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Sustainability Metrics</span>
                  <span className="px-2 py-1 bg-green-600/30 text-green-400 rounded-full text-xs">Active</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3 space-y-6">
            {isLoading ? (
              <Card className="bg-gray-800 border-gray-700 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-400" />
                  <h3 className="text-xl font-medium text-white">Generating Prediction</h3>
                  <p className="text-white/70 mt-2">
                    Our AI is analyzing historical data and generating resource predictions...
                  </p>
                  <div className="w-64 mx-auto mt-6">
                    <Progress value={confidenceLevel} className="h-2" />
                    <div className="flex justify-between mt-2 text-xs text-white/70">
                      <span>Processing Data</span>
                      <span>Building Model</span>
                      <span>Finalizing</span>
                    </div>
                  </div>
                </div>
              </Card>
            ) : !predictionResult ? (
              <Card className="bg-gray-800 border-gray-700 min-h-[400px] flex items-center justify-center">
                <div className="text-center p-8">
                  <BrainCircuit className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                  <h3 className="text-xl font-medium text-white">Enter Project Details</h3>
                  <p className="text-white/70 mt-2">
                    Fill in your project information on the left to generate AI-powered resource predictions.
                  </p>
                </div>
              </Card>
            ) : (
              <>
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-white">Resource Prediction Results</CardTitle>
                        <CardDescription className="text-white">
                          AI-generated resource requirements for your {predictionResult.projectType} project
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm">Confidence Level:</span>
                        <div className="px-2 py-1 bg-green-600/30 text-green-400 rounded-full text-xs">
                          {confidenceLevel}%
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-white mb-2">Total Cost</h3>
                        <div className="text-3xl font-bold text-white">
                          ₹{formatIndianCurrency(Math.round(predictionResult.costs.total))}
                        </div>
                        <div className="text-white/70 text-sm mt-1">
                          ₹
                          {formatIndianCurrency(
                            Math.round(predictionResult.costs.total / predictionResult.projectSize),
                          )}{" "}
                          per sq ft
                        </div>
                      </div>
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-white mb-2">Timeline</h3>
                        <div className="text-3xl font-bold text-white">{predictionResult.timeline} days</div>
                        <div className="text-white/70 text-sm mt-1">
                          Approximately {Math.ceil(predictionResult.timeline / 30)} months
                        </div>
                      </div>
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-white mb-2">Carbon Footprint</h3>
                        <div className="text-3xl font-bold text-white">
                          {Math.round(predictionResult.sustainability.carbonFootprint.total / 1000)} tons
                        </div>
                        <div className="text-white/70 text-sm mt-1">
                          {Math.round(
                            predictionResult.sustainability.carbonFootprint.total / predictionResult.projectSize,
                          )}{" "}
                          kg CO₂ per sq ft
                        </div>
                      </div>
                    </div>

                    <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="bg-gray-700 grid grid-cols-4">
                        <TabsTrigger value="materials" className="data-[state=active]:bg-blue-600 text-white">
                          <Package className="h-4 w-4 mr-2" />
                          Materials
                        </TabsTrigger>
                        <TabsTrigger value="labor" className="data-[state=active]:bg-blue-600 text-white">
                          <Users className="h-4 w-4 mr-2" />
                          Labor
                        </TabsTrigger>
                        <TabsTrigger value="equipment" className="data-[state=active]:bg-blue-600 text-white">
                          <Truck className="h-4 w-4 mr-2" />
                          Equipment
                        </TabsTrigger>
                        <TabsTrigger value="risks" className="data-[state=active]:bg-blue-600 text-white">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Risks
                        </TabsTrigger>
                      </TabsList>

                      {/* Materials Tab */}
                      <TabsContent value="materials" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-medium text-white mb-4">Material Requirements</h3>
                            <div className="space-y-4">
                              <div className="bg-gray-700 p-4 rounded-lg">
                                <div className="flex justify-between mb-1">
                                  <span className="text-white">Cement</span>
                                  <span className="text-white">{predictionResult.materials.cement} bags</span>
                                </div>
                                <Progress value={80} className="h-2" />
                              </div>
                              <div className="bg-gray-700 p-4 rounded-lg">
                                <div className="flex justify-between mb-1">
                                  <span className="text-white">Steel</span>
                                  <span className="text-white">{predictionResult.materials.steel} tons</span>
                                </div>
                                <Progress value={65} className="h-2" />
                              </div>
                              <div className="bg-gray-700 p-4 rounded-lg">
                                <div className="flex justify-between mb-1">
                                  <span className="text-white">Bricks</span>
                                  <span className="text-white">{predictionResult.materials.bricks} pieces</span>
                                </div>
                                <Progress value={90} className="h-2" />
                              </div>
                              <div className="bg-gray-700 p-4 rounded-lg">
                                <div className="flex justify-between mb-1">
                                  <span className="text-white">Sand</span>
                                  <span className="text-white">{predictionResult.materials.sand} cubic meters</span>
                                </div>
                                <Progress value={70} className="h-2" />
                              </div>
                              <div className="bg-gray-700 p-4 rounded-lg">
                                <div className="flex justify-between mb-1">
                                  <span className="text-white">Aggregate</span>
                                  <span className="text-white">
                                    {predictionResult.materials.aggregate} cubic meters
                                  </span>
                                </div>
                                <Progress value={75} className="h-2" />
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-medium text-white mb-4">Material Cost Breakdown</h3>
                            <div className="h-64 relative mb-6">
                              {/* Simple pie chart visualization */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative h-48 w-48">
                                  <svg viewBox="0 0 100 100" className="h-full w-full">
                                    <circle
                                      cx="50"
                                      cy="50"
                                      r="40"
                                      fill="transparent"
                                      stroke="#3b82f6"
                                      strokeWidth="20"
                                      strokeDasharray="40 60"
                                      strokeDashoffset="25"
                                    />
                                    <circle
                                      cx="50"
                                      cy="50"
                                      r="40"
                                      fill="transparent"
                                      stroke="#10b981"
                                      strokeWidth="20"
                                      strokeDasharray="25 75"
                                      strokeDashoffset="85"
                                    />
                                    <circle
                                      cx="50"
                                      cy="50"
                                      r="40"
                                      fill="transparent"
                                      stroke="#f59e0b"
                                      strokeWidth="20"
                                      strokeDasharray="20 80"
                                      strokeDashoffset="60"
                                    />
                                    <circle
                                      cx="50"
                                      cy="50"
                                      r="40"
                                      fill="transparent"
                                      stroke="#8b5cf6"
                                      strokeWidth="20"
                                      strokeDasharray="15 85"
                                      strokeDashoffset="40"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="h-3 w-3 bg-blue-500 mr-2"></div>
                                  <span className="text-white">Cement</span>
                                </div>
                                <span className="text-white">40%</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="h-3 w-3 bg-green-500 mr-2"></div>
                                  <span className="text-white">Steel</span>
                                </div>
                                <span className="text-white">25%</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="h-3 w-3 bg-amber-500 mr-2"></div>
                                  <span className="text-white">Bricks</span>
                                </div>
                                <span className="text-white">20%</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="h-3 w-3 bg-purple-500 mr-2"></div>
                                  <span className="text-white">Others</span>
                                </div>
                                <span className="text-white">15%</span>
                              </div>
                            </div>

                            <div className="mt-6 p-4 bg-blue-600/20 border border-blue-600/30 rounded-lg">
                              <h4 className="font-medium text-white mb-2">Material Insights</h4>
                              <p className="text-white/80 text-sm">
                                Based on your project specifications, cement and steel represent the largest material
                                costs. Consider bulk purchasing these materials to negotiate better rates.
                              </p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Labor Tab */}
                      <TabsContent value="labor" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-medium text-white mb-4">Labor Requirements</h3>
                            <div className="space-y-4">
                              {Object.entries(predictionResult.labor).map(([type, count], index) => (
                                <div key={index} className="bg-gray-700 p-4 rounded-lg">
                                  <div className="flex justify-between mb-1">
                                    <span className="text-white capitalize">{type}s</span>
                                    <span className="text-white">{count} workers</span>
                                  </div>
                                  <Progress value={count * 5} className="h-2" />
                                </div>
                              ))}
                            </div>

                            <div className="mt-6 p-4 bg-blue-600/20 border border-blue-600/30 rounded-lg">
                              <h4 className="font-medium text-white mb-2">Labor Insights</h4>
                              <p className="text-white/80 text-sm">
                                Your project requires a balanced team with a mason-to-helper ratio of 1:2. Consider
                                hiring skilled workers from nearby completed projects for better efficiency.
                              </p>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-medium text-white mb-4">Labor Cost Analysis</h3>
                            <div className="bg-gray-700 p-4 rounded-lg mb-4">
                              <div className="flex justify-between mb-1">
                                <span className="text-white">Total Labor Cost</span>
                                <span className="text-white">
                                  ₹{formatIndianCurrency(Math.round(predictionResult.costs.labor))}
                                </span>
                              </div>
                              <Progress value={70} className="h-2" />
                              <div className="text-white/70 text-sm mt-1">
                                {Math.round((predictionResult.costs.labor / predictionResult.costs.total) * 100)}% of
                                total project cost
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="bg-gray-700 p-4 rounded-lg">
                                <div className="flex justify-between mb-1">
                                  <span className="text-white">Skilled Labor</span>
                                  <span className="text-white">
                                    ₹{formatIndianCurrency(Math.round(predictionResult.costs.labor * 0.6))}
                                  </span>
                                </div>
                                <Progress value={60} className="h-2" />
                              </div>
                              <div className="bg-gray-700 p-4 rounded-lg">
                                <div className="flex justify-between mb-1">
                                  <span className="text-white">Unskilled Labor</span>
                                  <span className="text-white">
                                    ₹{formatIndianCurrency(Math.round(predictionResult.costs.labor * 0.4))}
                                  </span>
                                </div>
                                <Progress value={40} className="h-2" />
                              </div>
                            </div>

                            <div className="mt-6 p-4 bg-amber-600/20 border border-amber-600/30 rounded-lg">
                              <h4 className="font-medium text-white mb-2">Labor Market Alert</h4>
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5" />
                                <p className="text-white/80 text-sm">
                                  Skilled labor availability in {predictionResult.location} is currently limited.
                                  Consider booking key workers 3-4 weeks in advance to avoid delays.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Equipment Tab */}
                      <TabsContent value="equipment" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-medium text-white mb-4">Equipment Requirements</h3>
                            <div className="space-y-4">
                              {predictionResult.equipment.map((item, index) => (
                                <div key={index} className="bg-gray-700 p-4 rounded-lg">
                                  <div className="flex justify-between mb-1">
                                    <span className="text-white">{item.name}</span>
                                    <span className="text-white">{item.days} days</span>
                                  </div>
                                  <Progress value={(item.days / predictionResult.timeline) * 100} className="h-2" />
                                  <div className="flex justify-between text-white/70 text-sm mt-1">
                                    <span>Daily Rate: ₹{formatIndianCurrency(item.dailyRate)}</span>
                                    <span>Total: ₹{formatIndianCurrency(item.days * item.dailyRate)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-medium text-white mb-4">Equipment Cost Analysis</h3>
                            <div className="bg-gray-700 p-4 rounded-lg mb-4">
                              <div className="flex justify-between mb-1">
                                <span className="text-white">Total Equipment Cost</span>
                                <span className="text-white">
                                  ₹{formatIndianCurrency(Math.round(predictionResult.costs.equipment))}
                                </span>
                              </div>
                              <Progress value={50} className="h-2" />
                              <div className="text-white/70 text-sm mt-1">
                                {Math.round((predictionResult.costs.equipment / predictionResult.costs.total) * 100)}%
                                of total project cost
                              </div>
                            </div>

                            <div className="mt-6 p-4 bg-blue-600/20 border border-blue-600/30 rounded-lg">
                              <h4 className="font-medium text-white mb-2">Equipment Optimization</h4>
                              <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                  <Truck className="h-5 w-5 text-blue-400 mt-0.5" />
                                  <p className="text-white/80 text-sm">
                                    Schedule excavator usage in continuous blocks rather than intermittent days to
                                    reduce mobilization costs.
                                  </p>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Truck className="h-5 w-5 text-blue-400 mt-0.5" />
                                  <p className="text-white/80 text-sm">
                                    Consider renting scaffolding for the entire project duration instead of monthly
                                    renewals to negotiate better rates.
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="mt-6 p-4 bg-green-600/20 border border-green-600/30 rounded-lg">
                              <h4 className="font-medium text-white mb-2">Sustainability Impact</h4>
                              <div className="flex items-start gap-2">
                                <Leaf className="h-5 w-5 text-green-400 mt-0.5" />
                                <p className="text-white/80 text-sm">
                                  Equipment operations will generate approximately{" "}
                                  {Math.round(predictionResult.sustainability.carbonFootprint.equipment)} kg of CO₂.
                                  Consider using newer, fuel-efficient models to reduce emissions by up to 20%.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Risks Tab */}
                      <TabsContent value="risks" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-medium text-white mb-4">Risk Assessment</h3>
                            <div className="space-y-4">
                              {predictionResult.riskFactors.map((risk, index) => (
                                <div key={index} className="bg-gray-700 p-4 rounded-lg">
                                  <div className="flex justify-between mb-2">
                                    <span className="text-white font-medium">{risk.factor}</span>
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs ${
                                          risk.probability === "High"
                                            ? "bg-red-600/30 text-red-400"
                                            : risk.probability === "Medium"
                                              ? "bg-amber-600/30 text-amber-400"
                                              : "bg-green-600/30 text-green-400"
                                        }`}
                                      >
                                        {risk.probability}
                                      </span>
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs ${
                                          risk.impact === "High"
                                            ? "bg-red-600/30 text-red-400"
                                            : risk.impact === "Moderate"
                                              ? "bg-amber-600/30 text-amber-400"
                                              : "bg-green-600/30 text-green-400"
                                        }`}
                                      >
                                        {risk.impact}
                                      </span>
                                    </div>
                                  </div>
                                  <Progress
                                    value={risk.probability === "High" ? 90 : risk.probability === "Medium" ? 60 : 30}
                                    className={`h-2 ${
                                      risk.probability === "High"
                                        ? "bg-red-600"
                                        : risk.probability === "Medium"
                                          ? "bg-amber-600"
                                          : "bg-green-600"
                                    }`}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-medium text-white mb-4">Mitigation Strategies</h3>
                            <div className="space-y-4">
                              <div className="p-4 bg-blue-600/20 border border-blue-600/30 rounded-lg">
                                <h4 className="font-medium text-white mb-2">Weather Risk Mitigation</h4>
                                <p className="text-white/80 text-sm">
                                  Schedule critical outdoor activities during forecasted dry periods. Maintain a 10-day
                                  buffer in the project timeline to account for potential weather delays.
                                </p>
                              </div>
                              <div className="p-4 bg-blue-600/20 border border-blue-600/30 rounded-lg">
                                <h4 className="font-medium text-white mb-2">Material Price Volatility</h4>
                                <p className="text-white/80 text-sm">
                                  Lock in prices for key materials like cement and steel through advance purchase
                                  agreements. Consider including price escalation clauses in contracts for long-duration
                                  projects.
                                </p>
                              </div>
                              <div className="p-4 bg-blue-600/20 border border-blue-600/30 rounded-lg">
                                <h4 className="font-medium text-white mb-2">Labor Availability</h4>
                                <p className="text-white/80 text-sm">
                                  Secure commitments from key skilled workers well in advance. Develop relationships
                                  with multiple labor contractors to ensure backup options.
                                </p>
                              </div>
                              <div className="p-4 bg-blue-600/20 border border-blue-600/30 rounded-lg">
                                <h4 className="font-medium text-white mb-2">Permit Delays</h4>
                                <p className="text-white/80 text-sm">
                                  Start permit applications at least 30 days before scheduled construction. Engage with
                                  local authorities early to identify potential issues.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Export Prediction Report
                  </Button>
                  <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-600/20">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refine Prediction
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

