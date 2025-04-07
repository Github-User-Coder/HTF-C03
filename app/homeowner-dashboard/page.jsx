"use client"

import { AIPredictionSidebar } from "@/components/ai-prediction-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building2,
  Construction,
  DollarSign,
  Home,
  Loader2,
  LogOut,
  Menu,
  Package,
  School,
  ShoppingBag,
  User,
  Warehouse,
} from "lucide-react"
import Link from "next/link"
import { useState, useCallback, useRef } from "react"
import { AreaCalculator } from "./area-calculator"
import { CostComparisonChart } from "./cost-comparison-chart"
import { LiveCostTracker } from "./live-cost-tracker"
import { Progress } from "@/components/ui/progress"

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

// Dummy data for project estimation
const projectEstimations = {
  house: {
    "1BHK": {
      materials: [
        { name: "Cement", quantity: "50 bags", cost: 17500 },
        { name: "Steel", quantity: "2 tons", cost: 120000 },
        { name: "Bricks", quantity: "5000 pieces", cost: 50000 },
        { name: "Sand", quantity: "30 cubic meters", cost: 45000 },
      ],
      labor: [
        { type: "Mason", count: 4, cost: 80000 },
        { type: "Helper", count: 8, cost: 96000 },
        { type: "Carpenter", count: 2, cost: 48000 },
        { type: "Electrician", count: 1, cost: 30000 },
      ],
      equipment: [
        { name: "Concrete Mixer", hours: 48, cost: 24000 },
        { name: "Scaffolding", days: 30, cost: 15000 },
        { name: "Power Tools", days: 30, cost: 9000 },
      ],
      overhead: [
        { name: "Permits & Licensing", cost: 25000 },
        { name: "Site Management", cost: 35000 },
        { name: "Utilities", cost: 15000 },
      ],
      totalCost: 609500,
      duration: "3 months",
    },
    "2BHK": {
      materials: [
        { name: "Cement", quantity: "80 bags", cost: 28000 },
        { name: "Steel", quantity: "3.5 tons", cost: 210000 },
        { name: "Bricks", quantity: "8000 pieces", cost: 80000 },
        { name: "Sand", quantity: "45 cubic meters", cost: 67500 },
      ],
      labor: [
        { type: "Mason", count: 6, cost: 120000 },
        { type: "Helper", count: 12, cost: 144000 },
        { type: "Carpenter", count: 3, cost: 72000 },
        { type: "Electrician", count: 2, cost: 60000 },
      ],
      equipment: [
        { name: "Concrete Mixer", hours: 72, cost: 36000 },
        { name: "Scaffolding", days: 45, cost: 22500 },
        { name: "Power Tools", days: 45, cost: 13500 },
      ],
      overhead: [
        { name: "Permits & Licensing", cost: 35000 },
        { name: "Site Management", cost: 50000 },
        { name: "Utilities", cost: 25000 },
      ],
      totalCost: 963500,
      duration: "5 months",
    },
    "3BHK": {
      materials: [
        { name: "Cement", quantity: "120 bags", cost: 42000 },
        { name: "Steel", quantity: "5 tons", cost: 300000 },
        { name: "Bricks", quantity: "12000 pieces", cost: 120000 },
        { name: "Sand", quantity: "60 cubic meters", cost: 90000 },
      ],
      labor: [
        { type: "Mason", count: 8, cost: 160000 },
        { type: "Helper", count: 16, cost: 192000 },
        { type: "Carpenter", count: 4, cost: 96000 },
        { type: "Electrician", count: 2, cost: 60000 },
      ],
      equipment: [
        { name: "Concrete Mixer", hours: 96, cost: 48000 },
        { name: "Scaffolding", days: 60, cost: 30000 },
        { name: "Power Tools", days: 60, cost: 18000 },
      ],
      overhead: [
        { name: "Permits & Licensing", cost: 50000 },
        { name: "Site Management", cost: 75000 },
        { name: "Utilities", cost: 35000 },
      ],
      totalCost: 1316000,
      duration: "7 months",
    },
  },
  building: {
    "4-Story": {
      materials: [
        { name: "Cement", quantity: "500 bags", cost: 175000 },
        { name: "Steel", quantity: "25 tons", cost: 1500000 },
        { name: "Bricks", quantity: "50000 pieces", cost: 500000 },
        { name: "Sand", quantity: "200 cubic meters", cost: 300000 },
      ],
      labor: [
        { type: "Mason", count: 20, cost: 400000 },
        { type: "Helper", count: 40, cost: 480000 },
        { type: "Carpenter", count: 10, cost: 240000 },
        { type: "Electrician", count: 5, cost: 150000 },
      ],
      equipment: [
        { name: "Crane", days: 30, cost: 300000 },
        { name: "Concrete Mixer", hours: 240, cost: 120000 },
        { name: "Scaffolding", days: 120, cost: 60000 },
      ],
      overhead: [
        { name: "Permits & Licensing", cost: 200000 },
        { name: "Site Management", cost: 300000 },
        { name: "Utilities", cost: 150000 },
      ],
      totalCost: 4875000,
      duration: "12 months",
    },
    "8-Story": {
      materials: [
        { name: "Cement", quantity: "1000 bags", cost: 350000 },
        { name: "Steel", quantity: "50 tons", cost: 3000000 },
        { name: "Bricks", quantity: "100000 pieces", cost: 1000000 },
        { name: "Sand", quantity: "400 cubic meters", cost: 600000 },
      ],
      labor: [
        { type: "Mason", count: 30, cost: 600000 },
        { type: "Helper", count: 60, cost: 720000 },
        { type: "Carpenter", count: 15, cost: 360000 },
        { type: "Electrician", count: 8, cost: 240000 },
      ],
      equipment: [
        { name: "Crane", days: 60, cost: 600000 },
        { name: "Concrete Mixer", hours: 480, cost: 240000 },
        { name: "Scaffolding", days: 240, cost: 120000 },
      ],
      overhead: [
        { name: "Permits & Licensing", cost: 400000 },
        { name: "Site Management", cost: 600000 },
        { name: "Utilities", cost: 300000 },
      ],
      totalCost: 9130000,
      duration: "24 months",
    },
  },
}

