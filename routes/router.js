const router = require('express').Router();

const authRouter = require('./auth.js');

module.exports = router;

router.use('/auth', authRouter);

router.get('/', (req, res, next) => {
	res.send('NOT IMPLEMENTED: / GET');
});

router.get('/csrf', (req, res, next) => {
	res.send('NOT IMPLEMENTED: /csrf GET');
});

router.get('/error', (req, res, next) => {
	res.send('NOT IMPLEMENTED: /error GET');
});
