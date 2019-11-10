const router = require('express').Router();
const { addCustomCategory, deleteCategory,
    createCreds, removeCreds, getCreds } = require('./controllers/engine');

// router.get('/engines', );
// router.get('/engines/:cred_engine_type/types', );
router.post('/category/:engineName', addCustomCategory);
router.delete('/category/:engineName', deleteCategory);

router.delete('/secret/:engineName/:categoryName',(req, res, next) => {
    console.log(req.user);
    console.log('hi');
    next();
} ,removeCreds)
router.post('/secret/:engineName/:categoryName', createCreds)
router.get('/secret/:engineName/:categoryName', getCreds);

module.exports = router;