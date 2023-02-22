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
import dotenv from 'dotenv'

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
	res.locals.ctx = {
		prismicH,
	}
	next()
})
app.use(errorHandler())

/**
 * Routes
 */

app.get('/', async (req, res) => {
	let meta = await client.getSingle('metadata')
	let home = await client.getSingle('home')

	res.render('pages/home', { meta, home })
})

app.get('/about', async (req, res) => {
	let meta = await client.getSingle('metadata')
	let about = await client.getSingle('about')

	res.render('pages/about', { meta, about })
})

app.get('/collection', async (req, res) => {
	let meta = await client.getSingle('metadata')

	res.render('pages/collection', { meta })
})

app.get('/detail/:uid', async (req, res) => {
	let meta = await client.getSingle('metadata')
	let product = await client.getByUID('product', req.params.uid, {
		fetchLinks: 'collection.title',
	})

	console.log(product.data)
	console.log('==============================')

	res.render('pages/detail', { meta, product })
})

app.listen(port, () => {
	console.log(`>>> Website running at: http://localhost:${port} <<<`)
})
