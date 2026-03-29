import { Icon } from "@iconify/react"
import { LocationCombobox } from "./location-combobox"
import { ActivitiesTabs } from "./activities-tabs"
import type { Location } from "@/types/location-types"

export function Header({
  selectedActivity,
  onSelectActivity,
  onSelectLocation,
}: {
  selectedActivity: string
  onSelectActivity: (activity: string) => void
  onSelectLocation: (location: Location | null) => void
}) {
  return (
    <div className="flex flex-col justify-center bg-primary text-primary-foreground">
      <div className="flex flex-col items-center gap-1 p-4">
        <Icon icon="ph:mountains" height={80} />
        <h1 className="text-2xl font-bold">Weather Activity Ranking</h1>
        <p className="text-center text-sm text-primary-foreground/70">
          select your city to see the ranking of activities based on the weather
        </p>
      </div>
      <div className="flex flex-col gap-1 px-4">
        <LocationCombobox
          onSelectLocation={onSelectLocation}
        />
        <div className="w-[calc(100vw-2rem)] overflow-x-auto overflow-y-hidden hide-scrollbar">
          <ActivitiesTabs
            selectedActivity={selectedActivity}
            onSelectActivity={onSelectActivity}
          />
        </div>
      </div>
    </div>
  )
}