// Sample projects data for My Projects tab
const myProjects = [
  {
    id: 1,
    name: "Dream Home Construction",
    type: "3BHK",
    location: "123 Main St, Mumbai",
    progress: 35,
    startDate: "2023-05-15",
    endDate: "2023-12-20",
    budget: 1500000,
    spent: 525000,
  },
  {
    id: 2,
    name: "Vacation Villa",
    type: "Villa",
    location: "Beach Road, Goa",
    progress: 10,
    startDate: "2023-08-10",
    endDate: "2024-06-30",
    budget: 3500000,
    spent: 350000,
  },
]

// Sample materials data for Materials tab
const materialsList = [
  { id: 1, name: "Cement", quantity: "120 bags", unitPrice: 350, totalPrice: 42000, status: "Delivered" },
  { id: 2, name: "Steel", quantity: "5 tons", unitPrice: 60000, totalPrice: 300000, status: "Partially Delivered" },
  { id: 3, name: "Bricks", quantity: "12000 pieces", unitPrice: 10, totalPrice: 120000, status: "Ordered" },
  { id: 4, name: "Sand", quantity: "60 cubic meters", unitPrice: 1500, totalPrice: 90000, status: "Delivered" },
  { id: 5, name: "Tiles", quantity: "1500 sq ft", unitPrice: 80, totalPrice: 120000, status: "Not Ordered" },
]

// Sample expenses data for Expenses tab
const expensesList = [
  { id: 1, date: "2023-05-20", category: "Materials", description: "Initial cement purchase", amount: 42000 },
  { id: 2, date: "2023-06-05", category: "Labor", description: "Foundation work", amount: 85000 },
  { id: 3, date: "2023-06-15", category: "Equipment", description: "Concrete mixer rental", amount: 15000 },
  { id: 4, date: "2023-07-01", category: "Materials", description: "Steel purchase", amount: 150000 },
  { id: 5, date: "2023-07-10", category: "Overhead", description: "Permits and licenses", amount: 25000 },
]

// Sample profile data for Profile tab
const profileData = {
  name: "Rahul Sharma",
  email: "rahul.sharma@example.com",
  phone: "+91 98765 43210",
  address: "456 Park Avenue, Mumbai, Maharashtra",
  projects: 2,
  joinDate: "January 15, 2023",
}

