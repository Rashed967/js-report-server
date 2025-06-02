/**
 * PDF Generation Routes - Main Router
 */

const express = require('express');
const router = express.Router();

// Import specific PDF route files
const generalPdfRoutes = require('./general-pdf-routes');
const examineeListRoutes = require('./examinee-list-routes');
const markazStudentListRoutes = require('./markaz-student-list-routes');
// Import the new registration receipt routes
const registrationReceiptRoutes = require('./registration-receipt-routes');
const admitCardPersonalRoutes = require('./admit-card-personal-routes');

// Mount the specific route files under the /api/pdf base path (handled in server.js)
router.use(generalPdfRoutes);
router.use(examineeListRoutes);
router.use(markazStudentListRoutes);
router.use(registrationReceiptRoutes); // Mount registration receipt routes directly under /api/pdf
router.use(admitCardPersonalRoutes);

// We can keep global PDF related setup here if needed
// For example, global handlebars helper registration if they apply to all PDF templates
const handlebars = require('handlebars');
const { registerHelpers } = require('../../helpers/pdf-helpers');
registerHelpers(handlebars); // Register global helpers

// Additional global helpers (if any)
handlebars.registerHelper('add', function(value, addition) {
  return value + addition;
});

// Export the router
module.exports = router; 