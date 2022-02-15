
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.json({
      message: "home page"
  })
})
app.about('/about', (req, res) => {
  res.json({
      message: "about page"
  })
})
app.get('/contact-us', (req, res) => {
  res.json({
      message: "contact-us"
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
