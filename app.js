import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const port = 3000

// set up Prismic API
// fetch data from about endpoint
// fetch metadata  for about page
// log the results
// uncomment the meta.data in about.pug

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.render('pages/home')
})

app.get('/about', (req, res) => {
  res.render('pages/about')
})

app.get('/collection', (req, res) => {
  res.render('pages/collection')
})

app.get('/detail/:id', (req, res) => {
  res.render('pages/detail')
})

app.listen(port, () => {
  console.log(`Exemple app listening at http://localhost:${port}`)
})
