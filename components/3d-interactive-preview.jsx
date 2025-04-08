"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Truck, Warehouse } from "lucide-react"

export default function ResourcePredictionPage() {
  const [projectType, setProjectType] = useState("residential")
  const [projectSize, setProjectSize] = useState(2000)
  const [projectDuration, setProjectDuration] = useState(6)
  const [location, setLocation] = useState("mumbai")
  const [complexity, setComplexity] = useState("medium")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState(null)

  const handlePredict = () => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      // Sample prediction results
      const predictionResults = {
        materials: {
          cement: { quantity: 850, unit: "bags", cost: 382500 },
          sand: { quantity: 425, unit: "cubic meters", cost: 127500 },
          aggregate: { quantity: 680, unit: "cubic meters", cost: 204000 },
          steel: { quantity: 32, unit: "tons", cost: 1920000 },
          bricks: { quantity: 42000, unit: "pieces", cost: 210000 },
          wood: { quantity: 120, unit: "cubic meters", cost: 360000 },
        },
        labor: {
          skilled: { quantity: 18, unit: "workers", cost: 1080000 },
          unskilled: { quantity: 35, unit: "workers", cost: 1050000 },
          supervisors: { quantity: 3, unit: "workers", cost: 360000 },
        },
        equipment: {
          excavator: { quantity: 2, unit: "units", cost: 240000 },
          mixer: { quantity: 3, unit: "units", cost: 90000 },
          crane: { quantity: 1, unit: "units", cost: 300000 },
        },
        totalCost: 6324000,
        timeline: {
          foundation: { start: 0, duration: 1.5 },
          structure: { start: 1.5, duration: 3 },
          finishing: { start: 4.5, duration: 1.5 },
        }
      }
      
      setResults(predictionResults)
      setIsLoading(false)
    }, 2000)
  }

  const formatIndianCurrency = (amount) => {
    return amount.toLocaleString('en-IN', {
      maximumFractionDigits: 0,
      style: 'currency',
      currency: 'INR'
    })
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">AI Resource Prediction</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Project Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="project-type" className="text-white">Project Type</Label>
                <Select value={projectType} onValueChange={setProjectType}>
                  <SelectTrigger id="project-type" className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="residential" className="focus:bg-gray-600 focus:text-white">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span>Residential</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="commercial" className="focus:bg-gray-600 focus:text-white">
                      <div className="flex items-center gap-2">
                        <Warehouse className="h-4 w-4" />
                        <span>Commercial</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="industrial" className="focus:bg-gray-600 focus:text-white">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        <span>Industrial</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project-size" className="text-white">Project Size (sq. ft.)</Label>
                <div className="flex items-center gap-4
\
\
\
