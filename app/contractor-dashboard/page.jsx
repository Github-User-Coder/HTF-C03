"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Construction,
  DollarSign,
  FileText,
  Home,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  User,
  Users,
} from "lucide-react"
import Link from "next/link"
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

// Dummy data for projects
const projects = [
  {
    id: 1,
    name: "Modern Villa Construction",
    client: "John Smith",
    type: "Villa",
    location: "123 Main St, Anytown",
    progress: 35,
    startDate: "2023-05-15",
    endDate: "2023-12-20",
    budget: 4500000,
    spent: 1575000,
    status: "In Progress",
    materials: [
      { name: "Cement", required: "120 bags", delivered: "50 bags", status: "Partial" },
      { name: "Steel", required: "5 tons", delivered: "2 tons", status: "Partial" },
      { name: "Bricks", required: "12000 pieces", delivered: "5000 pieces", status: "Partial" },
      { name: "Sand", required: "60 cubic meters", delivered: "25 cubic meters", status: "Partial" },
    ],
    labor: [
      { type: "Mason", assigned: 6, present: 5 },
      { type: "Helper", assigned: 12, present: 10 },
      { type: "Carpenter", assigned: 3, present: 3 },
      { type: "Electrician", assigned: 1, present: 1 },
    ],
    tasks: [
      { name: "Foundation Work", status: "Completed", dueDate: "2023-06-15" },
      { name: "Wall Construction", status: "In Progress", dueDate: "2023-08-30" },
      { name: "Electrical Wiring", status: "Not Started", dueDate: "2023-09-15" },
      { name: "Plumbing", status: "Not Started", dueDate: "2023-09-30" },
    ],
  },
  {
    id: 2,
    name: "Commercial Office Building",
    client: "ABC Corporation",
    type: "Commercial Office",
    location: "456 Business Park, Anytown",
    progress: 65,
    startDate: "2023-02-10",
    endDate: "2023-11-30",
    budget: 12000000,
    spent: 7800000,
    status: "In Progress",
    materials: [
      { name: "Cement", required: "500 bags", delivered: "400 bags", status: "Partial" },
      { name: "Steel", required: "25 tons", delivered: "20 tons", status: "Partial" },
      { name: "Glass", required: "200 panels", delivered: "150 panels", status: "Partial" },
      { name: "Aluminum", required: "3 tons", delivered: "2 tons", status: "Partial" },
    ],
    labor: [
      { type: "Mason", assigned: 15, present: 12 },
      { type: "Helper", assigned: 30, present: 25 },
      { type: "Carpenter", assigned: 8, present: 7 },
      { type: "Electrician", assigned: 5, present: 4 },
    ],
    tasks: [
      { name: "Foundation Work", status: "Completed", dueDate: "2023-03-15" },
      { name: "Structure Construction", status: "Completed", dueDate: "2023-06-30" },
      { name: "Interior Work", status: "In Progress", dueDate: "2023-09-15" },
      { name: "Finishing", status: "Not Started", dueDate: "2023-10-30" },
    ],
  },
]

