const express = require('express');

const db = require('../data/database.js');

const router = express.Router();

router.get('/', function(req, res){
    res.redirect('/posts');
});

router.get('/posts', async function(req, res){
    const [posts] = await db.query('SELECT posts.*, authors.author_name FROM posts INNER JOIN authors ON posts.author_id = authors.author_id;');
    res.render('posts-list', {posts: posts});
});

router.get('/new-post', async function(req, res){
    const [authors] = await db.query('SELECT * FROM authors;');
    res.render('create-post', {authors: authors});
});

router.post('/posts', async function(req, res){
    const data = [
        req.body.title,
        req.body.summary,
        req.body.content,
        req.body.author
    ]
    
    await db.query('INSERT INTO posts (post_title, post_summary, post_body, author_id) VALUES (?)', [data]);

    res.redirect('/posts');
});

router.get('/view-post/:post_id', async function(req, res){
    
    const query = `
    SELECT posts.*, authors.author_name, authors.author_email FROM posts 
    INNER JOIN authors ON posts.author_id = authors.author_id
    WHERE posts.post_id = ?
    `;
    
    const [posts] = await db.query(query, req.params.post_id);
    
    res.render('post-detail', {post: posts[0]});
});

module.exports = router;