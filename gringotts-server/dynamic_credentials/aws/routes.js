const router = require('express').Router();
const { configureAWSEngine, addNewRole, genNewUser } = require('./controller');

router.post('/:engine_name/config', configureAWSEngine);
router.post('/:engine_name/add_new_role', addNewRole);
router.get('/:engine_name/:role_name/user', genNewUser);

module.exports = router;