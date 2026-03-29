import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import type { Location, LocationCoordinatesQuery } from "@/types/location-types"
import { gql } from "@apollo/client"
import { useQuery } from "@apollo/client/react"
import { useState } from "react"

const gqlQuery = gql`
  query LocationCoordinatesQuery($location: String!) {
    locationCoordinates(location: $location) {
      results {
        admin1
        country_code
        country
        latitude
        longitude
        name
      }
    }
  }
`
export function LocationCombobox({
  onSelectLocation,
}: {
  onSelectLocation: (location: Location | null) => void
}) {
  const [query, setQuery] = useState("")

  const { data, loading, error } = useQuery<LocationCoordinatesQuery>(
    gqlQuery,
    {
      variables: { location: query },
      skip: query.length < 3,
    }
  )

  const locations = data?.locationCoordinates?.results ?? []

  if (error) {
    console.error("Error fetching locations:", error)
  }

  const fetchLocations = async (query: string) => {
    if (query.length < 3) {
      setQuery("")
      return
    }
    setQuery(query)
  }

  return (
    <Combobox
      items={locations}
      itemToStringValue={(location: Location) => location.name}
      onInputValueChange={(value) => {
        if (typeof value === "string") {
          fetchLocations(value)
        }
      }}
    >
      <ComboboxInput
        placeholder="Select a location"
        className="bg-white text-black"
      />
      <ComboboxContent>
        {loading ? (
          <ComboboxEmpty>Loading locations...</ComboboxEmpty>
        ) : (
          <ComboboxEmpty>No locations found.</ComboboxEmpty>
        )}
        <ComboboxList>
          {locations.map((location: Location, index: number) => (
            <ComboboxItem
              key={index}
              value={location.name}
              onClick={() => onSelectLocation(location)}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center">
                  <img
                    src={`https://open-meteo.com/images/country-flags/${location.country_code?.toLowerCase()}.svg`}
                    alt={location.country_code}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-lg font-medium">{location.name}</div>
                  <div>
                    {location.admin1}, {location.country} (
                    {location.latitude.toFixed(2)}°N{" "}
                    {location.longitude.toFixed(2)}°E)
                  </div>
                </div>
              </div>
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
