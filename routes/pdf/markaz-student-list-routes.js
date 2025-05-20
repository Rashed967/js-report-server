/**
 * Markaz List with Student List PDF Generation Route
 */

const express = require('express');
const router = express.Router();
const { loadTemplate, prepareData } = require('../../helpers/pdf-helpers');
const { prepareMarkazStudentListData } = require('../../helpers/markaz-student-list-helpers');
const handlebars = require('handlebars'); // Require handlebars locally

/**
 * Route: Generate Markaz List with Student List PDF
 * POST /api/pdf/generate-markaz-list-with-student-list
 */
router.post('/generate-markaz-list-with-student-list', async (req, res) => {
  try {
    let data = req.body;
    
    // Prepare data using the specific helper function
    data = prepareMarkazStudentListData(data);

    const jsreport = req.app.get('jsreport');
    const templateContent = loadTemplate('markaz-student-list.html');
    const template = handlebars.compile(templateContent);
    const html = template(data);
    const response = await jsreport.render({
      template: {
        content: html,
        engine: 'handlebars',
        recipe: 'chrome-pdf',
        chrome: {
          marginTop: '10mm',
          marginRight: '5mm',
          marginBottom: '10mm',
          marginLeft: '5mm',
          format: 'A4',
          landscape: false,
          scale: 1,
          displayHeaderFooter: false,
          printBackground: true
        }
      },
      data: data
    });
    const filename = encodeURIComponent('মারকায ভিত্তিক পরীক্ষার্থীদের তালিকা.pdf');
    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', `attachment; filename="markaz-student-list.pdf"; filename*=UTF-8''${filename}`);
    res.send(response.content);
  } catch (error) {
    console.error('Error generating markaz list with student list:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating markaz list with student list',
      error: error.message
    });
  }
});

module.exports = router; 