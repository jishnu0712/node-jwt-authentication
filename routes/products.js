const express = require("express");

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get("/add", isAuth, (req, res, next) => {
    console.log(req);
    res.status(301).send({data: "this is a working sample data"});
})

module.exports = router;