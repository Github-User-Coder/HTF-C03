"use client"

import { useState, useCallback } from "react"
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api"
import { Button } from "@/components/ui/button"

// Map container style
const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "0.5rem",
}

// Mumbai center coordinates
const center = {
  lat: 19.076,
  lng: 72.8777,
}

// Google Maps API libraries to load
const libraries = ["places"]

export default function GoogleMapsLabor({
  homeLocation,
  laborTeams,
  selectedTeamId,
  setSelectedTeamId,
  showDirections,
  setShowDirections,
}) {
  console.log("Environment variable:", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? "exists" : "not found")

  // Use the useLoadScript hook instead of useJsApiLoader
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  })

  const [map, setMap] = useState(null)

  // Initialize map
  const onLoad = useCallback(function callback(map) {
    console.log("Map loaded successfully")
    setMap(map)
  }, [])

  // Clean up map on unmount
  const onUnmount = useCallback(function callback() {
    setMap(null)
  }, [])

  // Calculate team location based on distance and ID (for demo purposes)
  const calculateTeamLocation = (homeLocation, distance, id) => {
    // Use team ID to create a unique angle
    const angle = (id % 8) * (Math.PI / 4)

    // Convert km to degrees (approximate)
    const latOffset = (distance / 111) * Math.cos(angle)
    const lngOffset = ((distance / 111) * Math.sin(angle)) / Math.cos((homeLocation.lat * Math.PI) / 180)

    return {
      lat: homeLocation.lat + latOffset,
      lng: homeLocation.lng + lngOffset,
    }
  }

  // Handle loading and error states
  if (loadError) {
    console.error("Error loading Google Maps:", loadError)
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 text-white p-4">
        <div className="text-red-400 mb-2">Error loading Google Maps</div>
        <div className="text-sm opacity-80 text-center max-w-md">
          There was an issue loading the Google Maps API. Please check your API key configuration. Error details:{" "}
          {loadError.message || "Unknown error"}
        </div>
        <div className="mt-4">
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
        <div className="animate-spin mr-2 h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        Loading maps...
      </div>
    )
  }

  // Render a simplified map with just the home location marker
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={homeLocation || center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        styles: [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: [{ color: "#242f3e" }],
          },
          {
            featureType: "all",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#242f3e" }],
          },
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [{ color: "#746855" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }],
          },
        ],
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      {/* Home location marker */}
      <Marker
        position={homeLocation || center}
        icon={{
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 16),
        }}
      />

      {/* Labor team markers - simplified to just show markers */}
      {laborTeams &&
        laborTeams.map((team) => {
          const teamLocation = calculateTeamLocation(homeLocation || center, team.distance, team.id)

          return (
            <Marker
              key={team.id}
              position={teamLocation}
              onClick={() => setSelectedTeamId && setSelectedTeamId(team.id)}
              icon={{
                url:
                  "data:image/svg+xml;charset=UTF-8," +
                  encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              `),
                scaledSize: new window.google.maps.Size(28, 28),
                anchor: new window.google.maps.Point(14, 14),
              }}
            />
          )
        })}
    </GoogleMap>
  )
}

