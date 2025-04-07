"use client"

import MapTest from "@/components/map-test"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LaborAvailabilityTest() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Google Maps API Test Page</h1>
        <p className="mb-6">This page helps diagnose issues with the Google Maps API integration.</p>

        <MapTest />

        <div className="mt-8">
          <Link href="/homeowner-dashboard">
            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

