// node-fetch is used to make network requests to the Prismic Rest API.
// In Node.js Prismic projects, you must provide a fetch method to the
// Prismic client.
const fetch = require('node-fetch')
const prismic = require('@prismicio/client')
const dotenv = require('dotenv')
dotenv.config()

const repoName = process.env.PRISMIC_REPO_NAME
const accessToken = process.env.PRISMIC_ACCESS_TOKEN

// The `routes` property is your Route Resolver. It defines how you will
// structure URLs in your project. Update the types to match the Custom
// Types in your project, and edit the paths to match the routing in your
// project.
// TODO: Need to create route for the types: metadata and preloader?
const routes = []

const client = prismic.createClient(repoName, {
	fetch,
	accessToken,
	routes,
})

module.exports = { client }
