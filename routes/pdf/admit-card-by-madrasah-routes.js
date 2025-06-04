const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const { loadTemplate, registerHelpers } = require('../../helpers/pdf-helpers');

router.post('/admit-card-by-madrasah', async (req, res) => {
    try {
        const students = req.body;
        // console.log(students)

        // Validate input
        if (!Array.isArray(students) || students.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid input: Expected non-empty array of students'
            });
        }

        // Load and compile the HTML template
        const templateContent = loadTemplate('admit-card-template.html');
        const template = handlebars.compile(templateContent);

        // Register helpers
        registerHelpers(handlebars);

        // Generate HTML for each student
        const htmlContents = students.map(student => {

            // Handle null roll number
            if (student.roll === null) {
                student.roll = '';
            }

            return template(student);
        });

        // Combine all HTML contents with page breaks
        const combinedHtml = htmlContents.join('<div style="page-break-after: always;"></div>');

        // Get jsreport instance from the app
        const jsreport = req.app.get('jsreport');

        // Generate PDF using jsreport
        const response = await jsreport.render({
            template: {
                content: combinedHtml,
                engine: 'handlebars',
                recipe: 'chrome-pdf',
                chrome: {
                    marginTop: '1cm',
                    marginRight: '1cm',
                    marginBottom: '1cm',
                    marginLeft: '1cm',
                    format: 'A5',
                    landscape: true,
                    displayHeaderFooter: false,
                    printBackground: true
                }
            }
        });

        // Send PDF response
        res.set('Content-Type', 'application/pdf');
        res.set('Content-Disposition', `attachment; filename="admit-cards.pdf"`);
        res.send(response.content);

    } catch (error) {
        console.error('Error generating Admit Cards PDF:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating Admit Cards PDF',
            error: error.message
        });
    }
});

module.exports = router; 