/**
 * Registration Receipt PDF Generation Route
 */

const express = require('express');
const router = express.Router();
const { loadTemplate } = require('../../helpers/pdf-helpers');
const handlebars = require('handlebars'); // Require handlebars locally

/**
 * Generate Registration Receipt PDF
 * POST /api/pdf/registration-receipt/generate
 */
router.post('/generate-pre-examinee-receipt', async (req, res) => {
  try {
    const data = req.body;
    console.log("Generating pre-examinee registration receipt for:", data.madrasahDetails.name);

    // Load template
    const templateContent = loadTemplate('registration-receipt.html');

    // Compile template
    const template = handlebars.compile(templateContent);

    // Render HTML
    const html = template(data);

    // Generate PDF
    const jsreport = req.app.get('jsreport');

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
    const filename = encodeURIComponent('pre-examinee-registration-receipt.pdf'); // Use encodeURIComponent for filename
    res.set('Content-Disposition', `attachment; filename="pre-examinee-registration-receipt.pdf"; filename*=UTF-8''${filename}`);
    res.send(response.content);

  } catch (error) {
    console.error('Error generating pre-examinee registration receipt:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating pre-examinee registration receipt',
      error: error.message
    });
  }
});

module.exports = router; 