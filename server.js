const jsreport = require('jsreport')({
  extensions: {
    'chrome-pdf': {
      launchOptions: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    }
  }
});

const express = require('express');
const path = require('path');
const handlebars = require('handlebars'); // Import Handlebars

// create an express app
const app = express();

// static folder to serve fonts
const fontsPath = path.join(__dirname, 'fonts');
console.log('Fonts path:', fontsPath);  // Check the fonts path in console log

app.use('/fonts', express.static(fontsPath));

// initialize jsreport
jsreport.init().then(() => {
  console.log('jsreport server is running on http://localhost:5488');


  // Start express app on port 5488
  app.listen(5488, () => {
    console.log('Express server running on http://localhost:5488');
  });
}).catch((e) => {
  console.error(e);
});