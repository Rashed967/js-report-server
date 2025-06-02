const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const { loadTemplate, registerHelpers, formatBnDate } = require('../../helpers/pdf-helpers');

// Placeholder for PDF generation library
// const pdf = require('html-pdf');

router.post('/admit-card-personal', async (req, res) => {
    try {
        const admitCardData = req.body;

        // Prepare data for template - formatBnDate will be called within the template
        const templateData = {
            ...admitCardData
            // Removed: birthDate: formatBnDate(admitCardData.birthDate)
        };

        // Load and compile the HTML template
        const templateContent = loadTemplate('admit-card-template.html');
        const template = handlebars.compile(templateContent);

        // Register helpers (needed for formatBnDate inside the template)
        registerHelpers(handlebars);

        // Render HTML
        const html = template(templateData);

        // Get jsreport instance from the app
        const jsreport = req.app.get('jsreport');

        // Generate PDF using jsreport
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
                    displayHeaderFooter: false,
                    printBackground: true
                }
            }
        });

        // Send PDF response
        res.set('Content-Type', 'application/pdf');
        res.set('Content-Disposition', `attachment; filename="admit-card.pdf"`);
        res.send(response.content);

    } catch (error) {
        console.error('Error generating Admit Card PDF:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating Admit Card PDF',
            error: error.message
        });
    }
});

module.exports = router; 