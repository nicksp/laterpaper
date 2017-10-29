// Connect to a DB file
const sqlite3 = require('sqlite3').verbose()
const dbName = 'laterpaper.sqlite'
const db = new sqlite3.Database(dbName)

// Create an `articles` table if there isn't one
db.serialize(() => {
  const sql = `
    CREATE TABLE IF NOT EXISTS articles
      (id integer primary key, title, content TEXT)
  `
  db.run(sql)
})

class Article {
  static all(cb) {
    db.all('SELECT * FROM articles', cb)
  }

  static find(id, cb) {
    db.get('SELECT * FROM articles WHERE id = ?', id, cb)
  }

  static create({ title, content }, cb) {
    const sql = 'INSERT INTO articles(title, content) VALUES (?, ?)'
    db.run(sql, title, content, cb)
  }

  static delete(id, cb) {
    if (!id) return cb(new Error('Please provide an id'))
    db.run('DELETE FROM articles WHERE id = ?', id, cb)
  }
}

module.exports = db
module.exports.Article = Article
