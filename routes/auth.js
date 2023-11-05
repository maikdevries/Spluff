const router = require('express').Router();
const crypto = require('node:crypto');
const { getToken, refreshToken } = require('../controllers/auth.js');
const { getUser } = require('../controllers/spotify.js');

module.exports = router;

router.get('/', (req, res, next) => {
	// NOTE: Use 'base64url' over 'base64' to avoid possible URL parsing interpretation issues
	const state = crypto.randomBytes(64).toString('base64url');
	Object.assign(req.session, {
		auth: { 'state': state },
	});

	const params = {
		'client_id': process.env.CLIENT_ID,
		'response_type': 'code',
		'redirect_uri': process.env.REDIRECT_URL,
		'state': state,
		'scope': 'playlist-read-private playlist-modify-private playlist-modify-public',
	}

	return res.redirect(`https://accounts.spotify.com/authorize?${new URLSearchParams(params).toString()}`);
});

router.get('/login', async (req, res, next) => {
	// NOTE: If returned 'state' and session-stored 'state' mismatch, warn user of cross-site request forgery
	if (req.query.state !== req.session.auth?.state) return res.redirect('/csrf');

	// NOTE: If user did not authorise login, re-prompt user for authorisation
	if (!req.query.code) return res.redirect('/auth');

	try {
		const authData = await getToken(req.query.code);

		Object.assign(req.session, {
			auth: authData,
			user: await getUser({ auth: authData }),
		});

		return res.redirect('/playlists');
	} catch (error) { return next(error) }
});

router.get('/refresh', async (req, res, next) => {
	// NOTE: If session-stored 'refreshToken' is missing, user needs to be re-prompted for authorisation
	if (!req.session.auth?.refreshToken) return res.redirect('/auth');

	try {
		const authData = await refreshToken(req.session.auth.refreshToken);

		Object.assign(req.session, {
			auth: authData,
			user: await getUser({ auth: authData }),
		});

		// NOTE: Redirect user back to the actual route they requested
		return res.redirect('back');
	} catch (error) { return next(error) }
});

router.get('/logout', (req, res, next) => {
	req.session.destroy(() => res.redirect('/'));
});
