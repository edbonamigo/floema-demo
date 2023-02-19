import path from 'path'
import express from 'express'
import { fileURLToPath } from 'url'
import * as prismicH from '@prismicio/helpers'
import { client } from './config/prismicConfig.js'
import dotenv from 'dotenv'

// Global variables stored in: .env
// Variables available trough: process.env.VARIABLE_NAME
dotenv.config()

const app = express()
const port = process.env.PORT || 3000
// Hack to enable __dirname on ES6 modules
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// TODO:
// X ES6 Modules
// X Setup Prismic Rest API
// X Fetch metadata in a middleware to be acessible in every route
// -> Fetch data for each route

const htmlSerializer = {
  // Arguments can be destructured for each block type
  paragraph: ({ s }) => `<p class="paragraph-class">${children}</p>`,
}

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
// Add a middleware function that runs on every route. It will inject
// the prismic context to the locals so that we can access these in
// our templates.
app.use((req, res, next) => {
  res.locals.ctx = {
    prismicH,
    htmlSerializer,
  }
  next()
})

app.use(async (req, res, next) => {
  let document = await client.getByType('metadata')
  let [meta] = document.results

  res.locals.meta = meta

  next()
})

/**
 * Routes
 */

app.get('/', async (req, res) => {
  let meta = res.locals.meta
  let result = await client.getByType('home')
  let [home] = result.results
  res.render('index', { meta, home })

  console.log(home.data)
})

app.get('/about', async (req, res) => {
  let meta = res.locals.meta
  let document = await client.getByType('about')
  let [about] = document.results

  about.data.body.forEach((slice) => {
    if (slice.slice_type == 'content') {
      console.log(slice.primary.label, slice.primary.image.url)
    }
  })

  res.render('pages/about', {
    meta,
    about,
  })

  console.log(
    '============================================================================='
  )
})

app.get('/collection', (req, res) => {
  let meta = res.locals.meta

  res.render('pages/collection', { meta })
})

app.get('/detail/:id', (req, res) => {
  let meta = res.locals.meta

  res.render('pages/detail', { meta })
})

app.listen(port, () => {
  console.log(`>>>>>> Website online: http://localhost:${port} <<<<<<`)
})
