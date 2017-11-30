client.get('search/tweets', {q: req.params.query}, function(err, tweets, response) {
	if (err) {
		console.log(err)
		return res.send(err)
	}
	return res.json({ data: tweets })
})