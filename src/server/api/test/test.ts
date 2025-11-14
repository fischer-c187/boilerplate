import { Hono } from 'hono'

const testApi = new Hono()

testApi.get('/test', (c) => {
  return c.json({ message: 'Hello, world!' })
})

export default testApi
