const router = require('express').Router();

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
	res.send(`NOT IMPLEMENTED: API /playlists/${req.params.playlistID}/shuffle GET`);
});
