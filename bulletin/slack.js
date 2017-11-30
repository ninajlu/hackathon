function sendToSlack(source, articleTitle, articleText, articleUrl, articleUrlToImage) {
	var payload = {
		"attachments": [{
			"fallback": articleTitle,
			"color": "#36a64f",
			"author_name": source,
			"title": articleTitle,
			"title_link": articleUrl,
			"text": articleText,
			"image_url": articleUrlToImage
		}]
	}

	// paste your Slack webhook URL into the quotes below
	var url = ''

	$.post(url, {
		payload: JSON.stringify(payload),
	}, function(data){
        alert("Sent to Slack!")
	})
}