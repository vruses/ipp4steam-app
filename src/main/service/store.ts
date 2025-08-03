import ElectronStore from 'electron-store'

const schema = {
  expectedPrice: {
    type: 'number',
    maximum: 10000,
    minimum: 0,
    default: 1800
  },
  queryInterval: {
    type: 'number',
    maximum: 10e8,
    minimum: 0,
    default: 200
  }
}
const store = new ElectronStore({ schema })

export const getQueryIntreval = (): number => {
  return store.get('queryInterval', 200) as number
}
export const setQueryIntreval = (interval: number): void => {
  store.set('queryInterval', interval)
}

export const getPrice = (): number => {
  return store.get('expectedPrice', 1800) as number
}
export const setPrice = (price: number): void => {
  store.set('expectedPrice', price)
}
export const getMonitorConfig = (): {
  queryInterval: number
  expectedPrice: number
} => {
  return { queryInterval: getQueryIntreval(), expectedPrice: getPrice() }
}
