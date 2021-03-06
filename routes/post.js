const express= require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();
fs.readdir('uploads', (err) => {
    if (err) {
        console.error('Create uploads folder');
        fs.mkdirSync( 'uploads/', (err) => {console.error(err)});
    }
});

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
        },
    }),
    // limits: {fileSize: 5 * 1024 * 1024},
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}` });
});

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async(req, res, next) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            userId: req.user.id,
        });
        const hashtag = req.body.content.match(/#[^\s]*/g);
        if (hashtag) {
            const result = await Promise.all(hashtag.map(tag => Hashtag.findOrCreate({
                where: { title: tag.slice(1).toLowerCase() },
            })));
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});


router.get('/hashtag', async(req, res, next) => {
    const query = req.query.hashtag;
    if (!query) {
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.findOne({ where: { title: query }});
        let posts = [];
        if (hashtag) {
            posts = await hashtag.getPosts({
                include: [{
                    model: User,
                    attribute: ['id', 'nick'],
                }, {
                    model: User,
                    attribute: ['id', 'nick'],
                    as: 'Liker',
                }],
                order: [['createdAt', 'DESC']],
            });
        }
        return res.render('main', {
            title: `${query} | Express`,
            user: req.user,
            twits: posts,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/:id/like', async (req, res, next) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.id }});
        await post.addLiker(req.user.id);
        res.send('success');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/:id/like', async (req, res, next) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.id}});
        await post.removeLiker(req.user.id);
        res.send('success');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/:id/delete', async (req, res, next) => {
    try {
        await Post.destroy({ where: { id: req.params.id}});
        res.send('success');
    } catch (error) {
        console.error(error);
        next(error);
    }
});



module.exports = router;
