const User = require('../models/user');

require('dotenv').config();

const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

exports.signupAction = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Validation failed");
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;
        const user = await User.findOne({email: email});
        if (user) {
            const err = new Error('User already exists!');
            err.statusCode = 422;
            throw err;
        }

        const hasedPw = await bcrypt.hash(password, 12);
        const newUser = new User({
            email: email,
            password: hasedPw,
            name: name,
        });
        const result = await newUser.save();
        res.status(200).json({ message: 'User created!', user: {name} });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
    
}

exports.loginAction = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const err = new Error('Validation failed');
            err.statusCode = 422;
            err.data = errors.array();
            throw err;
        }
        
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({email: email});
        if (!user) {
            const err = new Error('No user found.');
            err.statusCode = 422;
            throw err;
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const err = new Error('Invalid credentials.');
            err.statusCode = 422;
            throw err;
        }
        const token = jwt.sign(
            { email: email, userId: user._id },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        res.status(200).json({message: 'login success!', token: token});

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}