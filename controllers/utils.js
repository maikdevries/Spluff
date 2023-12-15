module.exports = {
	shuffle, fetchJSON,
}

// NOTE: Durstenfeld variant of the Fisher-Yates shuffle algorithm
function shuffle (array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));

		[array[i], array[j]] = [array[j], array[i]];
	}

	return array;
}

async function fetchJSON (method, url, headers, body) {
	const response = await fetch(url, {
		'method': method,
		headers: headers,
		...(body && { body: body }),
	});

	return response.ok
		? await response.json()
		: (() => { throw new Error(`Fetching Spotify Web API failed with status ${response.status}. URL: ${response.url}`) })();
}
