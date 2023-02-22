import path from 'path'
import express from 'express'
import { fileURLToPath } from 'url'
import * as prismicH from '@prismicio/helpers'
import { client } from './config/prismicConfig.js'
import dotenv from 'dotenv'

// Global variables stored in: .env | available trough: process.env.VARIABLE_NAME
dotenv.config()

const app = express()
const port = process.env.PORT || 3000
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// TODO:
// X ES6 Modules
// X Setup Prismic Rest API
// X Fetch metadata in a middleware to be acessible in every route
// -> Fetch data for each route

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
// Make prismicH accesible in ejs templates
app.use((req, res, next) => {
	res.locals.ctx = {
		prismicH,
	}
	next()
})

// Middleware to get metadata
app.use(async (req, res, next) => {
	let document = await client.getByType('metadata')
	let [metadata] = document.results

	res.metadata = metadata

	next()
})

/**
 * Routes
 */

app.get('/', async (req, res) => {
	let meta = res.metadata
	let result = await client.getByType('home')
	let [home] = result.results

	res.render('pages/home', { meta, home })
})

app.get('/about', async (req, res) => {
	let meta = res.metadata
	let document = await client.getByType('about')
	let [about] = document.results

	res.render('pages/about', { meta, about })
})

app.get('/collection', (req, res) => {
	let meta = res.metadata

	res.render('pages/collection', { meta })
})

app.get('/detail/:id', (req, res) => {
	let meta = res.metadata

	res.render('pages/detail', { meta })

	console.log('==============================')
})

app.listen(port, () => {
	console.log(`>>>>>> Website online: http://localhost:${port} <<<<<<`)
})
