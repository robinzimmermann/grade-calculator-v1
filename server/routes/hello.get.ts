import type { Hello } from '../models'

export default defineEventHandler((_event) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(<Hello>{
        hello: 'worldA',
      })
    }, 3000)
  })
})
