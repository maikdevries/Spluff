require('dotenv').config();

const Express = require('express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const nunjucks = require('nunjucks');

const app = Express();

nunjucks.configure(`${__dirname}/views`, {
	express: app,
});

app.set('view engine', 'njk');

app.use(session({
	cookie: {
		'maxAge': 86400000,
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
}));

app.use(Express.json());
app.use(Express.urlencoded({ 'extended': true }));

app.use('/', (req, res, next) => {
	// NOTE: Expose app information to template rendering engine
	app.locals = {
		app: {
			'copyright': (new Date()).getFullYear(),
			'version': require('./package.json').version,
		},
	}

	return next();
});

app.use((error, req, res, next) => {
	console.error(error.toString());

	return res.redirect('/error');
});

app.use(require('./routes/router.js'));

app.listen(process.env.PORT, () => console.log('HTTP backend server successfully launched!'));
