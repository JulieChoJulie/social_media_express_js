const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', {
        title: 'My Profile - Express',
        user: req.user,
    })
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {
        title: 'Join - Express',
        user: req.user,
        joinError: req.flash('joinError'),
    })
});

router.get('/', (req, res) => {
    res.render('main', {
        title: 'Main - Express',
        twits: [],
        user: req.user,
        loginError: req.flash('loginError'),
    });
});


module.exports = router;