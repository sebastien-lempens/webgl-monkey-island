import * as THREE from 'three'
import Webgl from './Webgl'
export default class App {
  constructor() {
    this.debug = true
    this.xr = false 
    window.app = this
    this.clock = new THREE.Clock()
    this.timer = null
    this.isMobile = window.matchMedia('(max-width:1024px)').matches

    this.initParams()
    this.initGUI()
    this.initWebgl()
    this.initEventListeners()
    this.initHtml()

  }
  async initWebgl() {
    this.webgl = new Webgl()
  }
  initParams() {
    this.params = {
      scene: {
        backgroundColor: '#060913',
        reveal: this.debug ? 800 : -500,
        effect: {
          bloom: {
            strength: 0.35,
            radius: 1.2,
            threshold: 0.0435,
          },
          bokeh: {
            aperture: this.debug ? 0.0 : 0.002,
            focus: 0.0,
          },
        },
      },
      camera: {
        helper: false,
        orbitControl: false,
        unlock: false,
        position: {
          x: 0.02,
          y: 0.023,
          z: 0.156,
        },
        posXvalue: '',
        posYvalue: '',
        posZvalue: '',
      },
      lights: {
        ambiant: {
          intensity: 2.5,
          color: '#0b154c',
        },
        spot: {
          intensity: 2.5,
          angle: 0.14,
          penumbra: 1,
          position: {
            x: -0.167,
            y: 0.455,
            z: -1.071,
          },
          color: '#3296d8',
          helper: false,
        },
        pointlight: {
          color: '#ff4800',
          distance: 0.2,
          intensity: 0.7,
          decay: 0.5,
          position: {
            x: -0.065,
            y: 0.035,
            z: -0.03,
          },
          helper: false,
        },
        pointlight2: {
          position: {
            x: -0.057,
            y: 0.035,
            z: -0.083,
          },
          helper: false,
        },
      },
    }
  }
  async initGUI() {
    if(this.xr) return;
    const { getTweakPane } = await import('../utils.js')
    this.tweakPane = getTweakPane(this)
    this.tweakPane.containerElem_.style.opacity = this.debug ? 1 : 0
    const legend = document.createElement('legend')
    legend.innerHTML = 'play with tweaks?'
    this.tweakPane.containerElem_.append(legend)
    this.tweakPane.containerElem_.addEventListener(
      'mouseenter',
      (e) => {
        legend.style.animation = 'fadeOut 1s ease forwards'
      },
      { once: true }
    )
    if (this.isMobile) {
      const width = window.innerWidth - 16
      this.tweakPane.containerElem_.style.width = `${width}px`
      this.tweakPane.containerElem_.style.left = '8px'
      this.tweakPane.containerElem_.style.right = 'auto'
    }
  }
  initEventListeners() {
    window.addEventListener('resize', this.resize.bind(this))
  }
  initHtml() {
    return
    let linkInfo = document.querySelector('a.credit__linkInfo')
    if (linkInfo) {
      linkInfo.addEventListener('click', async (e) => {
        let el =
          document.querySelector('.MIT_info') || (await generateInfoPage())
        await new Promise((resolve) => setTimeout(resolve, 150))
        el.classList.add('MIT_info--enter')
        el.addEventListener(
          'click',
          (e) => {
            const { target } = e
            if (!target.classList.contains('MIT_info')) return
            el.classList.add('MIT_info--leave')
            el.addEventListener(
              'transitionend',
              () => {
                el.classList.remove('MIT_info--enter', 'MIT_info--leave')
              },
              { once: true }
            )
            e.preventDefault()
          },
          true
        )
      })
    }
    const generateInfoPage = async () => {
      const { infoDiv } = await import('../../static/assets/js/info.js')
      const el = infoDiv
      document.querySelector('body').append(el)
      return el
    }
  }
  resize() {
    if (this.webgl) {
      this.webgl.resize()
    }
  }
}
