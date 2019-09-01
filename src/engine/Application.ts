import * as PIXI from 'pixi.js'
import { Navigation } from './lib/navigation/Navigation'
import { Logger, Log } from './lib/Logger'
import * as Tween from '@tweenjs/tween.js'
import { Viewport } from 'pixi-viewport'

interface ApplicationOptions {
  autoStart?: boolean
  width?: number
  height?: number
  view?: HTMLCanvasElement
  transparent?: boolean
  autoDensity?: boolean
  antialias?: boolean
  preserveDrawingBuffer?: boolean
  resolution?: number
  forceCanvas?: boolean
  backgroundColor?: number
  clearBeforeRender?: boolean
  forceFXAA?: boolean
  powerPreference?: string
  sharedTicker?: boolean
  sharedLoader?: boolean
  resizeTo?: Window | HTMLElement
  logLevel?: Log | number
  logContext?: string[]
}

export class Application extends PIXI.Application {
  public readonly $logger = new Logger('Application')
  public $router: Navigation
  public $camera: Viewport
  static $instance: Application

  constructor(options: ApplicationOptions = {}) {
    super(options)

    options = Object.assign(
      {
        logLevel: Log.ERROR,
        logContext: null,
      },
      options,
    )

    this.$logger.context = options.logContext
    this.$logger.level = options.logLevel

    this.$router = new Navigation(this)

    window.addEventListener('resize', this.onResize.bind(this))

    this.onResize()

    this.renderer.autoDensity = true

    this.ticker.add(() => Tween.update(this.ticker.lastTime))
  }

  static get(options?: ApplicationOptions) {
    if (!this.$instance) this.$instance = new Application(options)
    return this.$instance
  }

  getResource(id: any) {
    return this.loader.resources[id]
  }

  getTexture(id: any) {
    const resource = this.getResource(id)
    return resource && resource.texture
  }

  getSpriteSheet(id: any) {
    const resource = this.getResource(id)
    return resource && resource.spritesheet
  }

  onResize() {
    // resize renderer
    this.renderer.resize(window.innerWidth, window.innerHeight)
    this.view.width = window.innerWidth
    this.view.height = window.innerHeight
    this.$logger.info(`As dimensões da tela mudaram para ${this.view.width}x${this.view.height}`)
  }
}
