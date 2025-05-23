/**
 * Examinee List PDF Generation Route
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { loadTemplate } = require('../../helpers/pdf-helpers');

// Helper function to calculate total fee
function calculateTotalFee(examinees) {
  let totalFee = 0;
  examinees.forEach(examinee => {
    const isRegular = examinee.registrationType === 'নিয়মিত';
    const fee = isRegular ? 
      examinee.exam.registrationFeeForRegularStudent : 
      examinee.exam.registrationFeeForIrregularStudent;
    totalFee += fee;
  });
  return totalFee;
}

// Helper function to load and convert logo to base64
async function loadLogoAsBase64() {
  const logoPath = path.join(__dirname, '..', '..', 'assets', 'logo.png');
  const logoBuffer = fs.readFileSync(logoPath);
  return logoBuffer.toString('base64');
}

/**
 * Generate Examinee List PDF
 * POST /api/pdf/examinee-list
 */
router.post('/examinee-list', async (req, res) => {
  try {
    // Get data from request
    const { registeredExaminees, selectedExam, boardInfo, madrasah } = req.body;
    console.log('Generating examinee list for exam:', selectedExam.examName);
    
    if (!Array.isArray(registeredExaminees) || registeredExaminees.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or empty examinees data'
      });
    }

    // Group examinees by marhala
    const marhalaGroups = registeredExaminees.reduce((groups, examinee) => {
      const marhalaId = examinee.marhala.id;
      if (!groups[marhalaId]) {
        groups[marhalaId] = {
          marhala: examinee.marhala,
          examinees: []
        };
      }
      groups[marhalaId].examinees.push(examinee);
      return groups;
    }, {});

    // Convert groups object to array and sort examinees by roll number
    const marhalaGroupsArray = Object.values(marhalaGroups).map(group => ({
      ...group,
      examinees: group.examinees.sort((a, b) => {
        const rollA = parseInt(a.roll) || 0;
        const rollB = parseInt(b.roll) || 0;
        return rollA - rollB;
      })
    }));

    // Prepare template data
    const templateData = {
      marhalaGroups: marhalaGroupsArray,
      selectedExam,
      boardInfo,
      madrasah,
      examName: selectedExam.examName,
      calculateTotalFee: calculateTotalFee // Pass helper to template
    };

    // Load template
    const templateContent = loadTemplate('examinee-list-template.html');
    
    // Compile template
    const handlebars = require('handlebars'); // Require handlebars locally
    // Note: Helpers like 'enToBnNumber' are assumed to be registered globally
    const template = handlebars.compile(templateContent);
    
    // Render HTML
    const html = template(templateData);
    
    // Generate PDF using jsreport
    const jsreport = req.app.get('jsreport');
    
    const response = await jsreport.render({
      template: {
        content: html,
        engine: 'handlebars',
        recipe: 'chrome-pdf',
        chrome: {
          marginTop: '1cm',
          marginRight: '1cm',
          marginBottom: '1cm',
          marginLeft: '1cm',
          format: 'A4',
          landscape: true,
          displayHeaderFooter: false,
          printBackground: true
        }
      },
      data: templateData
    });
    
    // Send PDF response
    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', `attachment; filename="examinee-list.pdf"`);
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