import { Router } from 'express';
import { shuffle } from '../controllers/utils.mjs';
import { addPlaylistItems, deletePlaylistItems, getPlaylistImage, getPlaylistItems } from '../controllers/spotify.mjs';

const router = Router();
export default router;

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

router.post('/playlists/shuffle', async (req, res, next) => {
	try {
		// NOTE: Retrieve playlist items from cache if available (whenever an error was thrown previously)
		const items = req.session.cache?.[req.body.id] ?? await getPlaylistItems(req.session, req.body.id);

		// NOTE: If there are no items to process, return early with explanatory body
		if (!items.length) return res.json({ 'description': 'This request resulted in no content changes' });

		// NOTE: Create cache entry for current playlist (avoid loss of data when error is thrown hereafter)
		if (!req.session.cache?.[req.body.id]) {
			Object.assign(req.session, {
				cache: {
					...req.session.cache,
					[req.body.id]: items,
				},
			});
		}

		// NOTE: Remove all items from original playlist so they can be re-added in shuffled order
		await deletePlaylistItems(req.session, req.body.id, items);

		// NOTE: Re-add all items to original playlist in shuffled order
		await addPlaylistItems(req.session, req.body.id, shuffle(items.map((x) => x.uri)));

		// NOTE: When successful, clear cache of current playlist
		delete req.session.cache[req.body.id];

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
