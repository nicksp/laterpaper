const express = require('express')
const bodyParser = require('body-parser')
const read = require('node-readability')

const router = express.Router()
const app = express()

const port = process.env.PORT || 3000

// Load models
const Article = require('./db').Article

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/css/bootstrap.css', express.static('node_modules/bootstrap/dist/css/bootstrap.css'))

router.route('/articles')
  // Get all articles
  .get((req, res, next) => {
    Article.all((err, articles) => {
      if (err) return next(err)

      res.format({
        html() {
          res.render('articles.ejs', { articles })
        },
        json() {
          res.send(articles)
        }
      })
    })
  })

  // Create a new article
  .post((req, res, next) => {
    const { url } = req.body

    read(url, (err, result) => {
      if (err || !result) res.status(500).send('Error downloading article')
      const { title, content } = result
      Article.create(
        { title, content },
        (err, article) => {
          if (err) return next(err)
          res.send('OK')
        }
      )
    })
  })

router.route('/articles/:id')
  // Fetch a single article
  .get((req, res, next) => {
    const id = req.params.id
    Article.find(id, (err, article) => {
      if (err) return next(err)

      res.format({
        html() {
          res.render('article.ejs', { article })
        },
        json() {
          res.send(article)
        }
      })
    })
  })

  // Delete an article
  .delete((req, res, next) => {
    const id = req.params.id
    Article.delete(id, err => {
      if (err) return next(err)
      res.json({ message: 'Deleted' })
    })
  })

app.use('/', router)

app.listen(port, () => console.log(`App started on port: ${port}`))
