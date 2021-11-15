const Express = require('express')
const app = Express()
app.use(Express.static('./dist'))

const GOOGLE_MAPS_API_KEY = "AIzaSyB_f_Qob99lQF5rN-kqxh0QVx1b5tJrxVE"
app.get('/api-key', (req, res)=>{
  res.send(GOOGLE_MAPS_API_KEY)
})

app.listen(process.env.PORT || 8001, () => {
  console.log("server started")
})
