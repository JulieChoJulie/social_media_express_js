const express = require('express');
const router = express.Router();

router.get('/profile', (req, res) => {
    res.render('profile', {
        title: 'My Profile - Express',
        user: null,
    })
});

router.get('/join', (req, res) => {
    res.render('join', {
        title: 'Join - Express',
        user: null,
        joinError: req.flash('joinError'),
    })
});

router.get('/', (req, res) => {
    res.render('main', {
        title: 'Main - Express',
        twits: [],
        user: null,
        loginError: req.flash('loginError'),
    });
});


module.exports = router;