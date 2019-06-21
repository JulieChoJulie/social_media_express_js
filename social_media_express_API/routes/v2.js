const express = require('express');
const jwt = require('jsonwebtoken');

const { verifyToken, apiLimiter } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');

const router = express.Router();

router.post('/token', apiLimiter, async (req, res) => {
    const { clientSecret } = req.body;
    try {
        const domain = await Domain.findOne({
            where: { clientSecret },
            include: {
                model: User,
                attribute: ['nick', 'id'],
            },
        });
        if (!domain) {
            return res.status(401).json({
                code: 401,
                message: 'The domain is not registered. Please register the doamin first.',
            });
        }
        // Issue a token
        const token = jwt.sign({
            id: domain.user.id,
            nick: domain.user.nick,
        }, process.env.JWT_SECRET, {
            expiresIn: '30m',
            issuer: 'express',
        });
        return res.json({
            code: 200,
            message: 'A token has been issued.',
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: 'Server error.',
        });
    }
});


router.get('/test', verifyToken, apiLimiter, (req, res) => {
    res.json(req.decoded);
});


router.get('/posts/my', verifyToken, apiLimiter, (req, res) => {
    Post.findAll({ where: { id: req.decoded.id } })
        .then((posts) => {
            res.json({
                code: 200,
                payload: posts,
            });
        })
        .catch((error) => {
            console.log(error);
            return res.status(500).json({
                code: 500,
                message: 'Server Error',
            });
        });
});

router.get('/posts/hashtag/:title', verifyToken, apiLimiter, async (req, res) => {
    try {
        const hashtag = await Hashtag.findOne({ where: { title: req.params.title } });
        if (!hashtag) {
            return res.status(404).json({
                code: 404,
                message: 'No hashtag found',
            })
        }
        const posts = await hashtag.getPosts();
        return res.json({
            code: 200,
            message: posts,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: 'Server Error',
        });
    }
});

module.exports = router;