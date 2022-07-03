import dotenv from 'dotenv'
import path from 'path'
import express from 'express'
import errorHandler from 'errorhandler'
import { fileURLToPath } from 'url'
import * as PrismicH from '@prismicio/helpers'
import { client } from './config/prismicConfig.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

// Set Pug as template engine
app.set('view engine', 'pug')
app.set(
	'views',
	path.join(path.dirname(fileURLToPath(import.meta.url)), 'views')
)

app.use(errorHandler())

// Middleware function, runs on every route.
// It Inject prismic context to the locals so that we can access these in
// our pug templates.
app.use((req, res, next) => {
	res.locals.ctx = {
		PrismicH
	}
	next()
})

/**
 * ROUTES
 */

app.get('/', async (req, res) => {
	const meta = await client.getSingle('metadata')

	res.render('pages/home', { meta })
})

app.get('/about', async (req, res) => {
	const meta = await client.getSingle('metadata')
	const about = await client.getSingle('about')

	res.render('pages/about', { about, meta })
})

app.get('/collections/:uid', async (req, res) => {
	const meta = await client.getSingle('metadata')
	const collection = await client.getByUID('collection', req.params.uid)

	console.log(collection)

	res.render('pages/collections', { collection, meta })
})

app.get('/detail/:uid', async (req, res) => {
	const meta = await client.getSingle('metadata')
	const product = await client.getByUID('product', req.params.uid, {
		fetchLinks: 'collection.title'
	})

	console.log(product)

	res.render('pages/detail', { product, meta })
})

app.listen(port, () => {
	console.log(`App listening on port ${port}!
  =======================`)
})
