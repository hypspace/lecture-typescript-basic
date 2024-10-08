import {
  Country,
  CountrySummaryInfo,
  CountrySummaryResponse,
  CovidSummaryResponse,
} from './covid/index'
import axios, { AxiosResponse } from 'axios'
import { Chart } from 'chart.js'

// utils
function $<T extends HTMLElement>(selector: string) {
  const element = document.querySelector(selector)
  return element as T
}
function getUnixTimestamp(date: Date | string) {
  return new Date(date).getTime()
}

// DOM
const confirmedTotal = $<HTMLSpanElement>('.confirmed-total')
const deathsTotal = $<HTMLParagraphElement>('.deaths')
const recoveredTotal = $<HTMLParagraphElement>('.recovered')
const lastUpdatedTime = $<HTMLParagraphElement>('.last-updated-time')
const rankList = $<HTMLOListElement>('.rank-list')
const deathsList = $<HTMLOListElement>('.deaths-list')
const recoveredList = $<HTMLOListElement>('.recovered-list')
const deathSpinner = createSpinnerElement('deaths-spinner')
const recoveredSpinner = createSpinnerElement('recovered-spinner')

function createSpinnerElement(id: string) {
  const wrapperDiv = document.createElement('div')
  wrapperDiv.setAttribute('id', id)
  wrapperDiv.setAttribute(
    'class',
    'spinner-wrapper flex justify-center align-center'
  )
  const spinnerDiv = document.createElement('div')
  spinnerDiv.setAttribute('class', 'ripple-spinner')
  spinnerDiv.appendChild(document.createElement('div'))
  spinnerDiv.appendChild(document.createElement('div'))
  wrapperDiv.appendChild(spinnerDiv)
  return wrapperDiv
}

// state
let isDeathLoading = false
const isRecoveredLoading = false

function fetchCovidSummary(): Promise<AxiosResponse<CovidSummaryResponse>> {
  const url = 'https://ts-covid-api.vercel.app/api/summary'
  return axios.get(url)
}

enum CovidStatus {
  Confirmed = 'confirmed',
  Recovered = 'recovered',
  Deaths = 'deaths',
}

function fetchCountryInfo(
  countryName: string,
  status: CovidStatus
): Promise<AxiosResponse<CountrySummaryInfo>> {
  // status params: confirmed, recovered, deaths
  const url = `https://ts-covid-api.vercel.app/api/country/${countryName}/status/${status}`
  return axios.get(url)
}

// methods
function startApp() {
  setupData()
  initEvents()
}

// events
function initEvents() {
  rankList.addEventListener('click', handleListClick)
}

async function handleListClick(event: Event) {
  let selectedId
  if (
    event.target instanceof HTMLParagraphElement ||
    event.target instanceof HTMLSpanElement
  ) {
    selectedId = event.target.parentElement
      ? event.target.parentElement.id
      : undefined
  }
  if (event.target instanceof HTMLLIElement) {
    selectedId = event.target.id
  }
  if (isDeathLoading) {
    return
  }
  clearDeathList()
  clearRecoveredList()
  startLoadingAnimation()
  isDeathLoading = true

  console.log({ selectedId })

  /**
   * NOTE: 코로나 종식으로 오픈 API 지원이 끝나서 death, recover 데이터는 지원되지 않습니다.
   *       그리고 국가별 상세 정보는 "스페인"과 "스위스"만 지원됩니다.
   */
  // const { data: deathResponse } = await fetchCountryInfo(selectedId, 'deaths');
  // const { data: recoveredResponse } = await fetchCountryInfo(
  //   selectedId,
  //   'recovered',
  // );
  const { data: confirmedResponse } = await fetchCountryInfo(
    selectedId,
    CovidStatus.Confirmed
  )
  endLoadingAnimation()
  // NOTE: 코로나 종식으로 오픈 API 지원이 끝나서 death, recover 데이터는 지원되지 않습니다.
  // setDeathsList(deathResponse);
  // setTotalDeathsByCountry(deathResponse);
  // setRecoveredList(recoveredResponse);
  // setTotalRecoveredByCountry(recoveredResponse);
  setChartData(confirmedResponse)
  isDeathLoading = false
}

function setDeathsList(data: CountrySummaryResponse) {
  const sorted = data.sort(
    (a: CountrySummaryInfo, b: CountrySummaryInfo) =>
      getUnixTimestamp(b.Date) - getUnixTimestamp(a.Date)
  )
  sorted.forEach((value: CountrySummaryInfo) => {
    const li = document.createElement('li')
    li.setAttribute('class', 'list-item-b flex align-center')
    const span = document.createElement('span')
    span.textContent = value.Cases.toString()
    span.setAttribute('class', 'deaths')
    const p = document.createElement('p')
    p.textContent = new Date(value.Date).toLocaleDateString().slice(0, -1)
    li.appendChild(span)
    li.appendChild(p)
    deathsList.appendChild(li)
  })
}

function clearDeathList() {
  if (!deathsList) {
    return
  }
  deathsList.innerHTML = null
}

