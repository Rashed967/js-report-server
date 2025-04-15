/**
 * Helper functions for PDF generation
 */

const fs = require('fs');
const path = require('path');

/**
 * Loads a template file
 * @param {string} templateName - Name of the template file
 * @returns {string} - Template content
 */
const loadTemplate = (templateName) => {
  const templatePath = path.join(__dirname, '..', 'templates', templateName);
  return fs.readFileSync(templatePath, 'utf8');
};

/**
 * Registers Handlebars helpers
 * @param {Object} handlebars - Handlebars instance
 */
const registerHelpers = (handlebars) => {
  // Format date helper
  handlebars.registerHelper('formatDate', function(date) {
    return new Date(date).toLocaleString();
  });
};

/**
 * Prepares data for the template
 * @param {Object} data - Raw data from request
 * @returns {Object} - Processed data for template
 */
const prepareData = (data) => {
  return {
    ...data,
    now: new Date()
  };
};

module.exports = {
  loadTemplate,
  registerHelpers,
  prepareData
}; 