import { fetchAPI, handleFetchError } from './utils.mjs';

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
		if (image) Object.assign(element, { 'src': image.url, 'width': image.size, 'height': image.size });

		doneElement.classList.remove('hidden');
	} catch (error) { handleFetchError(error, () => errorElement.classList.remove('hidden')) }

	progress.classList.add('hidden');
	shuffleButton.disabled = false;
}

async function getPlaylistImage (playlistID) {
	try {
		return await getAPI(`playlists/${playlistID}/image`);
	} catch (error) { handleFetchError(error) }
}

async function getAPI (endpoint) {
	return await fetchAPI(
		'GET',
		new URL(endpoint, new URL('api/v1/', document.location.origin)),
	);
}

async function postAPI (endpoint, data) {
	return await fetchAPI(
		'POST',
		new URL(endpoint, new URL('api/v1/', document.location.origin)),
		{
			'Content-Type': 'application/json',
		},
		JSON.stringify(data),
	);
}
