export type ActivitiesScore = {
  activity: string
  score: number
}
export type DailyRanking = {
  date: string
  activities: ActivitiesScore[]
}

export type CoordinatesActivityRankingQuery = {
  coordinatesActivityRanking: {
    latitude: number
    longitude: number
    dailyRankings: DailyRanking[]
  }
}
