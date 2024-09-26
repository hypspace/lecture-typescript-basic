interface Country {
  Country: string
  CountryCode: string
  Date: string
  NewConfirmed: number
  NewDeaths: number
  NewRecovered: number
  Premium: any
  Slug: string
  TotalConfirmed: number
  TotalDeaths: number
  TotalRecovered: number
}

interface Global {
  NewConfirmed: number
  NewDeaths: number
  NewRecovered: number
  TotalConfirmed: number
  TotalDeaths: number
  TotalRecovered: number
}

export interface CovidSummaryResponse {
  Countries: Country[]
  Date: string
  Global: Global
  Message: string
}
