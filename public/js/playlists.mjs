import { fetchAPI } from './utils.mjs';

document.getElementById('playlistContainer').addEventListener('click', (event) => shufflePlaylist(event), {
	'capture': true,
	'once': false,
	'passive': true,
});

async function shufflePlaylist (event) {
	const shuffleButton = event.target.closest('.shuffleButton');
	if (!shuffleButton) return;

	const playlist = shuffleButton.closest('.playlist');
	const [doneElement, errorElement] = playlist.querySelectorAll('.playlistActions > img');
	const [progress] = playlist.getElementsByTagName('progress');

	doneElement.classList.add('hidden');
	errorElement.classList.add('hidden');

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

		doneElement.classList.remove('hidden');
	} catch (error) {
		// NOTE: If request has been refused due to invalid authorisation, user needs to be re-prompted for authorisation
		if (error instanceof FetchError && error.status === 401) return window.location.assign('/auth');

		console.error(error);
		errorElement.classList.remove('hidden');
	}

	progress.classList.add('hidden');
	shuffleButton.disabled = false;
}

async function getPlaylistImage (playlistID) {
	try {
		return await getAPI(`playlists/${playlistID}/image`);
	} catch (error) {
		// NOTE: If request has been refused due to invalid authorisation, user needs to be re-prompted for authorisation
		if (error instanceof FetchError && error.status === 401) return window.location.assign('/auth');

		console.error(error);
		return null;
	}
}

async function getAPI (endpoint) {
	return await fetchAPI(
		'GET',
		`${document.location.origin}/api/v1/${endpoint}`,
		null,
		null,
	);
}

async function postAPI (endpoint, data) {
	return await fetchAPI(
		'POST',
		`${document.location.origin}/api/v1/${endpoint}`,
		{
			'Content-Type': 'application/json',
		},
		JSON.stringify(data),
	);
}
