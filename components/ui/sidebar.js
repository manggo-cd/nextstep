"use client";

import React, { useState, useMemo, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Result from "@/components/ui/result"

// 1) Import the Zustand store if you're using it:
import { useAppStore } from "@/lib/store" // example path

export default function Sidebar({ results = [] }) {
  const [search, setSearch] = useState("")

  // 2) Grab setSearchResults from your Zustand store
  const { setSearchResults } = useAppStore()

  // Update local `search` state whenever the user types.
  const handleChange = (event) => {
    setSearch(event.target.value);
  };

  // Example categories array (Google Maps–style).
  // On click, we can setSearch(...) or do something else.
  const categories = [
    { label: "Restaurants", icon: <Utensils className="h-4 w-4" /> },
    { label: "Hotels", icon: <Hotel className="h-4 w-4" /> },
    { label: "Things to do", icon: <Camera className="h-4 w-4" /> },
    { label: "Museums", icon: <Landmark className="h-4 w-4" /> },
    { label: "Transit", icon: <Train className="h-4 w-4" /> },
    { label: "Pharmacies", icon: <Stethoscope className="h-4 w-4" /> },
    { label: "ATMs", icon: <DollarSign className="h-4 w-4" /> },
  ];

  // For demonstration, we do a simple "mock" filter of results
  // if `search` is not empty. In a real app, you'd fetch or filter actual data.
  const filteredResults = useMemo(() => {
    if (!search) return []
    // Real logic might actually filter or fetch
    return [
      {
        title: "Sample Result 1",
        description: "A short description.A short description.A short description.A short description.",
        longitude: -130,
        latitude: 49,
        date: "2024-01-01",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Elizabeth_Tower%2C_June_2022.jpg/800px-Elizabeth_Tower%2C_June_2022.jpg",
      },
      {
        title: "Sample Result 2",
        description: "Another sample result 2",
        longitude: -123.12,
        latitude: 49.28,
        date: "2025-05-10",
        image:
          "https://static.scientificamerican.com/sciam/cache/file/C2015DC2-3B05-4B02-B37E1DFB642662F4_source.jpg",
      },
      
    ]
  }, [search])

  // 3) Whenever filteredResults changes, log them and store them globally
  useEffect(() => {
    console.log("Filtered results:", filteredResults);
    setSearchResults(filteredResults);
  }, [filteredResults, setSearchResults]);

  return (
    <div>
      <div className="mb-4">
        <Label htmlFor="search" className="mb-2">
          Search
        </Label>
        <Input
          id="search"
          value={search}
          onChange={handleChange}
          placeholder="Search something..."
        />
      </div>

      <div className="flex flex-col gap-4">
        {search.length === 0 ? (
          <p className="text-sm text-gray-500">No search yet.</p>
        ) : filteredResults.length === 0 ? (
          <p className="text-sm text-gray-500">
            No results found for &quot;{search}&quot;.
          </p>
        ) : (
          filteredResults.map((res, i) => (
            <Result
              key={i}
              title={res.title}
              description={res.description}
              longitude={res.longitude}
              latitude={res.latitude}
              date={res.date}
              image={res.image}
            />
          ))
        )}
      </div>
    </div>
  );
}
