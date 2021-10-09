const Express = require('express')
const app = Express()
app.use(Express.static('./dist'))
app.listen(process.env.PORT || 8001, () => {
  console.log("server started")
})
