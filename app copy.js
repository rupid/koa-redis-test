const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const Koa = require('koa')
const app = new Koa()

app.keys = ['keys', 'keykeys']
app.use(session({
  store: redisStore({
    host: process.env.REDIS_WEB_PORT_6379_TCP_ADDR || "127.0.0.1",
    port: 6379
  })
}))

app.use(function* () {
  switch (this.path) {
    case '/get':
      get.call(this)
      break
    case '/remove':
      remove.call(this)
      break
    case '/regenerate':
      yield regenerate.call(this)
      break
  }
})

function get () {
  const session = this.session
  session.count = session.count || 0
  session.count++
  this.body = session.count
}

function remove () {
  this.session = null
  this.body = 0
}

function* regenerate () {
  get.call(this)
  yield this.regenerateSession()
  get.call(this)
}

app.listen(8080)