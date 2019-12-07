const router = require('express').Router();
const {configureCA, getCAPublicKey, configureMachine, generateKey} = require('./controllers');

router.post('/:engine_name/ca', configureCA);
router.get('/:engine_name/ca/public_key', getCAPublicKey);
router.post('/:engine_name/machines', configureMachine);
router.post('/:engine_name/generate_key', generateKey);
module.exports = router;