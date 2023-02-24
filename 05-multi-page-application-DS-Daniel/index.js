const express = require('express')
const app = express()
const port = 3000


// Configure express
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
// pug template engine
app.set('view engine', 'pug')

// Connect to the database
const sqlite = require('sqlite3').verbose()
const db = new sqlite.Database('./dictons.sqlite')

// GET /
// Displays a random dicton in HTML.
// Example: <q>random dicton</q>
app.get('/', (req, res) => {
   const rdID = Math.floor(Math.random() * 100) + 1
   const sql = `SELECT dicton FROM dictons WHERE id = ?`
   db.get(sql, [rdID], (err, row) => {
      if (err) {
         return console.error(err.message)
      }
      return row ? res.render('random', { dicton: row.dicton }) : res.send('no data')
   })
})

// GET /list
// Displays all the dictons ordered by id in HTML
// Example: <ul><li><a href="/1">dicton 1</a></li></ul> 
app.get('/list', (req, res) => {
   const sql = `SELECT * FROM dictons ORDER BY id`
   db.all(sql, [], (err, rows) => {
      if (err) {
         return console.error(err.message)
      }
      res.render('list', { rows: rows })
   })
})

// GET /create
// Displays a HTML form for creating new dictons with POST requests.
// Example: <form method=POST><input type='text' name='dicton'></input><button>Nouveau dicton</button></form>
app.get('/create', (req, res) => {
   res.render('create')
})

// POST /create
// Inserts a new dicton in the database and redirect the user to its url
// Example: 301 /list
app.post('/create', (req, res) => {
   const sql = 'INSERT INTO dictons(dicton) VALUES(?)'
   db.run(sql, [req.body.dicton], function (err) {
      if (err) {
         return console.error(err.message)
      }
      console.log(`New insertion, rowID : ${this.lastID}`)
      res.redirect(`/${this.lastID}`)
   })
})

// GET /:id
// Returns a dicton by its id.
app.get('/:id', (req, res) => {
   const sql = `SELECT * FROM dictons WHERE id = ?`
   db.get(sql, [req.params.id], (err, row) => {
      if (err) {
         return console.error(err.message)
      }
      return row ? res.render('byId', { id: row.id, dicton: row.dicton }) : res.send('no data')
   })
})

// Start the server
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// Export the server
module.exports = server;