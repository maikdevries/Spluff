const router = require('express').Router();
const { getUser } = require('../controllers/spotify.js');

module.exports = router;

router.use('/auth', require('./auth.js'));
router.use('/api/v1', require('./api.js'));

router.get('/', (req, res, next) => {
	res.send('NOT IMPLEMENTED: / GET');
});

router.use('/playlists', async (req, res, next) => {
	// NOTE: If session-stored authorisation is missing, re-prompt user for authentication
	if (!req.session.auth?.token || !req.session.auth?.refreshToken) return res.redirect('/auth');

	// NOTE: If session-stored authorisation has expired, automatically refresh authorisation
	if (req.session.auth?.expires < Date.now()) return res.redirect('/auth/refresh');

	// NOTE: If session-stored 'user' is missing, automatically fetch user data
	if (!req.session.user) Object.assign(req.session, { user: await getUser(req.session) });

	return next();
});

router.get('/playlists', async (req, res, next) => {
	res.send('NOT IMPLEMENTED: /playlists GET');
});

router.get('/csrf', (req, res, next) => {
	res.send('NOT IMPLEMENTED: /csrf GET');
});

router.get('/error', (req, res, next) => {
	res.send('NOT IMPLEMENTED: /error GET');
});
