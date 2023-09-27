const path = require('path');

module.exports = {
  mode: "development",
  entry: {
    demo: path.resolve(__dirname, 'js/demo.js')
  },
  output: {
    filename: 'bundle.js',
    path: __dirname
  }
};
