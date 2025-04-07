"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function MapTest() {
  const [status, setStatus] = useState("Not tested")
  const [error, setError] = useState(null)
  const [apiKey, setApiKey] = useState(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "Not found")

  const testGoogleMapsAPI = () => {
    setStatus("Testing...")
    setError(null)

    // Create a script element
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=places`
    script.async = true
    script.defer = true

    // Define the callback function
    window.initMap = () => {
      setStatus("Success! Google Maps API loaded correctly.")
    }

    // Handle errors
    script.onerror = (e) => {
      setStatus("Failed")
      setError("Failed to load Google Maps API. Check your API key and network connection.")
      console.error("Google Maps API loading error:", e)
    }

    // Add the script to the document
    document.head.appendChild(script)
  }

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg">
      <h2 className="text-xl font-bold mb-4">Google Maps API Test</h2>

      <div className="mb-4">
        <p className="mb-2">API Key Status: {apiKey === "Not found" ? "Not found" : "Found (masked)"}</p>
        <p className="mb-2">
          Test Status:{" "}
          <span
            className={
              status === "Success! Google Maps API loaded correctly."
                ? "text-green-400"
                : status === "Failed"
                  ? "text-red-400"
                  : "text-white"
            }
          >
            {status}
          </span>
        </p>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      <Button className="bg-blue-600 hover:bg-blue-700" onClick={testGoogleMapsAPI}>
        Test Google Maps API
      </Button>
    </div>
  )
}

