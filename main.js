/**
 * Creates a easy font API for canvas.
 */
class CanvasFont {
  static FontAttributes = {
    Size:   Symbol("FontSize"),
    Family: Symbol("FontFamily"),
    Style:  Symbol("FontStyle"),
  }

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

    this.fontSize   = 12
    this.fontFamily = "sans-serif"
    this.fontStyle  = "normal"

    this.autoCompile = true
    this.dirtyFont   = false
  }

  /**
   * Sets a font attribute.
   * 
   * @param { Symbol } attribute 
   * @param { Number | String } value 
   */
  setAttribute( attribute, value ){
    switch( attribute ){
      case CanvasFont.FontAttributes.Size: {
        this.fontSize = value
        break;
      }

      case CanvasFont.FontAttributes.Family: {
        this.fontFamily = value
        break;
      }

      case CanvasFont.FontAttributes.Style: {
        this.fontStyle = value
        break;
      }

      default: {
        console.warn( "Attribute not found; got " + attribute )
      }
    }

    if( this.autoCompile ) this.compileFont()
    else this.dirtyFont = true
  }

  /**
   * Sets auto compile flag.
   * Auto compilation makes sure when a attribute is set, the font attribute of 2d context is always up.
   * @param { Boolean } value 
   * @returns 
   */
  setAutoCompile( value ){
    if( typeof value != "boolean" ) return

    this.autoCompile = value
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

  /**
   * Warns the developer if font attributes were modified without compiling the font.
   */
  dirtyFontCheck(){
    if( this.dirtyFont ) console.warn( "Font attributes are dirty. Maybe forgot to manually compile?" )
  }
}

module.exports = CanvasFont