export type Location = {
  name: string
  latitude: number
  longitude: number
  country?: string
  country_code?: string
  admin1?: string
}

export type LocationCoordinatesQuery = {
  locationCoordinates: {
    results: Location[]
  }
}
