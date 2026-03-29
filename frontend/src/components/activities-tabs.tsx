import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ActivitiesTabs({
    selectedActivity,
    onSelectActivity,
}: {
    selectedActivity: string
    onSelectActivity: (activity: string) => void
}) {
  return (
    <Tabs value={selectedActivity} onValueChange={onSelectActivity}>
      <TabsList variant="line" className="!w-full">
        <TabsTrigger value="skiing" className="grow !text-white">
          Skiing
        </TabsTrigger>
        <TabsTrigger value="surfing" className="grow !text-white">
          Surfing
        </TabsTrigger>
        <TabsTrigger value="outdoor_sightseeing" className="grow !text-white">
          Outdoor Sightseeing
        </TabsTrigger>
        <TabsTrigger value="indoor_sightseeing" className="grow !text-white">
          Indoor Sightseeing
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
