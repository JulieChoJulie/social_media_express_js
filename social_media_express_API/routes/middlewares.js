exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('Login Required');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/')
    }
};

const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    try {
       req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
       return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(419).json({
                code: 419,
                message: 'The token is expired.',
            });
        }
        return res.stauts(401).json({
            code: 401,
            message: 'The token is invalid.',
        });
    }
};

const RateLimit = require('express-rate-limit');
exports.apiLimiter = new RateLimit({
    windowMs: 60 * 1000,
    max: 1,
    delayMs: 0,
    handler (req, res) {
        res.status(this.statusCode).json({
            code: this.statusCode,
            message: 'Max 1 request per a minute.',
        });
    },
});

exports.deprecated = (req, res) => {
    res.status(410).json({
        code: 410,
        message: 'The new version has been released. Please use the new version.',
    });
};