export default function HomeownerDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [siteDimensions, setSiteDimensions] = useState({ length: "", width: "" })
  const [constructionType, setConstructionType] = useState("")
  const [subType, setSubType] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [estimationResult, setEstimationResult] = useState(null)
  const [area, setArea] = useState(0)
  const [totalCost, setTotalCost] = useState(0)
  const [materialCost, setMaterialCost] = useState(0)
  const [laborCost, setLaborCost] = useState(0)
  const [equipmentCost, setEquipmentCost] = useState(0)
  const [overheadCost, setOverheadCost] = useState(0)
  const [budgetLimit, setBudgetLimit] = useState(1000000) // 10 lakhs default
  const [activeTab, setActiveTab] = useState("dashboard")

  // Use refs to track previous values and prevent unnecessary updates
  const prevAreaRef = useRef(area)
  const prevTotalCostRef = useRef(totalCost)

  // Memoize the handleAreaCalculation function to prevent it from changing on every render
  const handleAreaCalculation = useCallback((calculatedArea, calculatedCost) => {
    // Only update if values have actually changed
    if (calculatedArea !== prevAreaRef.current || calculatedCost !== prevTotalCostRef.current) {
      setArea(calculatedArea)
      setTotalCost(calculatedCost)
      prevAreaRef.current = calculatedArea
      prevTotalCostRef.current = calculatedCost
    }
  }, [])

  const handleEstimation = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      let result
      if (constructionType === "house" && subType) {
        result = JSON.parse(JSON.stringify(projectEstimations.house[subType]))

        // Scale costs based on actual area vs reference area
        const referenceArea = subType === "1BHK" ? 600 : subType === "2BHK" ? 900 : 1200
        const scaleFactor = area / referenceArea

        // Adjust material quantities and costs
        result.materials = result.materials.map((material) => {
          const originalQuantity = material.quantity.split(" ")
          const newQuantity = Math.round(Number.parseFloat(originalQuantity[0]) * scaleFactor)
          return {
            ...material,
            quantity: `${newQuantity} ${originalQuantity.slice(1).join(" ")}`,
            cost: Math.round(material.cost * scaleFactor),
          }
        })

        // Adjust labor costs
        result.labor = result.labor.map((labor) => {
          return {
            ...labor,
            count: Math.max(1, Math.round(labor.count * scaleFactor)),
            cost: Math.round(labor.cost * scaleFactor),
          }
        })

        // Adjust equipment costs
        result.equipment = result.equipment.map((equipment) => {
          return {
            ...equipment,
            hours: equipment.hours ? Math.round(equipment.hours * scaleFactor) : undefined,
            days: equipment.days ? Math.round(equipment.days * scaleFactor) : undefined,
            cost: Math.round(equipment.cost * scaleFactor),
          }
        })

        // Adjust overhead costs
        result.overhead = result.overhead.map((overhead) => {
          return {
            ...overhead,
            cost: Math.round(overhead.cost * scaleFactor),
          }
        })

        // Calculate new total cost
        const calculatedMaterialCost = result.materials.reduce((sum, item) => sum + item.cost, 0)
        const calculatedLaborCost = result.labor.reduce((sum, item) => sum + item.cost, 0)
        const calculatedEquipmentCost = result.equipment.reduce((sum, item) => sum + item.cost, 0)
        const calculatedOverheadCost = result.overhead.reduce((sum, item) => sum + item.cost, 0)

        result.totalCost =
          calculatedMaterialCost + calculatedLaborCost + calculatedEquipmentCost + calculatedOverheadCost

        // Update state with calculated costs
        setMaterialCost(calculatedMaterialCost)
        setLaborCost(calculatedLaborCost)
        setEquipmentCost(calculatedEquipmentCost)
        setOverheadCost(calculatedOverheadCost)
        setTotalCost(result.totalCost)
      } else if (constructionType === "building" && subType) {
        result = JSON.parse(JSON.stringify(projectEstimations.building[subType]))

        // Apply similar scaling logic as for houses
        const referenceArea = subType === "4-Story" ? 5000 : 10000
        const scaleFactor = area / referenceArea

        // Scale all costs
        result.materials = result.materials.map((material) => {
          const originalQuantity = material.quantity.split(" ")
          const newQuantity = Math.round(Number.parseFloat(originalQuantity[0]) * scaleFactor)
          return {
            ...material,
            quantity: `${newQuantity} ${originalQuantity.slice(1).join(" ")}`,
            cost: Math.round(material.cost * scaleFactor),
          }
        })

        result.labor = result.labor.map((labor) => {
          return {
            ...labor,
            count: Math.max(1, Math.round(labor.count * scaleFactor)),
            cost: Math.round(labor.cost * scaleFactor),
          }
        })

        result.equipment = result.equipment.map((equipment) => {
          return {
            ...equipment,
            hours: equipment.hours ? Math.round(equipment.hours * scaleFactor) : undefined,
            days: equipment.days ? Math.round(equipment.days * scaleFactor) : undefined,
            cost: Math.round(equipment.cost * scaleFactor),
          }
        })

        result.overhead = result.overhead.map((overhead) => {
          return {
            ...overhead,
            cost: Math.round(overhead.cost * scaleFactor),
          }
        })

        // Calculate new total cost
        const calculatedMaterialCost = result.materials.reduce((sum, item) => sum + item.cost, 0)
        const calculatedLaborCost = result.labor.reduce((sum, item) => sum + item.cost, 0)
        const calculatedEquipmentCost = result.equipment.reduce((sum, item) => sum + item.cost, 0)
        const calculatedOverheadCost = result.overhead.reduce((sum, item) => sum + item.cost, 0)

        result.totalCost =
          calculatedMaterialCost + calculatedLaborCost + calculatedEquipmentCost + calculatedOverheadCost

        // Update state with calculated costs
        setMaterialCost(calculatedMaterialCost)
        setLaborCost(calculatedLaborCost)
        setEquipmentCost(calculatedEquipmentCost)
        setOverheadCost(calculatedOverheadCost)
        setTotalCost(result.totalCost)
      } else {
        // Default to 3BHK if no valid selection
        result = JSON.parse(JSON.stringify(projectEstimations.house["3BHK"]))
        // Apply scaling as above
      }

      setEstimationResult(result)
      setIsLoading(false)
    }, 2000)
  }

  // Render different content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboardContent()
      case "projects":
        return renderProjectsContent()
      case "materials":
        return renderMaterialsContent()
      case "expenses":
        return renderExpensesContent()
      case "profile":
        return renderProfileContent()
      default:
        return renderDashboardContent()
    }
  }

  // Dashboard tab content
  const renderDashboardContent = () => {
    return (
      <>
        {/* Site Dimensions Input */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Enter Site Dimensions</CardTitle>
            <CardDescription className="text-white">Provide the dimensions of your construction site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="length" className="text-white">
                  Length (in feet)
                </Label>
                <Input
                  id="length"
                  placeholder="e.g., 100"
                  value={siteDimensions.length}
                  onChange={(e) => setSiteDimensions({ ...siteDimensions, length: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="width" className="text-white">
                  Width (in feet)
                </Label>
                <Input
                  id="width"
                  placeholder="e.g., 50"
                  value={siteDimensions.width}
                  onChange={(e) => setSiteDimensions({ ...siteDimensions, width: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Area Calculator */}
        {siteDimensions.length && siteDimensions.width && (
          <AreaCalculator
            onCalculate={handleAreaCalculation}
            length={siteDimensions.length}
            width={siteDimensions.width}
          />
        )}

        {siteDimensions.length && siteDimensions.width && (
          <div className="mt-4 p-4 bg-blue-600/20 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-white">Area Calculation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-white">
                  Site Dimensions: {siteDimensions.length} ft × {siteDimensions.width} ft
                </p>
                <p className="text-white">
                  Total Area: {Number.parseFloat(siteDimensions.length) * Number.parseFloat(siteDimensions.width)} sq ft
                </p>
              </div>
              <div>
                <p className="text-white">Base Construction Rate: ₹2,000 per sq ft</p>
                <p className="text-white font-bold">
                  Estimated Base Cost: ₹
                  {formatIndianCurrency(
                    Number.parseFloat(siteDimensions.length) * Number.parseFloat(siteDimensions.width) * 2000,
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Construction Type Selection */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Select Construction Type</CardTitle>
            <CardDescription className="text-white">Choose the type of construction project</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="house" onValueChange={setConstructionType}>
              <TabsList className="grid grid-cols-5 bg-gray-700">
                <TabsTrigger value="house" className="data-[state=active]:bg-blue-600 text-white">
                  <Home className="h-4 w-4 mr-2" />
                  House
                </TabsTrigger>
                <TabsTrigger value="building" className="data-[state=active]:bg-blue-600 text-white">
                  <Building2 className="h-4 w-4 mr-2" />
                  Building
                </TabsTrigger>
                <TabsTrigger value="school" className="data-[state=active]:bg-blue-600 text-white">
                  <School className="h-4 w-4 mr-2" />
                  School
                </TabsTrigger>
                <TabsTrigger value="commercial" className="data-[state=active]:bg-blue-600 text-white">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Commercial
                </TabsTrigger>
                <TabsTrigger value="warehouse" className="data-[state=active]:bg-blue-600 text-white">
                  <Warehouse className="h-4 w-4 mr-2" />
                  Warehouse
                </TabsTrigger>
              </TabsList>
              <TabsContent value="house" className="mt-4">
                <div className="space-y-4">
                  <Label className="text-white">House Type</Label>
                  <Select onValueChange={setSubType}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select house type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                      <SelectItem value="1BHK">1BHK</SelectItem>
                      <SelectItem value="2BHK">2BHK</SelectItem>
                      <SelectItem value="3BHK">3BHK</SelectItem>
                      <SelectItem value="Duplex">Duplex</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              <TabsContent value="building" className="mt-4">
                <div className="space-y-4">
                  <Label className="text-white">Building Type</Label>
                  <Select onValueChange={setSubType}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select building type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                      <SelectItem value="4-Story">4-Story</SelectItem>
                      <SelectItem value="8-Story">8-Story</SelectItem>
                      <SelectItem value="Skyscraper">Skyscraper</SelectItem>
                      <SelectItem value="Commercial Office">Commercial Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              <TabsContent value="school" className="mt-4">
                <div className="space-y-4">
                  <Label className="text-white">School Type</Label>
                  <Select onValueChange={setSubType}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select school type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                      <SelectItem value="Primary">Primary</SelectItem>
                      <SelectItem value="High School">High School</SelectItem>
                      <SelectItem value="University">University</SelectItem>
                      <SelectItem value="Auditorium">Auditorium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              <TabsContent value="commercial" className="mt-4">
                <div className="space-y-4">
                  <Label className="text-white">Commercial Type</Label>
                  <Select onValueChange={setSubType}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select commercial type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Mall">Mall</SelectItem>
                      <SelectItem value="Corporate">Corporate</SelectItem>
                      <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              <TabsContent value="warehouse" className="mt-4">
                <div className="space-y-4">
                  <Label className="text-white">Warehouse Type</Label>
                  <Select onValueChange={setSubType}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select warehouse type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                      <SelectItem value="Storage Unit">Storage Unit</SelectItem>
                      <SelectItem value="Distribution Center">Distribution Center</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                      <SelectItem value="Cold Storage">Cold Storage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleEstimation}
              disabled={isLoading || !constructionType || !subType || !siteDimensions.length || !siteDimensions.width}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Estimation...
                </>
              ) : (
                "Generate AI-Powered Estimation"
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Live Cost Tracker */}
        {estimationResult && <LiveCostTracker totalCost={totalCost} budgetLimit={budgetLimit} />}

        {/* Cost Comparison Chart */}
        {estimationResult && (
          <CostComparisonChart
            materialCost={materialCost}
            laborCost={laborCost}
            equipmentCost={equipmentCost}
            overheadCost={overheadCost}
            totalCost={totalCost}
          />
        )}

        {/* Estimation Results */}
        {estimationResult && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Project Estimation Results</CardTitle>
              <CardDescription className="text-white">
                AI-generated estimation for your {subType} {constructionType}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">Material Requirements</h3>
                  <div className="space-y-4">
                    {estimationResult.materials.map((material, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-white">{material.name}</p>
                          <p className="text-sm text-white">{material.quantity}</p>
                        </div>
                        <p className="font-semibold text-white">₹{formatIndianCurrency(material.cost)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">Labor Estimation</h3>
                  <div className="space-y-4">
                    {estimationResult.labor.map((labor, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-white">{labor.type}</p>
                          <p className="text-sm text-white">{labor.count} workers</p>
                        </div>
                        <p className="font-semibold text-white">₹{formatIndianCurrency(labor.cost)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="my-6 bg-gray-700" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">Equipment Costs</h3>
                  <div className="space-y-4">
                    {estimationResult.equipment.map((equipment, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-white">{equipment.name}</p>
                          <p className="text-sm text-white">
                            {equipment.hours
                              ? `${equipment.hours} hours`
                              : equipment.days
                                ? `${equipment.days} days`
                                : ""}
                          </p>
                        </div>
                        <p className="font-semibold text-white">₹{formatIndianCurrency(equipment.cost)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">Overhead Costs</h3>
                  <div className="space-y-4">
                    {estimationResult.overhead.map((overhead, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-white">{overhead.name}</p>
                        </div>
                        <p className="font-semibold text-white">₹{formatIndianCurrency(overhead.cost)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="my-6 bg-gray-700" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-white">Total Cost</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-white">₹{formatIndianCurrency(estimationResult.totalCost)}</p>
                    <p className="text-white text-sm">Based on {area.toLocaleString()} sq ft</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-white">Project Duration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-white">{estimationResult.duration}</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-white">Sustainability Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-white">7.5/10</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 p-4 bg-blue-600/20 rounded-lg border border-blue-600/30">
                <h3 className="text-lg font-semibold mb-2 text-white">AI Resource Optimization Suggestions</h3>
                <ul className="space-y-2 text-white">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-400"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Consider using prefabricated components to reduce labor costs by 15%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-400"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Opt for fly ash bricks instead of clay bricks for better sustainability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-400"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Schedule concrete pouring during cooler hours to improve quality</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">Save Estimation</Button>
              <Button variant="outline" className="w-full sm:w-auto border-blue-600 text-blue-400 hover:bg-blue-600/20">
                Request Material Quotes
              </Button>
            </CardFooter>
          </Card>
        )}
      </>
    )
  }

  // Projects tab content
  const renderProjectsContent = () => {
    return (
      <div className="space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">My Projects</CardTitle>
            <CardDescription className="text-white">Manage your ongoing construction projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myProjects.map((project) => (
                <Card key={project.id} className="bg-gray-700 border-gray-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white">{project.name}</CardTitle>
                    <CardDescription className="text-white">
                      {project.type} at {project.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white">Progress:</span>
                      <span className="text-white">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2 bg-gray-600" />
                    <div className="flex justify-between text-sm">
                      <span className="text-white">Budget:</span>
                      <span className="text-white">₹{formatIndianCurrency(project.budget)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white">Spent:</span>
                      <span className="text-white">₹{formatIndianCurrency(project.spent)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white">Timeline:</span>
                      <span className="text-white">
                        {project.startDate} to {project.endDate}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">View Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Start New Project</CardTitle>
            <CardDescription className="text-white">Begin planning your next construction project</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Create New Project</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Materials tab content
  const renderMaterialsContent = () => {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Materials Management</CardTitle>
          <CardDescription className="text-white">Track and manage your construction materials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-white">Material</th>
                  <th className="text-left py-3 px-4 text-white">Quantity</th>
                  <th className="text-left py-3 px-4 text-white">Unit Price</th>
                  <th className="text-left py-3 px-4 text-white">Total Price</th>
                  <th className="text-left py-3 px-4 text-white">Status</th>
                  <th className="text-left py-3 px-4 text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {materialsList.map((material) => (
                  <tr key={material.id} className="border-b border-gray-700">
                    <td className="py-3 px-4 text-white">{material.name}</td>
                    <td className="py-3 px-4 text-white">{material.quantity}</td>
                    <td className="py-3 px-4 text-white">₹{formatIndianCurrency(material.unitPrice)}</td>
                    <td className="py-3 px-4 text-white">₹{formatIndianCurrency(material.totalPrice)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          material.status === "Delivered"
                            ? "bg-green-500/20 text-green-400"
                            : material.status === "Partially Delivered"
                              ? "bg-amber-500/20 text-amber-400"
                              : material.status === "Ordered"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {material.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-400">
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add Material</Button>
            <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-600/20">
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Expenses tab content
  const renderExpensesContent = () => {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Expense Tracking</CardTitle>
          <CardDescription className="text-white">Monitor and manage your construction expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-white">Date</th>
                  <th className="text-left py-3 px-4 text-white">Category</th>
                  <th className="text-left py-3 px-4 text-white">Description</th>
                  <th className="text-left py-3 px-4 text-white">Amount</th>
                  <th className="text-left py-3 px-4 text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expensesList.map((expense) => (
                  <tr key={expense.id} className="border-b border-gray-700">
                    <td className="py-3 px-4 text-white">{expense.date}</td>
                    <td className="py-3 px-4 text-white">{expense.category}</td>
                    <td className="py-3 px-4 text-white">{expense.description}</td>
                    <td className="py-3 px-4 text-white">₹{formatIndianCurrency(expense.amount)}</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-400">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add Expense</Button>
            <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-600/20">
              Export Expenses
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Profile tab content
  const renderProfileContent = () => {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">User Profile</CardTitle>
          <CardDescription className="text-white">Manage your account information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-white">Full Name</Label>
                <div className="text-lg font-medium text-white">{profileData.name}</div>
              </div>
              <div>
                <Label className="text-white">Email Address</Label>
                <div className="text-lg font-medium text-white">{profileData.email}</div>
              </div>
              <div>
                <Label className="text-white">Phone Number</Label>
                <div className="text-lg font-medium text-white">{profileData.phone}</div>
              </div>
              <div>
                <Label className="text-white">Address</Label>
                <div className="text-lg font-medium text-white">{profileData.address}</div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-white">Active Projects</Label>
                <div className="text-lg font-medium text-white">{profileData.projects}</div>
              </div>
              <div>
                <Label className="text-white">Member Since</Label>
                <div className="text-lg font-medium text-white">{profileData.joinDate}</div>
              </div>
              <div className="pt-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Edit Profile</Button>
              </div>
              <div>
                <Button variant="outline" className="w-full border-blue-600 text-blue-400 hover:bg-blue-600/20">
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* AI Prediction Sidebar */}
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-10">
        <AIPredictionSidebar projectType={constructionType} projectSize={subType} />
      </div>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-6 w-6 text-white" />
      </button>

      {/* Sidebar Navigation */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-30 w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto`}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Construction className="h-6 w-6 text-blue-400" />
            <h1 className="text-xl font-bold text-white">BuildSmart AI</h1>
          </div>

          <div className="space-y-1">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "dashboard" ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700 hover:text-white"}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <Home className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "projects" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "projects" ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700 hover:text-white"}`}
              onClick={() => setActiveTab("projects")}
            >
              <Package className="mr-2 h-5 w-5" />
              My Projects
            </Button>
            <Button
              variant={activeTab === "materials" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "materials" ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700 hover:text-white"}`}
              onClick={() => setActiveTab("materials")}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Materials
            </Button>
            <Button
              variant={activeTab === "expenses" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "expenses" ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700 hover:text-white"}`}
              onClick={() => setActiveTab("expenses")}
            >
              <DollarSign className="mr-2 h-5 w-5" />
              Expenses
            </Button>
            <Button
              variant={activeTab === "profile" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "profile" ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700 hover:text-white"}`}
              onClick={() => setActiveTab("profile")}
            >
              <User className="mr-2 h-5 w-5" />
              Profile
            </Button>
          </div>

          <Separator className="my-6 bg-gray-700" />

          <Link href="/">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-700 hover:text-white">
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            {activeTab === "dashboard"
              ? "Homeowner Dashboard"
              : activeTab === "projects"
                ? "My Projects"
                : activeTab === "materials"
                  ? "Materials Management"
                  : activeTab === "expenses"
                    ? "Expense Tracking"
                    : activeTab === "profile"
                      ? "User Profile"
                      : "Homeowner Dashboard"}
          </h1>
          <p className="text-white">
            {activeTab === "dashboard"
              ? "Plan and manage your construction projects"
              : activeTab === "projects"
                ? "View and manage your ongoing construction projects"
                : activeTab === "materials"
                  ? "Track and manage your construction materials"
                  : activeTab === "expenses"
                    ? "Monitor and manage your construction expenses"
                    : activeTab === "profile"
                      ? "Manage your account information"
                      : "Plan and manage your construction projects"}
          </p>
        </header>

        <div className="grid gap-6">{renderTabContent()}</div>
      </div>
    </div>
  )
}

