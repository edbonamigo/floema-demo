require('dotenv').config()

const PrismicH = require('@prismicio/helpers')
const client = require('./prismicConfig.js')

const app = require('./appConfig')

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

app.listen(app.get('port'), () => {
	console.log(`App listening on port ${app.get('port')}!
  =======================`)
})

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
