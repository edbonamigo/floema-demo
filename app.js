import path from 'path'
import express from 'express'
import errorHandler from 'errorhandler'
import { fileURLToPath } from 'url'
import * as prismicH from '@prismicio/helpers'
import { client } from './config/prismicConfig.js'
import dotenv from 'dotenv'

// Global variables stored in: .env | available trough: process.env.VARIABLE_NAME
dotenv.config()

const app = express()
const port = process.env.PORT || 3000
const __dirname = path.dirname(fileURLToPath(import.meta.url))

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
