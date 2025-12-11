"use client";
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

interface EventHall {
  id: number;
  name: string;
  location: string | null;
  location_link: string | null;
  description: string | null;
  capacity: string | null;
  images: string[];
}

// Fix for default marker icon in Next.js
const createCustomIcon = () => {
  if (typeof window !== "undefined") {
    return L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  }
  return null;
};

// Component to adjust map bounds
function MapBounds({
  locations,
}: {
  locations: { lat: number; lng: number }[];
}) {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map((loc) => [loc.lat, loc.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });

      if (locations.length === 1) {
        map.setZoom(13);
      }
    }
  }, [locations, map]);

  return null;
}

// Extract coordinates from Google Maps link
const extractCoordinates = (
  locationLink: string | null
): { lat: number; lng: number } | null => {
  if (!locationLink) return null;

  try {
    const coordPattern = /q=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const coordMatch = locationLink.match(coordPattern);
    if (coordMatch) {
      return { lat: parseFloat(coordMatch[1]), lng: parseFloat(coordMatch[2]) };
    }

    const placePattern = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const placeMatch = locationLink.match(placePattern);
    if (placeMatch) {
      return { lat: parseFloat(placeMatch[1]), lng: parseFloat(placeMatch[2]) };
    }

    console.warn("Unsupported location link format:", locationLink);
    return null;
  } catch (err) {
    console.error("Error parsing location link:", err);
    return null;
  }
};

interface MapContentProps {
  eventHalls: EventHall[];
}

export default function MapContent({ eventHalls }: MapContentProps) {
  const customIcon = createCustomIcon();

  const validLocations = eventHalls
    .map((hall) => {
      const coords = extractCoordinates(hall.location_link);
      return coords ? { ...hall, coords } : null;
    })
    .filter(
      (item): item is EventHall & { coords: { lat: number; lng: number } } =>
        item !== null
    );

  const defaultCenter: [number, number] = [47.9184, 106.9177];

  if (!customIcon) {
    return (
      <div className="h-96 w-full bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-white">Initializing map...</div>
      </div>
    );
  }

  return (
    <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        className="h-full w-full"
        style={{ background: "#1f2937" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validLocations.map((hall) => (
          <Marker
            key={hall.id}
            position={[hall.coords.lat, hall.coords.lng]}
            icon={customIcon}
          >
            <Popup maxWidth={300} className="custom-popup">
              <div className="p-2">
                <h3 className="font-bold text-lg mb-2 text-gray-900">
                  {hall.name}
                </h3>
                {hall.images && hall.images.length > 0 && (
                  <img
                    src={hall.images[0]}
                    alt={hall.name}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                )}
                <p className="text-sm text-gray-700 mb-1">
                  <strong>📍 Location:</strong> {hall.location || "N/A"}
                </p>
                {hall.capacity && (
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>👥 Capacity:</strong> {hall.capacity}
                  </p>
                )}
                {hall.description && (
                  <p className="text-xs text-gray-600 mt-2">
                    {hall.description.substring(0, 100)}
                    {hall.description.length > 100 ? "..." : ""}
                  </p>
                )}
                {hall.location_link && (
                  <a
                    href={hall.location_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View on Google Maps →
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        <MapBounds locations={validLocations.map((h) => h.coords)} />
      </MapContainer>

      {validLocations.length === 0 && (
        <div className="absolute inset-0 bg-gray-800/90 flex items-center justify-center pointer-events-none">
          <p className="text-gray-400">
            No event halls with locations to display
          </p>
        </div>
      )}
    </div>
  );
}
