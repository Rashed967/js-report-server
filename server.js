const jsreport = require('jsreport')({
  // Strictly disable jsreport's built-in server
  httpPort: 0,
  // Disable studio UI
  studio: {
    enabled: false
  },
  // Disable standalone server
  standalone: false,
  // Disable all UI components
  extensions: {
    studio: {
      enabled: false
    },
    'express': {
      enabled: false
    },
    'chrome-pdf': {
      launchOptions: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    }
  },
  // Disable all UI routes
  express: {
    enabled: false
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

// Initialize jsreport first, then start the server
const startServer = async () => {
  try {
    // Get port from environment variable (for Render) or default to 5488
    const port = process.env.PORT || 5488;
    
    // Initialize jsreport first
    await jsreport.init();
    console.log('jsreport initialized successfully in embedded mode');
    
    // Start express server
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`Express server running on port ${port}`);
    });

    // Add test route
    app.get('/hello', (req, res) => {
      res.send('Hello World');
    });

  } catch (e) {
    console.error('Failed to initialize jsreport:', e);
    process.exit(1);
  }
};

startServer();