/**
 * General PDF Generation Route
 */

const express = require('express');
const router = express.Router();
const { loadTemplate, prepareData } = require('../../helpers/pdf-helpers');

/**
 * Generate PDF report
 * POST /api/pdf/generate
 */
router.post('/generate', async (req, res) => {
  try {
    // Get data from request
    const data = req.body;
    
    // Prepare data for template
    const templateData = prepareData(data);
    
    // Load template
    const templateContent = loadTemplate('report-template.html');
    
    // Compile template
    const handlebars = require('handlebars'); // Require handlebars locally for this route file
    // Note: Helpers should be registered where handlebars is compiled or before.
    // Assuming registerHelpers is called elsewhere or helpers are simple/inline for report-template.html
    // If not, we might need to adjust where helpers are registered.
    const template = handlebars.compile(templateContent);
    
    // Render HTML
    const html = template(templateData);
    
    // Generate PDF using jsreport
    const jsreport = req.app.get('jsreport');
    
    const response = await jsreport.render({
      template: {
        content: html,
        engine: 'handlebars',
        recipe: 'chrome-pdf'
      },
      data: templateData
    });
    
    // Send PDF response
    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', 'attachment; filename="report.pdf"');
    res.send(response.content);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating PDF report',
      error: error.message
    });
  }
});

module.exports = router; 