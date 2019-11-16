const router = require('express').Router();

const { configureAWSEngine,add_new_role,gen_new_user } = require('./controller');
router.post('/:engine_name/config', configureAWSEngine);
router.post('/:engine_name/add_new_role', add_new_role);
router.post('/:engine_name/:role_name/user', gen_new_user);
module.exports = router;