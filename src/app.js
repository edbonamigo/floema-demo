import dotenv from 'dotenv'
import path from 'path'
import express from 'express'
import { fileURLToPath } from 'url'
import * as prismicH from '@prismicio/helpers'
import { client } from './config/prismicConfig.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

// Set Pug as template engine
app.set('view engine', 'pug')
const __dirname = path.dirname(fileURLToPath(import.meta.url))
app.set('views', path.join(__dirname, 'views'))

// Middleware function, runs on every route.
// It Inject prismic context to the locals so that we can access these in
// our templates.
app.use((req, res, next) => {
  res.locals.ctx = {
    prismicH
  }
  next()
})

/**
 * ROUTES
 */

app.get('/', async (req, res) => {
  // Here we are retrieving the first document from your API endpoint
  const response = await client.getSingle('home')
  console.log(response)
  res.render('pages/home')
})
// app.get('/', (req, res) => res.render('pages/home'))

app.get('/about', async (req, res) => {
  // Here we are retrieving the first document from your API endpoint
  const about = await client.getSingle('about')
  const meta = await client.getSingle('metadata')

  res.render('pages/about', { about, meta })
})
// app.get('/about', (req, res) => res.render('pages/about'))

app.get('/collections', (req, res) => res.render('pages/collections'))
app.get('/details/:uid', (req, res) => res.render('pages/details'))

app.listen(port, () => {
  console.log(`App listening on port ${port}!
  =======================`)
})
