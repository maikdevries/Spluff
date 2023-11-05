module.exports = {
	getUser, getPlaylists,
}

async function getUser (session) {
	const userData = await getFetch('me', session.auth);

	return {
		'displayName': userData.display_name,
		'id': userData.id,
	}
}

async function getPlaylists (session, offset = 0) {
	const params = {
		'limit': 50,
		'offset': offset,
	}

	const playlistData = await getFetch(`me/playlists?${new URLSearchParams(params).toString()}`, session.auth);
	const filteredEntries = playlistData.items.filter((x) => x.owner.id === session.user.id);

	// NOTE: If data remains to be fetched, recursively fetch and append until all user's playlists have been fetched
	if (playlistData.next) filteredEntries.push(...await getPlaylists(session, (params.limit + params.offset)));

	return filteredEntries;
}

async function getFetch (endpoint, auth) {
	const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
		method: 'GET',
		headers: { 'Authorization': `Bearer ${auth.token}` },
	});

	return response.ok
		? await response.json()
		: (() => { throw new Error(`Fetching Spotify Web API failed with status ${response.status}. URL: ${response.url}`)	})();
}
