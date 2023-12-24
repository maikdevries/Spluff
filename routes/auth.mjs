import { Router } from 'express';
import crypto from 'node:crypto';
import { getToken, refreshToken } from '../controllers/auth.mjs';
import { getUser } from '../controllers/spotify.mjs';
import { handleFetchError } from '../controllers/utils.mjs';

const router = Router();
export default router;

router.get('/', (req, res, next) => {
	// NOTE: Use 'base64url' over 'base64' to avoid possible URL parsing interpretation issues
	const state = crypto.randomBytes(64).toString('base64url');

	// NOTE: The PKCE standard states a maximum length of 128 characters, therefore ((128 / 4) * 3) bytes required
	const codeVerifier = crypto.randomBytes(96).toString('base64url');
	const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest().toString('base64url');

	Object.assign(req.session, {
		auth: {
			'state': state,
			'codeVerifier': codeVerifier,
		},
	});

	const params = {
		'client_id': process.env.CLIENT_ID,
		'response_type': 'code',
		'redirect_uri': process.env.REDIRECT_URL,
		'state': state,
		'scope': 'playlist-read-private playlist-modify-private playlist-modify-public',
		'code_challenge_method': 'S256',
		'code_challenge': codeChallenge,
	}

	return res.redirect(`https://accounts.spotify.com/authorize?${new URLSearchParams(params).toString()}`);
});

router.get('/login', async (req, res, next) => {
	// NOTE: If returned 'state' and session-stored 'state' mismatch, warn user of cross-site request forgery
	if (req.query.state !== req.session.auth?.state) return res.redirect('/csrf');

	// NOTE: If user did not authorise login, redirect back to the page they were on
	if (!req.query.code) return res.redirect('back');

	try {
		const authData = await getToken(req.query.code, req.session.auth.codeVerifier);

		Object.assign(req.session, {
			auth: authData,
			user: await getUser({ auth: authData }),
		});

		return res.redirect('/playlists');
	} catch (error) { return handleFetchError(error, req, res, next) }
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
	} catch (error) { return handleFetchError(error, req, res, next) }
});

router.get('/logout', (req, res, next) => {
	return req.session.destroy(() => res.redirect('/'));
});
