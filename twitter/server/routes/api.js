const express = require('express')
const router = new express.Router()
const request = require('request')
var Twitter = require('twitter')

var client = new Twitter({
  consumer_key: 'OZ4Yfq5N7B9ppR08Gh8aBCvr6',	// insert consumer key here
  consumer_secret: 'bRK41hJbALk0zLetwfhm9hJ3fAEi2W7Ry6dxWDpG50MMNqsAHV', // insert consumer secret here
  access_token_key: '219482324-0k0QAtiSzSUEFjDoc0s3uyVPdUFbJaVr7H2fDw7s', // insert access token here
  access_token_secret: 'ho2zdOYI4yeqzyJeuh5sqS1khT8TPdhswUv4IZujDzfeX' // insert access token secret here
})

router.get('/search_tweets/:query', (req, res) => {
	// [ Insert code to call the Twitter API here ]
	client.get('search/tweets', {q: req.params.query}, function(err, tweets, response) {
	if (err) {
		console.log(err)
		return res.send(err)
	}
	return res.json({ data: tweets })
})
})

module.exports = router