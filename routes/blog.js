const express = require('express');

const db = require('../data/database.js');

const route = express.Router();

route.get('/', function(req, res){
    res.redirect('/posts');
});

route.get('/posts', function(req, res){
    res.render('posts-list');
});

route.get('/new-post', async function(req, res){
    const [authors] = await db.query('SELECT * FROM authors;');
    res.render('create-post', {authors: authors});
});

module.exports = route;