function setTotalDeathsByCountry(data: CountrySummaryResponse) {
  deathsTotal.innerText = data[0].Cases.toString()
}

function setRecoveredList(data: CountrySummaryResponse) {
  const sorted = data.sort(
    (a: CountrySummaryInfo, b: CountrySummaryInfo) =>
      getUnixTimestamp(b.Date) - getUnixTimestamp(a.Date)
  )
  sorted.forEach((value: CountrySummaryInfo) => {
    const li = document.createElement('li')
    li.setAttribute('class', 'list-item-b flex align-center')
    const span = document.createElement('span')
    span.textContent = value.Cases.toString()
    span.setAttribute('class', 'recovered')
    const p = document.createElement('p')
    p.textContent = new Date(value.Date).toLocaleDateString().slice(0, -1)
    li.appendChild(span)
    li.appendChild(p)
    recoveredList?.appendChild(li)
    if (recoveredList === null || recoveredList === undefined) {
      return
    } else {
      recoveredList.appendChild(li)
    }

    /**
     * 참고 recoveredList.appendChild(li)에서 생성되는 TS에러는 다음과 같이 해결할 수 있습니다.
     *  타입 단언으로 해결하면 사이드 이펙트가 발생하기에 아래와 같은 방법으로 해결합니다.
     *  이는 recoveredList!.appendChild(li)와 같은 코드 작성을 의미합니다.
     
     * - if문: if (recoveredList === null || recoveredList === undefined) { return } else { recoveredList.appendChild(li) }
     * - 옵셔널 체이닝(?.) 오퍼레이터: recoveredList?.appendChild(li)
     * - 논리 AND(&&): recoveredList && recoveredList.appendChild(li)
     * - 3항(ternary) 연산자: recoveredList ? recoveredList.appendChild(li) : undefined
     */
  })
}

function clearRecoveredList() {
  recoveredList.innerHTML = ''
}

function setTotalRecoveredByCountry(data: CountrySummaryResponse) {
  recoveredTotal.innerText = data[0].Cases.toString()
}

function startLoadingAnimation() {
  deathsList.appendChild(deathSpinner)
  recoveredList.appendChild(recoveredSpinner)
}

function endLoadingAnimation() {
  deathsList.removeChild(deathSpinner)
  recoveredList.removeChild(recoveredSpinner)
}

async function setupData() {
  const { data } = await fetchCovidSummary()
  setTotalConfirmedNumber(data)
  setTotalDeathsByWorld(data)
  setTotalRecoveredByWorld(data)
  setCountryRanksByConfirmedCases(data)
  setLastUpdatedTimestamp(data)
}

function renderChart(data: number, labels: string[]) {
  const lineChart = $('#lineChart') as HTMLCanvasElement // 지역 변수화 시키지 않고 인라인으로 작성해도 됩니다.
  const ctx = lineChart.getContext('2d') //
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Confirmed for the last two weeks',
          backgroundColor: '#feb72b',
          borderColor: '#feb72b',
          data,
        },
      ],
    },
    options: {},
  })
}

function setChartData(data: CountrySummaryResponse) {
  const chartData = data
    .slice(-14)
    .map((value: CountrySummaryInfo) => value.Cases)
  const chartLabel = data
    .slice(-14)
    .map((value: CountrySummaryInfo) =>
      new Date(value.Date).toLocaleDateString().slice(5, -1)
    )
  renderChart(chartData, chartLabel)
}

function setTotalConfirmedNumber(data: CovidSummaryResponse) {
  confirmedTotal.innerText = data.Countries.reduce(
    (total: number, current: Country) => (total += current.TotalConfirmed),
    0
  ).toString()
}

function setTotalDeathsByWorld(data: CovidSummaryResponse) {
  deathsTotal.innerText = data.Countries.reduce(
    (total: number, current: Country) => (total += current.TotalDeaths),
    0
  ).toString()
}

function setTotalRecoveredByWorld(data: CovidSummaryResponse) {
  recoveredTotal.innerText = data.Countries.reduce(
    (total: number, current: Country) => (total += current.TotalRecovered),
    0
  ).toString()
}

function setCountryRanksByConfirmedCases(data: CovidSummaryResponse) {
  const sorted = data.Countries.sort(
    (a: Country, b: Country) => b.TotalConfirmed - a.TotalConfirmed
  )
  sorted.forEach((value: Country) => {
    const li = document.createElement('li')
    li.setAttribute('class', 'list-item flex align-center')
    li.setAttribute('id', value.Slug)
    const span = document.createElement('span')
    span.textContent = value.TotalConfirmed.toString()
    span.setAttribute('class', 'cases')
    const p = document.createElement('p')
    p.setAttribute('class', 'country')
    p.textContent = value.Country
    li.appendChild(span)
    li.appendChild(p)
    rankList.appendChild(li)
  })
}

function setLastUpdatedTimestamp(data: CovidSummaryResponse) {
  lastUpdatedTime.innerText = new Date(data.Date).toLocaleString()
}

startApp()
