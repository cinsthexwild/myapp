var db = require('../lib/db');

module.exports = {
    add: function (obj) {

    },

    delete: function (id) {

    },

    update: function (id) {

    },

    find: function (req, res) {
        var book = null;
        db.query('SELECT * FROM book', function (error, results, fields) {
            if (error) {
                res.json(error);
                throw error;
            }
            if (results.length > 0) {
                book = {};
                book.id = results[0].idbook;
                book.name = results[0].name;
                book.author = results[0].author;
            }
            console.log('The find book is: ', book, req.param('id'), req.params.id, req.query.id);
            res.json(book);
        });
        // console.log('The ret book is: ', book);
        // return book;
    }

};
