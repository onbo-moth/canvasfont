const CanvasFont = require("../../main.js")

const canvas = document.querySelector( "canvas" )

let context = canvas.getContext("2d")
let font = new CanvasFont( canvas )

context.fillStyle = "#000000"

font.setAttribute( CanvasFont.FontAttributes.Size, 20 )
font.compileFont()

function drawTextWithBoundaries( x, y, text, anchor ){
  let { drawX, drawY }  = font.getDrawPosition( x, y, text, anchor )
  let { width, height } = font.getTextboxSize( text )

  context.strokeStyle = "#0000FF"

  context.strokeRect( drawX, drawY, width, height )

  font.fillText( x, y, text, anchor )
}

const crossWidth = 100
const crossHeight = 50

function drawTextAnchorRepresentation( x, y, text, anchor ){
  context.strokeStyle = "#FF0000"

  context.beginPath()

  context.moveTo( x,              y + crossHeight / 2 )
  context.lineTo( x + crossWidth, y + crossHeight / 2 )

  context.stroke()

  context.closePath()

  context.beginPath()

  context.moveTo( x + crossWidth / 2, y               )
  context.lineTo( x + crossWidth / 2, y + crossHeight )

  context.stroke()

  context.closePath()

  drawTextWithBoundaries( x + crossWidth / 2, y + crossHeight / 2, text, anchor )
}

function draw() {
  let anchors = Object.values( CanvasFont.FontAnchors )

  for( let index = 0; index < anchors.length; index++ ){
    let anchor = anchors[ index ]

    let xMulti = index % 3
    let yMulti = Math.floor( index / 3 )
    drawTextAnchorRepresentation( 100 + 300 * xMulti, 10 + 200 * yMulti, anchor.description, anchor )
  }
}

draw()