export default function ContractorDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(projects[0])
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
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
              Projects
            </Button>
            <Button
              variant={activeTab === "labor" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "labor" ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700 hover:text-white"}`}
              onClick={() => setActiveTab("labor")}
            >
              <Users className="mr-2 h-5 w-5" />
              Labor Management
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
              variant={activeTab === "schedule" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "schedule" ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700 hover:text-white"}`}
              onClick={() => setActiveTab("schedule")}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Schedule
            </Button>
            <Button
              variant={activeTab === "finances" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "finances" ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700 hover:text-white"}`}
              onClick={() => setActiveTab("finances")}
            >
              <DollarSign className="mr-2 h-5 w-5" />
              Finances
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
          <h1 className="text-3xl font-bold text-white">Contractor Dashboard</h1>
          <p className="text-white">Manage your construction projects efficiently</p>
        </header>

        <div className="grid gap-6">
          {/* Project Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardDescription className="text-white">Active Projects</CardDescription>
                <CardTitle className="text-2xl text-white">5</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-green-400 flex items-center">
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
                    className="mr-1"
                  >
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                    <polyline points="16 7 22 7 22 13"></polyline>
                  </svg>
                  <span>2 new this month</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardDescription className="text-white">Labor Assigned</CardDescription>
                <CardTitle className="text-2xl text-white">87</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-amber-400 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>12 absent today</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardDescription className="text-white">Material Requests</CardDescription>
                <CardTitle className="text-2xl text-white">24</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-blue-400 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>8 pending approval</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardDescription className="text-white">Tasks Due This Week</CardDescription>
                <CardTitle className="text-2xl text-white">12</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-red-400 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>3 overdue</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Selection */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Project Management</CardTitle>
              <CardDescription className="text-white">
                Select a project to view details and manage resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className={`bg-gray-700 border-gray-600 cursor-pointer transition-all hover:bg-gray-600 ${
                      selectedProject.id === project.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedProject(project)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white">{project.name}</CardTitle>
                      <CardDescription className="text-white">Client: {project.client}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white">Progress:</span>
                          <span className="text-white">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2 bg-gray-600" />
                        <div className="flex justify-between text-sm">
                          <span className="text-white">Budget Spent:</span>
                          <span className="text-white">
                            ₹{formatIndianCurrency(project.spent)} / ₹{formatIndianCurrency(project.budget)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Project Details */}
          {selectedProject && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">{selectedProject.name}</CardTitle>
                <CardDescription className="text-white">
                  {selectedProject.type} at {selectedProject.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList className="bg-gray-700">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 text-white">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="labor" className="data-[state=active]:bg-blue-600 text-white">
                      Labor Management
                    </TabsTrigger>
                    <TabsTrigger value="materials" className="data-[state=active]:bg-blue-600 text-white">
                      Materials
                    </TabsTrigger>
                    <TabsTrigger value="tasks" className="data-[state=active]:bg-blue-600 text-white">
                      Tasks
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-gray-700 border-gray-600">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-white">Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-white">Start Date:</span>
                              <span className="text-white">{selectedProject.startDate}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white">End Date:</span>
                              <span className="text-white">{selectedProject.endDate}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white">Status:</span>
                              <span className="text-green-400">{selectedProject.status}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-700 border-gray-600">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-white">Budget</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-white">Total Budget:</span>
                              <span className="text-white">₹{formatIndianCurrency(selectedProject.budget)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white">Spent:</span>
                              <span className="text-white">₹{formatIndianCurrency(selectedProject.spent)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white">Remaining:</span>
                              <span className="text-green-400">
                                ₹{formatIndianCurrency(selectedProject.budget - selectedProject.spent)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-700 border-gray-600">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-white">Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-center">
                              <div className="relative h-24 w-24 flex items-center justify-center">
                                <svg className="h-full w-full" viewBox="0 0 100 100">
                                  <circle
                                    className="text-gray-600"
                                    strokeWidth="8"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="40"
                                    cx="50"
                                    cy="50"
                                  />
                                  <circle
                                    className="text-blue-500"
                                    strokeWidth="8"
                                    strokeDasharray={`${selectedProject.progress * 2.51} 251`}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="40"
                                    cx="50"
                                    cy="50"
                                  />
                                </svg>
                                <span className="absolute text-xl font-bold text-white">
                                  {selectedProject.progress}%
                                </span>
                              </div>
                            </div>
                            <div className="text-center text-sm text-white">Project is on track with the timeline</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="p-4 bg-blue-600/20 rounded-lg border border-blue-600/30">
                      <h3 className="text-lg font-semibold mb-2 text-white">AI Performance Insights</h3>
                      <ul className="space-y-2 text-white">
                        <li className="flex items-start gap-2">
                          <div className="rounded-full bg-green-600/30 p-1 mt-0.5">
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                          </div>
                          <span>Material usage efficiency is 15% better than industry average</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="rounded-full bg-amber-600/30 p-1 mt-0.5">
                            <AlertCircle className="h-4 w-4 text-amber-400" />
                          </div>
                          <span>Labor productivity could be improved by optimizing task assignments</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                            <FileText className="h-4 w-4 text-blue-400" />
                          </div>
                          <span>Consider ordering next batch of materials by next week to avoid delays</span>
                        </li>
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="labor" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white">Labor Assignment</h3>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Assign Workers</Button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-gray-700">
                              <th className="text-left py-3 px-4 text-white">Worker Type</th>
                              <th className="text-left py-3 px-4 text-white">Assigned</th>
                              <th className="text-left py-3 px-4 text-white">Present Today</th>
                              <th className="text-left py-3 px-4 text-white">Attendance</th>
                              <th className="text-left py-3 px-4 text-white">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedProject.labor.map((labor, index) => (
                              <tr key={index} className="border-b border-gray-700">
                                <td className="py-3 px-4 text-white">{labor.type}</td>
                                <td className="py-3 px-4 text-white">{labor.assigned}</td>
                                <td className="py-3 px-4 text-white">{labor.present}</td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center">
                                    <Progress
                                      value={(labor.present / labor.assigned) * 100}
                                      className="h-2 w-24 bg-gray-700"
                                    />
                                    <span className="ml-2 text-white">
                                      {Math.round((labor.present / labor.assigned) * 100)}%
                                    </span>
                                  </div>
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

                      <div className="p-4 bg-blue-600/20 rounded-lg border border-blue-600/30">
                        <h3 className="text-lg font-semibold mb-2 text-white">AI Labor Optimization</h3>
                        <ul className="space-y-2 text-white">
                          <li className="flex items-start gap-2">
                            <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                              <Users className="h-4 w-4 text-blue-400" />
                            </div>
                            <span>Consider adding 2 more carpenters next week for upcoming interior work</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                              <Users className="h-4 w-4 text-blue-400" />
                            </div>
                            <span>Mason productivity is 20% higher than average - consider performance bonuses</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="materials" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white">Material Requests</h3>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Request Materials</Button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-gray-700">
                              <th className="text-left py-3 px-4 text-white">Material</th>
                              <th className="text-left py-3 px-4 text-white">Required</th>
                              <th className="text-left py-3 px-4 text-white">Delivered</th>
                              <th className="text-left py-3 px-4 text-white">Status</th>
                              <th className="text-left py-3 px-4 text-white">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedProject.materials.map((material, index) => (
                              <tr key={index} className="border-b border-gray-700">
                                <td className="py-3 px-4 text-white">{material.name}</td>
                                <td className="py-3 px-4 text-white">{material.required}</td>
                                <td className="py-3 px-4 text-white">{material.delivered}</td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      material.status === "Complete"
                                        ? "bg-green-500/20 text-green-400"
                                        : material.status === "Partial"
                                          ? "bg-amber-500/20 text-amber-400"
                                          : "bg-red-500/20 text-red-400"
                                    }`}
                                  >
                                    {material.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-400">
                                    Track
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="p-4 bg-blue-600/20 rounded-lg border border-blue-600/30">
                        <h3 className="text-lg font-semibold mb-2 text-white">AI Material Insights</h3>
                        <ul className="space-y-2 text-white">
                          <li className="flex items-start gap-2">
                            <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                              <ShoppingBag className="h-4 w-4 text-blue-400" />
                            </div>
                            <span>Current cement usage is 5% higher than estimated - review application methods</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                              <ShoppingBag className="h-4 w-4 text-blue-400" />
                            </div>
                            <span>Steel prices expected to increase by 3% next month - consider ordering now</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="tasks" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white">Task Scheduling</h3>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add Task</Button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-gray-700">
                              <th className="text-left py-3 px-4 text-white">Task Name</th>
                              <th className="text-left py-3 px-4 text-white">Status</th>
                              <th className="text-left py-3 px-4 text-white">Due Date</th>
                              <th className="text-left py-3 px-4 text-white">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedProject.tasks.map((task, index) => (
                              <tr key={index} className="border-b border-gray-700">
                                <td className="py-3 px-4 text-white">{task.name}</td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      task.status === "Completed"
                                        ? "bg-green-500/20 text-green-400"
                                        : task.status === "In Progress"
                                          ? "bg-amber-500/20 text-amber-400"
                                          : "bg-blue-500/20 text-blue-400"
                                    }`}
                                  >
                                    {task.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-white">{task.dueDate}</td>
                                <td className="py-3 px-4">
                                  <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-400">
                                    Update
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="p-4 bg-blue-600/20 rounded-lg border border-blue-600/30">
                        <h3 className="text-lg font-semibold mb-2 text-white">AI Task Optimization</h3>
                        <ul className="space-y-2 text-white">
                          <li className="flex items-start gap-2">
                            <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                              <Calendar className="h-4 w-4 text-blue-400" />
                            </div>
                            <span>Schedule electrical wiring to start 1 week earlier to avoid bottlenecks</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                              <Calendar className="h-4 w-4 text-blue-400" />
                            </div>
                            <span>Consider parallel execution of plumbing and electrical work to save time</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-4">
                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">Generate Report</Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-blue-600 text-blue-400 hover:bg-blue-600/20"
                >
                  Contact Client
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

