import dotenv from 'dotenv'
import path from 'path'
import logger from 'morgan'
import express from 'express'
import errorHandler from 'errorhandler'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import { fileURLToPath } from 'url'
import * as PrismicH from '@prismicio/helpers'
import { client } from './config/prismicConfig.js'

dotenv.config()

const app = express()
const port = 3000

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride())
app.use(errorHandler())

const handleLinkResolver = (doc) => {
	if (doc.type === 'about') {
		return `/about`
	}

	if (doc.type === 'collections') {
		return `/collections`
	}

	if (doc.type === 'product') {
		return `/detail/${doc.slug}`
	}

	return '/'
}

const NumbersByIndex = {
	0: 'One',
	1: 'Two',
	2: 'Three',
	3: 'Four',
	4: 'Five'
}

// Inject js stuff into pug templates
app.use((req, res, next) => {
	res.locals.ctx = {
		PrismicH
	}
	res.locals.Link = handleLinkResolver
	res.locals.Number = NumbersByIndex
	next()
})

// Set Pug as template engine
app.set('view engine', 'pug')
app.set(
	'views',
	path.join(path.dirname(fileURLToPath(import.meta.url)), 'views')
)

/**
 * ROUTES
 */

const handleRequest = async () => {
	const meta = await client.getSingle('metadata')
	const navigation = await client.getSingle('navigation')
	const preloader = await client.getSingle('preloader')

	return {
		meta,
		navigation,
		preloader
	}
}

app.get('/', async (req, res) => {
	const defaults = await handleRequest()
	const collections = await client.getAllByType('collection')
	const home = await client.getSingle('home')

	res.render('pages/home', {
		...defaults,
		collections,
		home
	})
})

app.get('/about', async (req, res) => {
	const defaults = await handleRequest()
	const about = await client.getSingle('about')

	res.render('pages/about', {
		...defaults,
		about
	})
})

app.get('/collections', async (req, res) => {
	const defaults = await handleRequest()
	const collections = await client.getAllByType('collection', {
		fetchLinks: 'product.image'
	})
	const home = await client.getSingle('home')

	res.render('pages/collections', {
		...defaults,
		collections,
		home
	})
})

app.get('/detail/:uid', async (req, res) => {
	const defaults = await handleRequest()
	const product = await client.getByUID('product', req.params.uid, {
		fetchLinks: 'collection.title'
	})

	res.render('pages/detail', {
		...defaults,
		product
	})
})

app.listen(port, () => {
	console.log(`App listening on port ${port}!
  =======================`)
})
