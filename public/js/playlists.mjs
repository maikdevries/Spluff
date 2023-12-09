document.getElementById('playlistContainer').addEventListener('click', (event) => shufflePlaylist(event), {
	'capture': true,
	'once': false,
	'passive': true,
});

async function shufflePlaylist (event) {
	const shuffleButton = event.target.closest('.shuffleButton');
	if (!shuffleButton) return;

	const playlist = shuffleButton.closest('.playlist');
	const [done, error] = playlist.querySelectorAll('.playlistActions > img');
	const [progress] = playlist.getElementsByTagName('progress');

	done.classList.add('hidden');
	error.classList.add('hidden');

	shuffleButton.disabled = true;
	progress.classList.remove('hidden');

	try {
		await postAPI('playlists/shuffle', {
			'id': playlist.dataset.id,
		});

		const image = await getPlaylistImage(playlist.dataset.id);
		const element = playlist.querySelector('.playlistData > img');

		// NOTE: Does NOT assign when 'image' is null (whenever an error was thrown)
		Object.assign(element, { 'src': image.url, 'width': image.size, 'height': image.size });

		done.classList.remove('hidden');
	} catch {
		error.classList.remove('hidden');
	}

	progress.classList.add('hidden');
	shuffleButton.disabled = false;
}

async function getPlaylistImage (playlistID) {
	try {
		return await getAPI(`playlists/${playlistID}/image`);
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function getAPI (endpoint) {
	const response = await fetch(`${document.location.origin}/api/v1/${endpoint}`, {
		'method': 'GET',
	});

	return response.ok
		? await response.json()
		: (() => { throw new Error(`GET API failed with status ${response.status}. URL: ${response.url}`) })();
}

async function postAPI (endpoint, data) {
	const response = await fetch(`${document.location.origin}/api/v1/${endpoint}`, {
		'method': 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	return response.ok
		? await response.json()
		: (() => { throw new Error(`POST API failed with status ${response.status}. URL: ${response.url}`) })();
}
