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

router.post('/posts/:post_id/edit', async function(req, res){

    const query = `
        UPDATE posts 
        SET post_title = ?,
        post_summary = ?,
        post_body = ?
        WHERE post_id = ?
    `;

    await db.query(query,[
        req.body.post_title,
        req.body.post_summary,
        req.body.post_content,
        req.params.post_id
    ]);

    res.redirect('/posts');
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

router.get('/posts/:post_id/edit', async function(req, res){
    const query = `
    SELECT posts.* FROM posts
    WHERE posts.post_id = ?
    `;

    const [posts] = await db.query(query, [req.params.post_id]);
    
    if(!posts || posts.length === 0){
        return res.status(400).render('404');
    }

    res.render('update-post', {post: posts[0]})
});

router.get('/')

router.get('/view-post/:post_id', async function(req, res){
    
    const query = `
    SELECT posts.*, authors.author_name, authors.author_email FROM posts 
    INNER JOIN authors ON posts.author_id = authors.author_id
    WHERE posts.post_id = ?
    `;
    
    const [posts] = await db.query(query, req.params.post_id);
    
    if(!posts || posts.length === 0){
        return res.status(400).render('404');
    }

    const postsData = {
        ...posts[0],
        post_date: posts[0].post_date.toISOString(),
        post_readable_date: posts[0].post_date.toLocaleDateString('en-US',{
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        })
    }

    res.render('post-detail', {post: postsData});
});

router.post('/posts/:post_id/delete', async function(req, res){
    await db.query('DELETE FROM posts WHERE post_id = ?', [req.params.post_id]);
    res.redirect('/posts');
});

module.exports = router;