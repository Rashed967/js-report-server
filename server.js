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

// create an express app
const app = express();


// static folder to serve fonts
const fontsPath = path.join(__dirname, 'fonts');
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use('/fonts', express.static(fontsPath));

// Start express app on port 5488
app.listen(5490, () => {
  console.log('Express server running on http://localhost:5488');
});

// initialize jsreport
jsreport.init().then(() => {

  // API endpoint to generate PDF report
  app.post('/generate-report', (req, res) => {
    console.log("generate-report");
    const data = req.body;
    console.log(data);
    const templateName = '/preRegistationReport/myTemplate';

    jsreport.render({
      template: {
        name: templateName,
      },
      data: data,
      options: {
        reportName: 'নিবন্ধন_রিপোর্ট_{{registrationData.receiptNo}}'
      }
    }).then((response) => {
      console.log(response);
      const pdfBuffer = response.content;
      res.set("Content-Disposition", `attachment; filename="report.pdf"`);
      res.set("Content-Type", "application/pdf");
      res.send(pdfBuffer);
    }).catch((e) => {
      console.error(e);
      res.status(500).send('Error generating PDF report');
    });
  });

  app.get('/hello', (req, res) => {
    res.send('Hello World');
  });
}).catch((e) => {
  console.error(e);
});