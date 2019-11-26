const router = require('express').Router();
const awsRoutes = require('./aws/routes');


router.use('/aws', awsRoutes);

module.exports = router;