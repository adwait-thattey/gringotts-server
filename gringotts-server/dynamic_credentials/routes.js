const router = require('express').Router();

const awsRoutes = require('./aws/routes');

app.use('/aws',awsRoutes);

module.exports = router;