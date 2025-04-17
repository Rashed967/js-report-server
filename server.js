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

// Register Handlebars helpers
registerHelpers(handlebars);

// Import routes
const pdfRoutes = require('./routes/pdf-routes');

// create an express app
const app = express();

// Store jsreport instance in app for use in routes
app.set('jsreport', jsreport);

// Increase JSON payload limit to 50MB
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// static folder to serve fonts
const fontsPath = path.join(__dirname, 'fonts');
app.use('/fonts', express.static(fontsPath));

// Use PDF routes
app.use('/api/pdf', pdfRoutes);

// Generate registration receipt
app.post('/generate-report', async (req, res) => {
  try {
    const data = req.body;
    console.log("Generating registration receipt for:", data.madrasahDetails.name);

    // Load template
    const templateContent = loadTemplate('registration-receipt.html');
    
    // Compile template
    const template = handlebars.compile(templateContent);
    
    // Render HTML
    const html = template(data);
    
    // Generate PDF
    const response = await jsreport.render({
      template: {
        content: html,
        engine: 'handlebars',
        recipe: 'chrome-pdf',
        chrome: {
          marginTop: '0mm',
          marginRight: '0mm',
          marginBottom: '0mm',
          marginLeft: '0mm',
          format: 'A5',
          landscape: false,
          scale: 1,
          displayHeaderFooter: false,
          printBackground: true
        }
      },
      data: data
    });

    // Send PDF response
    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', `attachment; filename="registration-receipt.pdf"`);
    res.send(response.content);

  } catch (error) {
    console.error('Error generating registration receipt:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating registration receipt',
      error: error.message
    });
  }
});

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