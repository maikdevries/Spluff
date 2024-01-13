import { Router } from 'express';
import { getPlaylists } from '../controllers/spotify.mjs';
import { handleFetchError } from '../controllers/utils.mjs';

const router = Router();
export default router;

router.use('/auth', (await import('./auth.mjs')).default);
router.use('/api/v1', (await import('./api.mjs')).default);

router.use('/', (req, res, next) => {
	// NOTE: Expose session information to template rendering engine
	res.locals = {
		session: {
			user: req.session.user ?? null,
		},
	}

	return next();
});

router.get('/', (req, res, next) => {
	return res.render('index');
});

router.use('/playlists', (req, res, next) => {
	// NOTE: If session-stored authorisation is missing, re-prompt user for authentication
	if (!req.session.auth?.token || !req.session.auth?.refreshToken) return res.redirect('/auth');

	// NOTE: If session-stored authorisation has expired, automatically refresh authorisation
	if (req.session.auth?.expires < Date.now()) return res.redirect('/auth/refresh');

	return next();
});

router.get('/playlists', async (req, res, next) => {
	try {
		return res.render('playlists', {
			playlists: await getPlaylists(req.session),
		});
	} catch (error) { return handleFetchError(error, req, res, next) }
});

router.get('/csrf', (req, res, next) => {
	return res.send('NOT IMPLEMENTED: /csrf GET');
});
