"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Brain, ChevronRight, Clock, DollarSign, Loader2, TrendingUp } from "lucide-react"
import { useState } from "react"

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

export function AIPredictionSidebar({ projectType, projectSize }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeSection, setActiveSection] = useState("overview")

  const generatePredictions = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  // Handle icon click in collapsed state
  const handleIconClick = (section) => {
    if (!isExpanded) {
      setIsExpanded(true)
      setActiveSection(section)
    } else {
      setActiveSection(section)
    }
  }

  return (
    <Card
      className={`bg-gray-800 text-white border-gray-700 transition-all duration-300 ${isExpanded ? "w-80" : "w-16"}`}
    >
      <div className="absolute -left-3 top-1/2 transform -translate-y-1/2">
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 rounded-full bg-gray-700 border-gray-600 text-white"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
        </Button>
      </div>

      {isExpanded ? (
        <>
          <CardHeader className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-400" />
              <CardTitle className="text-lg text-white">AI Predictions</CardTitle>
            </div>
          </CardHeader>
          <Separator className="bg-gray-700" />
          <CardContent className="p-4 space-y-4">
            {activeSection === "overview" && (
              <div>
                <h3 className="text-sm font-medium text-white mb-1">Project Progress</h3>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white">Current</span>
                  <span className="text-sm font-medium text-white">35%</span>
                </div>
                <Progress value={35} className="h-2 bg-gray-700" />
              </div>
            )}

            {activeSection === "timeline" && (
              <div>
                <h3 className="text-sm font-medium text-white mb-2">Timeline Forecast</h3>
                <div className="flex items-center gap-2 text-amber-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm text-white">2 days behind schedule</span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm text-white">
                    <span>Foundation Work</span>
                    <span className="text-green-400">Completed</span>
                  </div>
                  <div className="flex justify-between text-sm text-white">
                    <span>Wall Construction</span>
                    <span className="text-amber-400">In Progress</span>
                  </div>
                  <div className="flex justify-between text-sm text-white">
                    <span>Electrical Wiring</span>
                    <span>Not Started</span>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "budget" && (
              <div>
                <h3 className="text-sm font-medium text-white mb-2">Budget Forecast</h3>
                <div className="flex items-center gap-2 text-red-400">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm text-white">₹7,00,000 over budget</span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm text-white">
                    <span>Material Costs</span>
                    <span className="text-red-400">15% over</span>
                  </div>
                  <div className="flex justify-between text-sm text-white">
                    <span>Labor Costs</span>
                    <span className="text-green-400">5% under</span>
                  </div>
                  <div className="flex justify-between text-sm text-white">
                    <span>Equipment Costs</span>
                    <span className="text-amber-400">On target</span>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "optimization" && (
              <div>
                <h3 className="text-sm font-medium text-white mb-2">Optimization Suggestions</h3>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-1">
                    <TrendingUp className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                    <span className="text-white">Reduce steel wastage by pre-cutting</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <TrendingUp className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                    <span className="text-white">Schedule concrete delivery for morning</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <TrendingUp className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                    <span className="text-white">Consider using fly ash bricks for better sustainability</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <TrendingUp className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                    <span className="text-white">Optimize labor allocation during peak hours</span>
                  </li>
                </ul>
              </div>
            )}

            <Button
              onClick={generatePredictions}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Refresh Predictions"
              )}
            </Button>
          </CardContent>
        </>
      ) : (
        <div className="h-full flex flex-col items-center py-4 gap-6">
          <button
            className="p-2 rounded-md hover:bg-gray-700 transition-colors"
            onClick={() => handleIconClick("overview")}
          >
            <Brain className="h-6 w-6 text-blue-400" />
          </button>
          <button
            className="p-2 rounded-md hover:bg-gray-700 transition-colors"
            onClick={() => handleIconClick("timeline")}
          >
            <Clock className="h-6 w-6 text-blue-400" />
          </button>
          <button
            className="p-2 rounded-md hover:bg-gray-700 transition-colors"
            onClick={() => handleIconClick("budget")}
          >
            <DollarSign className="h-6 w-6 text-blue-400" />
          </button>
          <button
            className="p-2 rounded-md hover:bg-gray-700 transition-colors"
            onClick={() => handleIconClick("optimization")}
          >
            <TrendingUp className="h-6 w-6 text-blue-400" />
          </button>
        </div>
      )}
    </Card>
  )
}

