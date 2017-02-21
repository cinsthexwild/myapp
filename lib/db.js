/**
 * Created by cinsthexwild on 2017/2/21.
 * refer to: https://www.npmjs.com/package/mysql
 */

// Establishing connections
var mysql = require('mysql');

//[---
/**
 * Creating and managing connections one-by-one
 */

// var connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'earth',
//     password: 'earth',
//     database: 'mydb'
// });

/**
 * The recommended way to establish a connection
 */
// connection.connect(function(err) {
//     if (err) {
//         console.error('error connecting: ' + err.stack);
//         return;
//     }
//
//     console.log('connected as id ' + connection.threadId);
// });

/**
 * However, a connection can also be implicitly established by invoking a query:
 */
// connection.query('SELECT * FROM book', function (error, results, fields) {
//     if (error) {
//       throw error;
//     }
//     console.log('The book[0].name is: ', results[0].name);
//     // connected!
// });

/**
 * There are two ways to end a connection. Terminating a connection gracefully is done by calling the end() method:
 */
// connection.end(function(err) {
//     // The connection is terminated now
// });
/**
 * An alternative way to end the connection is to call the destroy() method. Unlike end() the destroy() method does not take a callback argument.
 */
// connection.destroy();
//---]

//[---
/**
 * Creating and managing connections with pool
 */

/**
 * single connection
 * Connections can be pooled to ease sharing a single connection, or managing multiple connections.
 */
// var pool  = mysql.createPool({
//     host: 'localhost',
//     user: 'earth',
//     password: 'earth',
//     database: 'mydb'
// });

/**
 * When you are done with a connection, just call connection.release() and the connection will return to the pool,
 * ready to be used again by someone else.
 * If you would like to close the connection and remove it from the pool, use connection.destroy() instead.
 * The pool will create a new connection the next time one is needed.
 */
// pool.getConnection(function(err, connection) {
//     // Use the connection
//     connection.query('SELECT something FROM sometable', function (error, results, fields) {
//         // connected! (unless `err` is set)
//         // And done with the connection.
//         connection.release();
//
//         // Handle error after the release.
//         if (error) throw error;
//
//         // Don't use the connection here, it has been returned to the pool.
//     });
// });

/**
 * multiple connection
 */
var pool  = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'earth',
    password: 'earth',
    database: 'mydb'
});

// when start app, test if connected
pool.query('SELECT "Pool is created.[connected to \\\'mydb\\\']"AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The mysql solution is: ', results[0].solution);
});
//---]

module.exports = pool;
