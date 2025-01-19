// components/ui/map.js
"use client";

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useAppStore } from "@/lib/store";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Override default for search results
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Google_Maps_pin.svg/1200px-Google_Maps_pin.svg.png",
  shadowUrl: markerShadow.src,

  iconSize: [40, 65],
  iconAnchor: [20, 65],
  popupAnchor: [0, -60],
  shadowSize: [65, 65],
});

// Custom icon for user location
const userLocationIcon = L.icon({
  iconUrl:
    "https://cdn3.iconfinder.com/data/icons/maps-and-navigation-7/65/68-512.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// Button to fly to user location
function FlyToUserLocationButton() {
  const map = useMap();

  const handleFlyToLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          map.flyTo([coords.latitude, coords.longitude], 13, { duration: 2 });
        },
        (error) => console.error("Error retrieving location:", error)
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <button
      onClick={handleFlyToLocation}
      style={{
        position: "absolute",
        bottom: "10px",
        right: "10px",
        zIndex: 1000,
        padding: "10px",
        backgroundColor: "#27272a",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Fly to My Location
    </button>
  );
}

function AddPinOnClick({ onPinAdd }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onPinAdd({ lat, lng });
    },
  });
  return null;
}

export default function Map() {
  const { userLocation, setUserLocation, searchResults } = useAppStore();
  const [hasFetchedLocation, setHasFetchedLocation] = useState(false);
  const [clickedPin, setClickedPin] = useState(null);

  useEffect(() => {
    if (!hasFetchedLocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setHasFetchedLocation(true);
        },
        (err) => console.error("Error fetching location:", err),
        { enableHighAccuracy: true }
      );
    }
  }, [hasFetchedLocation, setUserLocation]);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[49, -125]}
        zoom={6}
        scrollWheelZoom
        zoomControl={false}  // remove default zoom in/out
        className="h-full w-full z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {userLocation && (
          <Marker position={userLocation} icon={userLocationIcon}>
            <Popup>
              <strong>You are here</strong>
            </Popup>
          </Marker>
        )}

        <FlyToUserLocationButton />

        {searchResults.map((res, i) => {
          if (
            typeof res.latitude === "number" &&
            typeof res.longitude === "number"
          ) {
            return (
              <Marker
                key={i}
                position={[res.latitude, res.longitude]}
                eventHandlers={{
                  mouseover: (e) => e.target.openPopup(),
                  mouseout: (e) => e.target.closePopup(),
                }}
              >
                <Popup>
                  <h3 className="font-semibold">{res.title || "Untitled"}</h3>
                  <p>{res.description || "No description."}</p>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}

        <AddPinOnClick
          onPinAdd={(newPin) => {
            setClickedPin(newPin);
            console.log("Pin dropped at:", newPin);
          }}
        />
        {clickedPin && (
          <Marker position={[clickedPin.lat, clickedPin.lng]}>
            <Popup>
              <p>You clicked here!</p>
              <p>
                Lat: {clickedPin.lat}, Lng: {clickedPin.lng}
              </p>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
