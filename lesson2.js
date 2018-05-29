const express = require('express')
const utility = require('utility')

const app = express()

app.get('/', (rqs, res) => {
  var q = rqs.query.q || 'a'
  console.log(q)
  const md5Value = utility.md5(q)
  res.send(md5Value)
})

app.listen('3000', (rqs, res) => console.log('app is running on port 3000'))