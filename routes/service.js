var express = require('express');

// import services
var bookService = require('../service/book');

var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('Accessing the service section ... Permission check, need authorization, secret section. Time: ', Date.now());
    next();
});

//[---
/**
 * 默认 sync 映射 REST 风格的 CRUD 类似下面这样：（REST即表述性状态传递软。英文：Representational State Transfer，简称REST。一种件架构风格。）
 * create   → POST      /collection
 * read     → GET       /collection[/id]
 * update   → PUT       /collection/id
 * patch    → PATCH     /collection/id
 * delete   → DELETE    /collection/id
 */
router.post('/rest/*', function (req, res) {
    res.send('post')
});

router.get('/rest/*', function(req, res) {
    // console.log('service get: ', JSON.stringify(req));
    bookService.find(req, res);
});

router.put('/rest/*', function (req, res) {
    res.send('put')
});

router.patch('/rest/*', function (req, res) {
    res.send('patch')
});

router.delete('/rest/*', function (req, res) {
    res.send('delete')
});
//---]

module.exports = router;
