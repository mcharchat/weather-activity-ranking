import { Header } from "@/components/header"
import type { Location } from "@/types/location-types"
import { useState } from "react"

export function App() {
  const [selectedActivity, setSelectedActivity] = useState<string>("skiing")
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  )

  return (
    <div className="h-screen w-full">
      <Header
        selectedActivity={selectedActivity}
        onSelectActivity={setSelectedActivity}
        onSelectLocation={setSelectedLocation}
      />
      <div className="flex">oi</div>
    </div>
  )
}

export default App
