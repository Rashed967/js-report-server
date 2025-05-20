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
const bodyParser = require('body-parser');
const cors = require('cors');
const handlebars = require('handlebars'); // Import Handlebars
const { loadTemplate, registerHelpers } = require('./helpers/pdf-helpers');

const stylesPath = path.join(__dirname, 'styles');

// Register Handlebars helpers
registerHelpers(handlebars);

// Import routes
const pdfRouter = require('./routes/pdf/pdf-router');

// create an express app
const app = express();

// Store jsreport instance in app for use in routes
app.set('jsreport', jsreport);

// Increase JSON payload limit to 50MB
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use('/styles', express.static(stylesPath));

// static folder to serve fonts
const fontsPath = path.join(__dirname, 'fonts');
app.use('/fonts', express.static(fontsPath));

// Use PDF routes
app.use('/api/pdf', pdfRouter);

// Start express app on port 5490
app.listen(5490, () => {
  console.log('Express server running on http://localhost:5490');
});

// initialize jsreport
jsreport.init().then(() => {

  app.get('/hello', (req, res) => {
    res.send('Hello World');
  });
}).catch((e) => {
  console.error(e);
});