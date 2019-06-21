const express = require('express');
const jwt = require('jsonwebtoken');

const { verifyToken } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');

const router = express.Router();

router.post('/token', async (req, res) => {
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
            id: domain.user.id
            nick: domain.user.nick
        }, process.env.JWT_SECRET, {
            expiresIn: '1m',
            issuer: 'express',
        });

        return res.json({
            code: 200,
            message: 'Token has been issued.',
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


router.get('/test', verifyToken, (req, res) => {
    res.json(req.decoded);
});