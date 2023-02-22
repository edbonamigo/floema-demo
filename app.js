import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

import logger from 'morgan'
import express from 'express'
import errorHandler from 'errorhandler'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'

import * as prismicH from '@prismicio/helpers'
import { client } from './config/prismicConfig.js'
import stringNumbers from './app/utils/string-numbers.js'

// Global variables stored in: .env | available trough: process.env.VARIABLE_NAME
dotenv.config()

const app = express()
const port = process.env.PORT || 3000
const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride())
app.use(errorHandler())

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
// Make prismicH accesible in ejs templates
app.use((req, res, next) => {
	res.locals = {
		prismicH,
		stringNumbers,
	}
	next()
})

app.use(async (req, res, next) => {
	const meta = await client.getSingle('metadata')
	const preloader = await client.getSingle('preloader')
	res.locals.defaults = { meta, preloader }

	next()
})

/**
 * Routes
 */

app.get('/', async (req, res) => {
	const home = await client.getSingle('home')

	res.render('pages/home', {
		home,
		...res.locals.defaults,
	})
})

app.get('/about', async (req, res) => {
	const about = await client.getSingle('about')

	res.render('pages/about', {
		about,
		...res.locals.defaults,
	})
})

app.get('/collections', async (req, res) => {
	const collections = await client.getAllByType('collection', {
		fetchLinks: 'product.image',
	})
	const home = await client.getSingle('home')

	res.render('pages/collections', {
		collections,
		home,
		...res.locals.defaults,
	})
})

app.get('/detail/:uid', async (req, res) => {
	const product = await client.getByUID('product', req.params.uid, {
		fetchLinks: 'collection.title',
	})

	res.render('pages/detail', {
		product,
		...res.locals.defaults,
	})
})

app.listen(port, () => {
	console.log(`>>> Website running at: http://localhost:${port} <<<`)
})
