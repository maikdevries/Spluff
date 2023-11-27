const router = require('express').Router();

module.exports = router;

router.use('/auth', require('./auth.js'));
router.use('/api/v1', require('./api.js'));

router.use('/', (req, res, next) => {
	// NOTE: Expose session information to template rendering engine
	res.locals = {
		session: { user: req.session.user ?? null },
	}

	return next();
});

router.get('/', (req, res, next) => {
	return res.send('NOT IMPLEMENTED: / GET');
});

router.use('/playlists', (req, res, next) => {
	// NOTE: If session-stored authorisation is missing, re-prompt user for authentication
	if (!req.session.auth?.token || !req.session.auth?.refreshToken) return res.redirect('/auth');

	// NOTE: If session-stored authorisation has expired, automatically refresh authorisation
	if (req.session.auth?.expires < Date.now()) return res.redirect('/auth/refresh');

	return next();
});

router.get('/playlists', (req, res, next) => {
	return res.send('NOT IMPLEMENTED: /playlists GET');
});

router.get('/csrf', (req, res, next) => {
	return res.send('NOT IMPLEMENTED: /csrf GET');
});

router.get('/error', (req, res, next) => {
	return res.send('NOT IMPLEMENTED: /error GET');
});
