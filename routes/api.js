const router = require('express').Router();
const { shuffle } = require('../controllers/algorithms.js');
const { addPlaylistItems, deletePlaylistItems, getPlaylistImage, getPlaylistItems } = require('../controllers/spotify.js');

module.exports = router;

router.use('/', (req, res, next) => {
	// NOTE: If session-stored authorisation is missing, deny request and return 'UNAUTHORISED' status
	if (!req.session.auth?.token || !req.session.auth?.refreshToken) return res.status(401).json({
		'error': 'This request lacks proper authentication',
	});

	// NOTE: If session-stored authorisation has expired, deny request and return 'UNAUTHORISED' status
	if (req.session.auth?.expires < Date.now()) return res.status(401).json({
		'error': 'This request lacks up-to-date authentication',
	});

	return next();
});

router.get('/playlists/:playlistID/shuffle', async (req, res, next) => {
	try {
		const items = await getPlaylistItems(req.session, req.params.playlistID);

		// NOTE: If there are no items to process, return early with 'NO CONTENT' status
		if (!items.length) return res.status(204).json({ 'description': 'This request resulted in no content changes' });

		// NOTE: Remove all items from original playlist so they can be re-added in shuffled order
		await deletePlaylistItems(req.session, req.params.playlistID, items);

		// NOTE: Re-add all items to original playlist in shuffled order
		await addPlaylistItems(req.session, req.params.playlistID, shuffle(items.map((x) => x.uri)));

		return res.json({ 'description': 'This request was completed successfully' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ 'error': 'Something went terribly wrong on our side of the internet' });
	}
});

router.get('/playlists/:playlistID/image', async (req, res, next) => {
	try {
		return res.json(await getPlaylistImage(req.session, req.params.playlistID));
	} catch (error) {
		console.error(error);
		return res.status(500).json({ 'error': 'Something went terribly wrong on our side of the internet' });
	}
});
