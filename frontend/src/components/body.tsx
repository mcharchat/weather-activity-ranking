import type { Location } from "@/types/location-types"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { gql } from "@apollo/client"
import { useQuery } from "@apollo/client/react"
import type { CoordinatesActivityRankingQuery } from "@/types/activity-ranking-types"

const gqlQuery = gql`
  query CoordinatesActivityRankingQuery($latitude: Float!, $longitude: Float!) {
    coordinatesActivityRanking(latitude: $latitude, longitude: $longitude) {
      latitude
      longitude
      dailyRankings {
        date
        activities {
          activity
          score
        }
      }
    }
  }
`
export function Body({
  selectedLocation,
  selectedActivity,
}: {
  selectedLocation: Location | null
  selectedActivity: string
}) {
  const { data, loading, error } = useQuery<CoordinatesActivityRankingQuery>(
    gqlQuery,
    {
      variables: {
        latitude: selectedLocation?.latitude,
        longitude: selectedLocation?.longitude,
      },
      skip:
        !selectedLocation ||
        selectedLocation.latitude == null ||
        selectedLocation.longitude == null,
    }
  )

  const rankings = data?.coordinatesActivityRanking?.dailyRankings ?? []

  if (error) {
    console.error("Error fetching locations:", error)
  }

  return (
    <>
      {!selectedLocation ? (
        <div className="flex h-[calc(100vh-17rem)] w-full items-center justify-center">
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No Location Selected</EmptyTitle>
              <EmptyDescription>
                Please select a location to see the weather activity ranking.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      ) : (
        <>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="flex flex-col items-center justify-center divide-y px-4">
              {rankings.map((ranking) => {
                const activityScore =
                  ranking.activities.find(
                    (activity) =>
                      activity.activity === selectedActivity.toUpperCase()
                  )?.score ?? 0
                return (
                  <div key={ranking.date} className="w-full py-4">
                    <div className="flex justify-between">
                      <div>{new Date(ranking.date).toLocaleDateString()}</div>
                      <div>{activityScore.toFixed(2)}/10</div>
                    </div>
                    <div>
                      {activityScore > 6
                        ? "This day is good for " +
                          selectedActivity.replace(/_/g, " ").toLowerCase()
                        : "This day is not ideal for " +
                          selectedActivity.replace(/_/g, " ").toLowerCase()}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </>
  )
}
