/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/demo.js":
/*!********************!*\
  !*** ./js/demo.js ***!
  \********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const CanvasFont = __webpack_require__(/*! ../../main.js */ \"../main.js\")\n\nconst canvas = document.querySelector( \"canvas\" )\n\nlet context = canvas.getContext(\"2d\")\nlet font = new CanvasFont( canvas )\n\ncontext.fillStyle = \"#000000\"\n\nfont.setAttribute( CanvasFont.FontAttributes.Size, 20 )\nfont.compileFont()\n\nfunction drawTextWithBoundaries( x, y, text, anchor ){\n  let { drawX, drawY }  = font.getDrawPosition( x, y, text, anchor )\n  let { width, height } = font.getTextboxSize( text )\n\n  context.strokeStyle = \"#0000FF\"\n\n  context.strokeRect( drawX, drawY, width, height )\n\n  font.fillText( x, y, text, anchor )\n}\n\nconst crossWidth = 100\nconst crossHeight = 50\n\nfunction drawTextAnchorRepresentation( x, y, text, anchor ){\n  context.strokeStyle = \"#FF0000\"\n\n  context.beginPath()\n\n  context.moveTo( x,              y + crossHeight / 2 )\n  context.lineTo( x + crossWidth, y + crossHeight / 2 )\n\n  context.stroke()\n\n  context.closePath()\n\n  context.beginPath()\n\n  context.moveTo( x + crossWidth / 2, y               )\n  context.lineTo( x + crossWidth / 2, y + crossHeight )\n\n  context.stroke()\n\n  context.closePath()\n\n  drawTextWithBoundaries( x + crossWidth / 2, y + crossHeight / 2, text, anchor )\n}\n\nfunction draw() {\n  let anchors = Object.values( CanvasFont.FontAnchors )\n\n  for( let index = 0; index < anchors.length; index++ ){\n    let anchor = anchors[ index ]\n\n    let xMulti = index % 3\n    let yMulti = Math.floor( index / 3 )\n    drawTextAnchorRepresentation( 100 + 300 * xMulti, 10 + 200 * yMulti, anchor.description, anchor )\n  }\n}\n\ndraw()\n\n//# sourceURL=webpack:///./js/demo.js?");

/***/ }),

/***/ "../main.js":
/*!******************!*\
  !*** ../main.js ***!
  \******************/
