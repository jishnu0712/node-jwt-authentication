const express = require('express');

require('dotenv').config();

const app = express();

const bodyParser = require('body-parser');

const ProductRoute = require("./routes/products");
const authRoute = require("./routes/auth");

const mongoose = require("mongoose");


// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(ProductRoute);
app.use('/auth', authRoute);

app.use((req, res, next) => {
    res.status(404).send({data: "page not found"});
});

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

mongoose.connect(process.env.MONGODB_URI)
    .then(res => {
        app.listen(5050, () => console.log("server started at 5050"));
    })
    .catch(err => {
        console.log(process.env.MONGODB_URI)
        console.log(err)});

