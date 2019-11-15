const router = require('express').Router();

const { configureAWSEngine } = require('./controller');
router.post('/:engine_name/configure/root', configureAWSEngine);

module.exports = router;