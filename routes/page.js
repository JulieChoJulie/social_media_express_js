const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User } = require('../models');

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
    Post.findAll({
        include: {
            model: User,
            attribute: ['id', 'nick'],
        },
        order: [['createdAt', 'DESC']],
    })
        .then((posts) => {
            res.render('main', {
                title: 'Main - Express',
                twits: posts,
                user: req.user,
                loginError: req.flash('loginError'),
            });
        })
        .catch((error) => {
            console.error(error);
            next(error);
        });
});


module.exports = router;