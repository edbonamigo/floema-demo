import '../fonts/suisse-bp-regular.woff2'
import '../fonts/suisse-bp-regular.woff'
import '../fonts/suisse-bp-light.woff2'
import '../fonts/suisse-bp-light.woff'
import '../fonts/suisse-bp-ultra-light.woff'
import '../fonts/suisse-bp-ultra-light.woff'
import '../fonts/george-x-regular.woff2'
import '../fonts/george-x-regular.woff'
import each from 'lodash/each'

import Preloader from 'components/Preloader'

import About from './pages/About'
import Collections from './pages/Collections'
import Detail from './pages/Detail'
import Home from './pages/Home'
import { urlToHttpOptions } from 'url'

class App {
	constructor() {
		this.createPreloader()
		this.createContent()
		this.createPages()

		this.addLinkListeners()
	}

	createPreloader() {
		this.preloader = new Preloader()
		this.preloader.once('completed', this.onPreloaded.bind(this))
	}

	createContent() {
		this.content = document.querySelector('.content')
		this.template = this.content.getAttribute('data-template')
	}

	createPages() {
		this.pages = {
			about: new About(),
			collections: new Collections(),
			detail: new Detail(),
			home: new Home(),
		}

		this.page = this.pages[this.template]
		this.page.create()
		this.page.show()
	}

	onPreloaded() {
		this.preloader.destroy()
	}

	async onChange(url) {
		const request = await window.fetch(url)

		if (request.status === 200) {
			const html = await request.text()
			const div = document.createElement('div')

			div.innerHTML = html

			const divContent = div.querySelector('.content')

			this.template = divContent.getAttribute('data-template')

			this.content.setAttribute('data-template', this.template)
			this.content.innerHTML = divContent.innerHTML

			this.page = this.pages[this.template]
			this.page.create()
			this.page.show()

			this.addLinkListeners()
		} else {
			console.log('Error')
		}
	}

	addLinkListeners() {
		const links = document.querySelectorAll('a')

		each(links, (link) => {
			link.onclick = (event) => {
				event.preventDefault()

				const { href } = link

				this.onChange(href)
			}
		})
	}
}

new App()
