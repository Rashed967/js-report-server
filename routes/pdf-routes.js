/**
 * PDF Generation Routes - Main Index
 */

const express = require('express');
const router = express.Router();

// Import specific PDF route files
const generalPdfRoutes = require('./pdf/general-pdf-routes');
const examineeListRoutes = require('./pdf/examinee-list-routes');
const markazStudentListRoutes = require('./pdf/markaz-student-list-routes');

// Mount the specific route files under the /api/pdf base path
router.use(generalPdfRoutes);
router.use(examineeListRoutes);
router.use(markazStudentListRoutes);

// We can keep global PDF related setup here if needed
// For example, global handlebars helper registration if they apply to all PDF templates
const handlebars = require('handlebars');
const { registerHelpers } = require('../helpers/pdf-helpers');
registerHelpers(handlebars); // Register global helpers

// Additional global helpers (if any)
handlebars.registerHelper('add', function(value, addition) {
  return value + addition;
});

module.exports = router; 