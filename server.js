const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Import Routes
const authRoutes = require('./auth/routes');


// Connect to DB
mongoose.connect(
    "mongodb+srv://<username>:<password>@cluster0-dvjse.mongodb.net/test?retryWrites=true&w=majority", 
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("connected to db");
    }
);

// Route middlewares
app.use('/api/auth', authRoutes);


app.listen(3000, () => console.log("Server running"));
