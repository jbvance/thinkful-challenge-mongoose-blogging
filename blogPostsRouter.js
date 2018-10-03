const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { Post } = require('./models');


router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const { title, content, author } = req.body;
    Post.create(({
        title,
        content,
        author
    }))
    .then(item => {
        return res.status(201).json(item);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: `Internal server error: ${err.message}` });
    })

});

router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id) {
        const message = (
            `Request path id (${req.params.id}) and request body id `
                `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`Updating blog post with id \`${req.params.id}\``);
    const { id, title, content, author } = req.body;
    Post.findByIdAndUpdate(id, {
        title, 
        content,
         author
    }, { upsert: false, new: true })
    .then(post => {       
        res.status(200).json(post.serialize());
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: `Internal server error: ${err.message}` });
    })
    
})

router.get('/', (req, res) => {
    Post.find()
        .then(posts => {
            res.json({
                posts: posts.map(post => post.serialize())
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: `Internal server error: ${err.message}` });
        })
})

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            res.json({
                post: post.serialize()
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: `Internal server error: ${err.message}` });
        })
})

router.delete('/:id', (req, res) => {
    Post.findByIdAndRemove(req.params.id)
    .then(() => {
        console.log(`Deleted blog post with id of ${req.params.id}`);
        res.status(204).end();
    })   
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: `Internal server error: ${err.message}` });
    })    
})

module.exports = router;