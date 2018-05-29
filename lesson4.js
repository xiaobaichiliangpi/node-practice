const express = require('express')
const superagent = require('superagent')
const cheerio = require('cheerio')
const url = require('url')
const eventproxy = require('eventproxy')

const codeUrl = 'https://cnodejs.org/'

const app = new express()

app.get('/', (req, ress, next) => {
superagent.get(codeUrl)
  .end((err, res) => {
    if (err) next(err)

    const $ = cheerio.load(res.text)
    const hrefArray = []
    $('#topic_list .topic_title').each((idx, ele) => {
      let $ele = $(ele)
      let href = url.resolve(codeUrl, $ele.attr('href'))
      hrefArray.push(href)
    })
    
    const ep = new eventproxy()

    ep.after('topic_html', 5, topics => {
      const result = topics.map(value => {
        let url = value[0]
        let $ = value[1]
        let $$ = cheerio.load(value[2])
        let $reply = $('.reply_item').eq(0)
        return {
          url,
          title: $('.topic_full_title').text().trim(),
          comment: $reply.find('.markdown-text p').text().trim(),
          author: $reply.find('.reply_author').text().trim(),
          point: $$('.user_card .board .big').text().trim()
        }
      })
      ress.send(result)
    })

    const topics = hrefArray.slice(0, 5)
    console.log(222, topics.length)
    topics.forEach((topicUrl, index) => {
      superagent.get(topicUrl)
        .end(function (serr, sres){
          if (serr) console.error(serr)
          let $ = cheerio.load(sres.text)
          let userUrl = $('.reply_item').eq(0).find('.user_avatar').attr('href') || ''
          let userInfoUrl = url.resolve(codeUrl, userUrl)
          superagent.get(userInfoUrl)
            .end((sserr, ssres) => {
              if (sserr) console.error(sserr)
              ep.emit('topic_html', [topicUrl, $, ssres.text])
            })
          // ep.emit('topic_html', [topicUrl, $])
        })
    })
  })
})

  app.listen(3000, () => console.log(123))
