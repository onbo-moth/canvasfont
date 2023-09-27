/**
 * Creates a easy font API for canvas.
 */
class CanvasFont {
  static FontAnchors = {
    TopLeft:      Symbol("AnchorTopLeft"),
    TopCenter:    Symbol("AnchorTopCenter"),
    TopRight:     Symbol("AnchorTopRight"),
    Left:         Symbol("AnchorLeft"),
    Center:       Symbol("AnchorCenter"),
    Right:        Symbol("AnchorRight"),
    BottomLeft:   Symbol("AnchorBottomLeft"),
    BottomCenter: Symbol("AnchorBottomCenter"),
    BottomRight:  Symbol("AnchorBottomRight")
  }

  /**
   * Initializes the canvas font API.
   * 
   * @param { HTMLCanvasElement } canvas 
   */
  constructor( canvas ){
    this.canvas  = canvas
    this.context = canvas.getContext("2d")

    // Canvas defaults baseline to bottom, which causes problems.
    // (By drawing in bottom-left anchor and swapping measureText's ascent and descent properties.)
    // It is best to use top baseline, since it's easier to calculate positions and follows the common canvas system.
    this.context.textBaseline = "top"

    this._fontSize   = 12
    this._fontFamily = "sans-serif"
    this._fontStyle  = "normal"
  }

  get fontSize() {
    return this._fontSize
  }

  set fontSize( value ) {
    if( typeof value != "number" ) return

    this._fontSize = value
    this.compileFont()
  }

  get fontFamily() {
    return this._fontFamily
  }

  set fontFamily( value ) {
    if( typeof value != "string" ) return

    this._fontFamily = value
    this.compileFont()
  }

  get fontStyle() {
    return this._fontStyle
  }

  set fontStyle( value ) {
    if( typeof value != "string" ) return

    this._fontStyle = value
    this.compileFont()
  }

  /**
   * Sets the font attribute for the 2d context.
   */
  compileFont(){
    this.context.font = `${this.fontStyle} ${this.fontSize}px ${this.fontFamily}`

    this.dirtyFont = false
  }

  /**
   * Gets size of text's bounding box.
   * Doesn't check for ideographic / alphabetic baselines.
   * 
   * @param { String } text 
   * @returns 
   */
  getTextboxSize( text ){
    let measures = this.context.measureText( text )

    return {
      width:  measures.width,
      height: measures.actualBoundingBoxDescent - measures.actualBoundingBoxAscent
    }
  }

  /**
   * Returns anchor offset position for textbox width and height.
   * 
   * @param { Number } width 
   * @param { Number } height 
   * @param { Symbol } anchor 
   * @returns { { anchorX: Number, anchorY: number } }
   */
  getAnchorPosition( width, height, anchor ){
    let anchorX = 0;
    let anchorY = 0;

    if(
      anchor == CanvasFont.FontAnchors.TopCenter    ||
      anchor == CanvasFont.FontAnchors.Center       ||
      anchor == CanvasFont.FontAnchors.BottomCenter 
    ) {
      anchorX = Math.round( width / 2 )
    } else if(
      anchor == CanvasFont.FontAnchors.TopRight    ||
      anchor == CanvasFont.FontAnchors.Right       ||
      anchor == CanvasFont.FontAnchors.BottomRight 
    ) {
      anchorX = width
    }

    if( 
      anchor == CanvasFont.FontAnchors.Left   ||
      anchor == CanvasFont.FontAnchors.Center ||
      anchor == CanvasFont.FontAnchors.Right
    ) {
      anchorY = Math.round( height / 2 )
    } else if(
      anchor == CanvasFont.FontAnchors.BottomLeft   ||
      anchor == CanvasFont.FontAnchors.BottomCenter ||
      anchor == CanvasFont.FontAnchors.BottomRight
    ) {
      anchorY = height
    }

    return { anchorX, anchorY }
  }

  /**
   * Gets the position for drawing text, offseting it by anchor.
   * 
   * @param { Number } x 
   * @param { Number } y 
   * @param { String } text 
   * @param { Symbol } anchor 
   * @returns { { drawX: Number, drawY: Number } }
   */
  getDrawPosition( x, y, text, anchor ) {
    let { width, height } = this.getTextboxSize( text )

    let { anchorX, anchorY } = this.getAnchorPosition( width, height, anchor )

    let drawX = x - anchorX
    let drawY = y - anchorY

    return { drawX, drawY }
  }

  /**
   * Checks if the textbox will appear on canvas.
   * 
   * @param { Number } drawX 
   * @param { Number } drawY 
   * @param { String } text 
   * @returns { Boolean }
   */
  isWithinCanvas( drawX, drawY, text ){
    let { width, height } = this.getTextboxSize( text )

    if( drawX + width  < 0 || drawX > this.canvas.width  ) return false 
    if( drawY + height < 0 || drawY > this.canvas.height ) return false 

    return true
  }

  /**
   * Fills text in a position and anchor.
   * 
   * @param { Number } x 
   * @param { Number } y 
   * @param { String } text 
   * @param { Symbol } anchor 
   * @returns { Boolean } if text has been drawn.
   */
  fillText( x, y, text, anchor = this.FontAnchors.TopLeft ){
    this.dirtyFontCheck()

    let { drawX, drawY } = this.getDrawPosition( x, y, text, anchor )
    
    if( ! this.isWithinCanvas( drawX, drawY ) ) return false

    this.context.fillText( text, drawX, drawY )

    return true
  }

  /**
   * Strokes text in a position and anchor.
   * 
   * @param { Number } x 
   * @param { Number } y 
   * @param { String } text 
   * @param { Symbol } anchor 
   * @returns { Boolean } if text has been drawn.
   */
  strokeText( x, y, text, anchor = this.FontAnchors.TopLeft ){
    this.dirtyFontCheck()

    let { drawX, drawY } = this.getDrawPosition( x, y, text, anchor )
    
    if( ! this.isWithinCanvas( drawX, drawY ) ) return false

    this.context.strokeText( text, drawX, drawY )

    return true
  }
}

module.exports = CanvasFont