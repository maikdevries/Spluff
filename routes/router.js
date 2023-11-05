const router = require('express').Router();

module.exports = router;

router.get('/', (req, res, next) => {
	res.send('NOT IMPLEMENTED: / GET');
});

router.get('/error', (req, res, next) => {
	res.send('NOT IMPLEMENTED: /error GET');
});
