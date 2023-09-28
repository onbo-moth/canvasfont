# canvasfont

An easy API for drawing text in HTML Canvas in 2d context.

Features:
- Easy management of font attributes
- Anchoring

## Drawing text

Drawing functions are similar to 2D context functions.

```js
let font = new CanvasFont( canvas );

font.fillText( 50, 50, "Hello World!" );
font.strokeText( 50, 100, "How are you?" )
```

## Setting attributes

CanvasFont allows for seperate assignment of font attributes, such size, family and style.

Examples:

```js
font.fontSize   =  24;
font.fontFamily = "monospace";
font.fontStyle  = "italic";
```

## Text anchoring.

Anchoring allows for placing text relative to a point in many positions.

Supported anchors are:
- TopLeft
- TopCenter
- TopRight
- Left
- Center
- Right
- BottomLeft
- BottomCenter
- BottomRight

which are found in `CanvasFont.FontAnchors`

Example:

```js
font.fillText( 50,  50,  "TopLeft");    // TopLeft is default.
font.fillText( 100, 100, "Center",      CanvasFont.fontAnchors.Center )
font.fillText( 150, 150, "BottomRight", CanvasFont.fontAnchors.BottomRight );
```

Demo of all anchors found in `demo/` folder.

## Build

Simply use webpack to make a bundle for web use.
