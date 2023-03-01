const path = require('path')
const dotenv = require('dotenv')

const logger = require('morgan')
const express = require('express')
const errorHandler = require('errorhandler')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')

const prismicH = require('@prismicio/helpers')
const { client } = require('./config/prismicConfig.js')
const stringNumbers = require('./app/utils/string-numbers.js')

// Global variables stored in: .env | available trough: process.env.VARIABLE_NAME
dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride())
app.use(errorHandler())
app.use(express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
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
	const collections = await client.getAllByType('collection', {
		fetchLinks: 'product.image',
	})
	const home = await client.getSingle('home')

	res.render('pages/home', {
		...res.locals.defaults,
		collections,
		home,
	})
})

app.get('/about', async (req, res) => {
	const about = await client.getSingle('about')

	res.render('pages/about', {
		...res.locals.defaults,
		about,
	})
})

app.get('/collections', async (req, res) => {
	const collections = await client.getAllByType('collection', {
		fetchLinks: 'product.image',
	})
	const home = await client.getSingle('home')

	res.render('pages/collections', {
		...res.locals.defaults,
		collections,
		home,
	})
})

app.get('/detail/:uid', async (req, res) => {
	const product = await client.getByUID('product', req.params.uid, {
		fetchLinks: 'collection.title',
	})

	res.render('pages/detail', {
		...res.locals.defaults,
		product,
	})
})

app.listen(port, () => {
	console.log(`>>> Website running at: http://localhost:${port} <<<`)
})
