import 'dotenv/config'

import Express from 'express';
import session from 'express-session';
import memoryStore from 'memorystore';
import nunjucks from 'nunjucks';

import packageData from './package.json' with { 'type': 'json' };

const app = Express();
const MemoryStore = memoryStore(session);

nunjucks.configure('views', {
	express: app,
});

app.set('view engine', 'njk');

app.use(session({
	cookie: {
		'maxAge': 86400000,
		'sameSite': 'lax',
		'secure': true,
	},
	'name': 'sessionID',
	'proxy': true,
	'resave': false,
	'saveUninitialized': false,
	'secret': process.env.SESSION_SECRET,
	store: new MemoryStore({
		'checkPeriod': 86400000,
	}),
	'unset': 'destroy',
}));

app.use(Express.json());
app.use(Express.urlencoded({ 'extended': true }));

app.use('/', (req, res, next) => {
	// NOTE: Expose app information to template rendering engine
	app.locals = {
		app: {
			'copyright': (new Date()).getFullYear(),
			'version': packageData.version,
		},
	}

	return next();
});

app.use((error, req, res, next) => {
	console.error(error);
	return res.redirect('/error');
});

app.use((await import('./routes/router.mjs')).default);

app.listen(process.env.PORT, () => console.log('HTTP backend server successfully launched!'));