/***/ ((module) => {

eval("/**\n * Creates a easy font API for canvas.\n */\nclass CanvasFont {\n  static FontAttributes = {\n    Size:   Symbol(\"FontSize\"),\n    Family: Symbol(\"FontFamily\"),\n    Style:  Symbol(\"FontStyle\"),\n  }\n\n  static FontAnchors = {\n    TopLeft:      Symbol(\"AnchorTopLeft\"),\n    TopCenter:    Symbol(\"AnchorTopCenter\"),\n    TopRight:     Symbol(\"AnchorTopRight\"),\n    Left:         Symbol(\"AnchorLeft\"),\n    Center:       Symbol(\"AnchorCenter\"),\n    Right:        Symbol(\"AnchorRight\"),\n    BottomLeft:   Symbol(\"AnchorBottomLeft\"),\n    BottomCenter: Symbol(\"AnchorBottomCenter\"),\n    BottomRight:  Symbol(\"AnchorBottomRight\")\n  }\n\n  /**\n   * Initializes the canvas font API.\n   * \n   * @param { HTMLCanvasElement } canvas \n   */\n  constructor( canvas ){\n    this.canvas  = canvas\n    this.context = canvas.getContext(\"2d\")\n\n    // Canvas defaults baseline to bottom, which causes problems.\n    // (By drawing in bottom-left anchor and swapping measureText's ascent and descent properties.)\n    // It is best to use top baseline, since it's easier to calculate positions and follows the common canvas system.\n    this.context.textBaseline = \"top\"\n\n    this.fontSize   = 12\n    this.fontFamily = \"sans-serif\"\n    this.fontStyle  = \"normal\"\n  }\n\n  /**\n   * Sets a font attribute.\n   * \n   * @param { Symbol } attribute \n   * @param { Number | String } value \n   */\n  setAttribute( attribute, value ){\n    switch( attribute ){\n      case CanvasFont.FontAttributes.Size: {\n        if( typeof value != \"number\" ) break;\n\n        this.fontSize = value\n        break;\n      }\n\n      case CanvasFont.FontAttributes.Family: {\n        if( typeof value != \"string\" ) break;\n\n        this.fontFamily = value\n        break;\n      }\n\n      case CanvasFont.FontAttributes.Style: {\n        if( typeof value != \"string\" ) break;\n\n        this.fontStyle = value\n        break;\n      }\n\n      default: {\n        console.warn( \"Attribute not found; got \" + attribute )\n      }\n    }\n  }\n\n  compileFont(){\n    this.context.font = `${this.fontStyle} ${this.fontSize}px ${this.fontFamily}`\n  }\n\n  getTextboxSize( text ){\n    let measures = this.context.measureText( text )\n\n    return {\n      width:  measures.width,\n      height: measures.actualBoundingBoxDescent - measures.actualBoundingBoxAscent\n    }\n  }\n\n  getAnchorPosition( width, height, anchor ){\n    let anchorX = 0;\n    let anchorY = 0;\n\n    if(\n      anchor == CanvasFont.FontAnchors.TopCenter    ||\n      anchor == CanvasFont.FontAnchors.Center       ||\n      anchor == CanvasFont.FontAnchors.BottomCenter \n    ) {\n      anchorX = Math.round( width / 2 )\n    } else if(\n      anchor == CanvasFont.FontAnchors.TopRight    ||\n      anchor == CanvasFont.FontAnchors.Right       ||\n      anchor == CanvasFont.FontAnchors.BottomRight \n    ) {\n      anchorX = width\n    }\n\n    if( \n      anchor == CanvasFont.FontAnchors.Left   ||\n      anchor == CanvasFont.FontAnchors.Center ||\n      anchor == CanvasFont.FontAnchors.Right\n    ) {\n      anchorY = Math.round( height / 2 )\n    } else if(\n      anchor == CanvasFont.FontAnchors.BottomLeft   ||\n      anchor == CanvasFont.FontAnchors.BottomCenter ||\n      anchor == CanvasFont.FontAnchors.BottomRight\n    ) {\n      anchorY = height\n    }\n\n    return { anchorX, anchorY }\n  }\n\n  getDrawPosition( x, y, text, anchor ) {\n    let { width, height } = this.getTextboxSize( text )\n\n    let { anchorX, anchorY } = this.getAnchorPosition( width, height, anchor )\n\n    let drawX = x - anchorX\n    let drawY = y - anchorY\n\n    return { drawX, drawY }\n  }\n\n  isWithinCanvas( drawX, drawY, text ){\n    let { width, height } = this.getTextboxSize( text )\n\n    if( drawX + width  < 0 || drawX > this.canvas.width  ) return false \n    if( drawY + height < 0 || drawY > this.canvas.height ) return false \n\n    return true\n  }\n\n  fillText( x, y, text, anchor = this.FontAnchors.TopLeft ){\n    let { drawX, drawY } = this.getDrawPosition( x, y, text, anchor )\n    \n    if( ! this.isWithinCanvas( drawX, drawY ) ) return false\n\n    this.context.fillText( text, drawX, drawY )\n\n    return true\n  }\n\n  strokeText( x, y, text, anchor = this.FontAnchors.TopLeft ){\n    let { drawX, drawY } = this.getDrawPosition( x, y, text, anchor )\n    \n    if( ! this.isWithinCanvas( drawX, drawY ) ) return false\n\n    this.context.strokeText( text, drawX, drawY )\n\n    return true\n  }\n}\n\nmodule.exports = CanvasFont\n\n//# sourceURL=webpack:///../main.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./js/demo.js");
/******/ 	
/******/ })()
;