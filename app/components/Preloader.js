import Component from 'classes/Component'
import each from 'lodash/each'
import GSAP from 'gsap'
import { split } from 'utils/text'

export default class Preloader extends Component {
	constructor() {
		super({
			element: '.preloader',
			elements: {
				title: '.preloader__text',
				number: '.preloader__number',
				numberText: '.preloader__number__text',
				images: document.querySelectorAll('img'),
			},
		})

		split({
			element: this.elements.title,
			expression: '<br>',
		})
		split({
			element: this.elements.title,
			expression: '<br>',
		}) // yep, need to be twice

		this.elements.titleSpans = this.elements.title.querySelectorAll('span span')

		this.length = 0

		this.createLoader()
	}

	createLoader() {
		each(this.elements.images, (img) => {
			img.onload = (_) => this.onAssetLoaded()
			img.src = img.dataset.src
		})
	}

	onAssetLoaded() {
		this.length += 1

		const percent = Math.round(
			(this.length / this.elements.images.length) * 100
		)

		this.elements.numberText.innerHTML = `${percent}%`

		if (percent === 100) {
			this.onLoaded()
		}
	}

	onLoaded() {
		return new Promise((resolve) => {
			this.animateOut = GSAP.timeline({
				delay: 0.5,
			})

			this.animateOut.to(this.elements.titleSpans, {
				duration: 1.5,
				ease: 'expo.out',
				stagger: 0.1,
				y: '100%',
			})

			this.animateOut.to(
				this.elements.numberText,
				{
					duration: 1.5,
					ease: 'expo.out',
					stagger: 0.1,
					y: '100%',
				},
				'-=1.4'
			)

			this.animateOut.to(
				this.element,
				{
					duration: 1.5,
					ease: 'expo.out',
					autoAlpha: 0,
				},
				'-=1'
			)

			this.animateOut.call((_) => {
				this.emit('completed')
			})
		})
	}

	destroy() {
		this.element.parentNode.removeChild(this.element)
	}
}
