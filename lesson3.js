const express = require('express')
const superagent = require('superagent')
const cheerio = require('cheerio')

const app = express()

app.get('/', function (req, res, next) {
  superagent.get('https://cnodejs.org')
    .end(function (err, sres) {
      if (err) return next(err)
      const $ = cheerio.load(sres.text)
      const item = []
      // $('#topic_list .topic_title').each((index, val) => {
      //   const $ele = $(val)
      //   item.push({
      //     title: $ele.attr('title'),
      //     href: $ele.attr('href')
      //   })
      // })
      $('#topic_list .cell').each((index, val) => {
        var user = $(val).find('.user_avatar img')
        var topic = $(val).find('.topic_title')
        item.push({
          title: topic.attr('title'),
          href: topic.attr('href'),
          author: user.attr('title')
        })
      })

      res.send(item)
    })
})

app.listen(3000, () => console.log(123))