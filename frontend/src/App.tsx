import { Header } from "@/components/header"
import { useState } from "react"

export function App() {
  const [selectedActivity, setSelectedActivity] = useState<string>("skiing")

  return (
    <div className="h-screen w-full">
      <Header selectedActivity={selectedActivity} onSelectActivity={setSelectedActivity} />
      <div className="flex">oi</div>
    </div>
  )
}

export default App
