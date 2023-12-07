module.exports = {
	getUser, getPlaylists, getPlaylistItems, addPlaylistItems, deletePlaylistItems, getPlaylistImage,
}

async function getUser (session) {
	const userData = await getFetch('me', session.auth);

	return {
		'name': userData.display_name,
		'url': userData.external_urls.spotify,
		'id': userData.id,
		image: {
			'url': userData.images[0].url,
			'size': userData.images[0].width,
		},
	}
}

async function getPlaylists (session, offset = 0) {
	const params = {
		'limit': 50,
		'offset': offset,
	}

	const playlistData = await getFetch(`me/playlists?${new URLSearchParams(params).toString()}`, session.auth);

	// NOTE: Filter out any non-user-owned playlists and map to only return used playlist fields
	const filteredEntries = playlistData.items.flatMap((x) => {
		return x.owner.id !== session.user.id
			? []
			: {
				'name': x.name,
				'description': x.description,
				'url': x.external_urls.spotify,
				'id': x.id,
				image: {
					'url': x.images[x.images.length - 1].url,
					'size': x.images[x.images.length - 1].width,
				},
			}
	});

	// NOTE: If data remains to be fetched, recursively fetch and append until all user's playlists have been fetched
	if (playlistData.next) filteredEntries.push(...await getPlaylists(session, (params.limit + params.offset)));

	return filteredEntries;
}

async function getPlaylistItems (session, playlistID, offset = 0) {
	const params = {
		'fields': 'next, items.track.uri',
		'limit': 50,
		'offset': offset,
	}

	const itemsData = await getFetch(`playlists/${playlistID}/tracks?${new URLSearchParams(params).toString()}`, session.auth);

	// NOTE: Filter out any local files as the API does not (fully) support operations on local files
	const allItems = itemsData.items.flatMap((x) => x.track.is_local ? [] : [x.track]);

	// NOTE: If data remains to be fetched, recursively fetch and append until all playlist items have been fetched
	if (itemsData.next) allItems.push(...await getPlaylistItems(session, playlistID, (params.limit + params.offset)));

	return allItems;
}

async function addPlaylistItems (session, playlistID, items) {
	const snapshotID = await postFetch(`playlists/${playlistID}/tracks`, session.auth, {
		uris: items.slice(0, 100),
	});

	// NOTE: If items remain to be added, recursively create requests until all playlist items have been added
	if (items.length > 100) return await addPlaylistItems(session, playlistID, items.slice(100, items.length))
	else return snapshotID;
}

async function deletePlaylistItems (session, playlistID, items) {
	const snapshotID = await deleteFetch(`playlists/${playlistID}/tracks`, session.auth, {
		tracks: items.slice(0, 100),
	});

	// NOTE: If items remain to be deleted, recursively create requests until all playlist items have been deleted
	if (items.length > 100) return await deletePlaylistItems(session, playlistID, items.slice(100, items.length))
	else return snapshotID;
}

async function getPlaylistImage (session, playlistID) {
	const imageData = await getFetch(`playlists/${playlistID}/images`, session.auth);

	return {
		'url': imageData[imageData.length - 1].url,
		'size': imageData[imageData.length - 1].width,
	}
}

async function getFetch (endpoint, auth) {
	const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
		'method': 'GET',
		headers: { 'Authorization': `Bearer ${auth.token}` },
	});

	return response.ok
		? await response.json()
		: (() => { throw new Error(`Fetching Spotify Web API failed with status ${response.status}. URL: ${response.url}`) })();
}

async function postFetch (endpoint, auth, data) {
	const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
		'method': 'POST',
		headers: {
			'Authorization': `Bearer ${auth.token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	return response.ok
		? await response.json()
		: (() => { throw new Error(`Fetching Spotify Web API failed with status ${response.status}. URL: ${response.url}`) })();
}

async function deleteFetch (endpoint, auth, data) {
	const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
		'method': 'DELETE',
		headers: {
			'Authorization': `Bearer ${auth.token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	return response.ok
		? await response.json()
		: (() => { throw new Error(`Fetching Spotify Web API failed with status ${response.status}. URL: ${response.url}`) })();
}
