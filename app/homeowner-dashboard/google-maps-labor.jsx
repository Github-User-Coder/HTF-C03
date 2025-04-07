"\"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsRenderer } from "@react-google-maps/api"
import { Button } from "@/components/ui/button"
import { Users, MapPin, Phone } from "lucide-react"

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
const libraries = ["places", "directions"]

export function GoogleMapsLabor({
  homeLocation,
  laborTeams,
  selectedTeamId,
  setSelectedTeamId,
  showDirections,
  setShowDirections,
}) {
  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, // Replace with your actual API key in production
    libraries,
  })

  const [map, setMap] = useState(null)
  const [directions, setDirections] = useState(null)
  const directionsService = useRef(null)

  // Initialize map
  const onLoad = useCallback(
    function callback(map) {
      const bounds = new window.google.maps.LatLngBounds()
      bounds.extend(homeLocation)

      // Add labor team locations to bounds
      laborTeams.forEach((team) => {
        // Convert distance and angle to lat/lng
        const teamLocation = calculateTeamLocation(homeLocation, team.distance, team.id)
        bounds.extend(teamLocation)
      })

      map.fitBounds(bounds)
      setMap(map)
    },
    [homeLocation, laborTeams],
  )

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

  // Calculate directions when a team is selected and showDirections is true
  useEffect(() => {
    if (isLoaded && showDirections && selectedTeamId && map) {
      if (!directionsService.current) {
        directionsService.current = new window.google.maps.DirectionsService()
      }

      const selectedTeam = laborTeams.find((team) => team.id === selectedTeamId)
      if (selectedTeam) {
        const teamLocation = calculateTeamLocation(homeLocation, selectedTeam.distance, selectedTeam.id)

        directionsService.current.route(
          {
            origin: homeLocation,
            destination: teamLocation,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              setDirections(result)
            } else {
              console.error(`Directions request failed: ${status}`)
            }
          },
        )
      }
    } else if (!showDirections) {
      setDirections(null)
    }
  }, [isLoaded, showDirections, selectedTeamId, homeLocation, laborTeams, map])

  // Handle loading and error states
  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">Error loading maps</div>
    )
  }

  if (!isLoaded) {
    return <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">Loading maps...</div>
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
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
        position={homeLocation}
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

      {/* Labor team markers */}
      {laborTeams.map((team) => {
        const teamLocation = calculateTeamLocation(homeLocation, team.distance, team.id)

        return (
          <Marker
            key={team.id}
            position={teamLocation}
            onClick={() => setSelectedTeamId(team.id)}
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

      {/* Info window for selected team */}
      {selectedTeamId && (
        <InfoWindow
          position={calculateTeamLocation(
            homeLocation,
            laborTeams.find((t) => t.id === selectedTeamId).distance,
            selectedTeamId,
          )}
          onCloseClick={() => setSelectedTeamId(null)}
        >
          <div className="p-2 max-w-xs">
            <h3 className="font-semibold text-gray-900">{laborTeams.find((t) => t.id === selectedTeamId).name}</h3>
            <div className="flex items-center gap-1 mt-1 text-sm text-gray-700">
              <Users className="h-3 w-3" />
              <span>{laborTeams.find((t) => t.id === selectedTeamId).members} members</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-sm text-gray-700">
              <MapPin className="h-3 w-3" />
              <span>{laborTeams.find((t) => t.id === selectedTeamId).distance} km away</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-sm text-gray-700">
              <Phone className="h-3 w-3" />
              <span>{laborTeams.find((t) => t.id === selectedTeamId).phone}</span>
            </div>
            <div className="mt-2">
              <Button
                size="sm"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1"
                onClick={() => setShowDirections(true)}
              >
                Show Directions
              </Button>
            </div>
          </div>
        </InfoWindow>
      )}

      {/* Render directions if available */}
      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{
            polylineOptions: {
              strokeColor: "#3b82f6",
              strokeWeight: 4,
            },
            suppressMarkers: true,
          }}
        />
      )}
    </GoogleMap>
  )
}

