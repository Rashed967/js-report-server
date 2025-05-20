/**
 * Helper functions for PDF generation
 */

const fs = require('fs');
const path = require('path');
const markazStudentListHelpers = require('./markaz-student-list-helpers'); // Require the specific helpers file

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
 * Loads a partial template
 * @param {string} partialName - Name of the partial template
 * @returns {string} - Partial template content
 */
const loadPartial = (partialName) => {
  const partialPath = path.join(__dirname, '..', 'templates', 'components', `${partialName}.html`);
  return fs.readFileSync(partialPath, 'utf8');
};

/**
 * Registers Handlebars helpers and partials
 * @param {Object} handlebars - Handlebars instance
 */
const registerHelpers = (handlebars) => {
  // Register partials
  handlebars.registerPartial('header', loadPartial('header'));

  // Register markaz-student-list specific helpers
  handlebars.registerHelper('getMarhalaStats', markazStudentListHelpers.getMarhalaStats);
  handlebars.registerHelper('getTotalMarhalaCount', markazStudentListHelpers.getTotalMarhalaCount);
  handlebars.registerHelper('marhalaNameMap', markazStudentListHelpers.marhalaNameMap);

  // Format date helper
  handlebars.registerHelper('formatDate', function(date) {
    return new Date(date).toLocaleString();
  });

  // Now local string helper
  handlebars.registerHelper('nowLocalStr', function() {
    return new Date().toLocaleDateString();
  });

  // Multiply helper
  handlebars.registerHelper('multiply', function(a, b) {
    return a * b;
  });

  // Equality helper
  handlebars.registerHelper('eq', function(a, b) {
    return a === b;
  });

  // English to Bengali number conversion
  handlebars.registerHelper('enToBnNumber', function(input) {
    const en = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  
    const str = input.toString();
    let result = '';
    for (let i = 0; i < str.length; i++) {
      const index = en.indexOf(str[i]);
      if (index !== -1) {
        result += bn[index];
      } else {
        result += str[i];
      }
    }
    return result;
  });

  // Debug English to Bengali number conversion
  handlebars.registerHelper('debugEnToBn', function(input) {
    if (input === undefined || input === null) return '⚠️ undefined';
    return handlebars.helpers.enToBnNumber(input);
  });

  // Format Bengali date
  handlebars.registerHelper('formatBnDate', function(isoString) {
    if (!isoString) return '';
  
    const dateOnly = isoString.split('T')[0];
    return handlebars.helpers.enToBnNumber(dateOnly);
  });

  // Get today's date in Bengali
  handlebars.registerHelper('todayBnDate', function() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
  
    const formatted = `${year}-${month}-${day}`;
    return handlebars.helpers.enToBnNumber(formatted);
  });

  // Multiply and convert to Bengali
  handlebars.registerHelper('multiplyBn', function(a, b) {
    const result = Number(a) * Number(b);
    return handlebars.helpers.enToBnNumber(result);
  });

  // Subtract and convert to Bengali
  handlebars.registerHelper('minusBn', function(a, b) {
    if (typeof a !== 'number') a = parseFloat(a);
    if (typeof b !== 'number') b = parseFloat(b);
    const result = a - b;
    return handlebars.helpers.enToBnNumber(result);
  });

  // Convert number to Bengali words
  handlebars.registerHelper('numberToBengaliWords', function(number, isTaka = false) {
    const units = ['', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়'];
    const teens = ['দশ', 'এগার', 'বার', 'তের', 'চৌদ্দ', 'পনের', 'ষোল', 'সতের', 'আঠার', 'ঊনিশ'];
    const tens = ['', 'দশ', 'বিশ', 'ত্রিশ', 'চল্লিশ', 'পঞ্চাশ', 'ষাট', 'সত্তর', 'আশি', 'নব্বই'];
    const scales = ['', 'হাজার', 'লক্ষ', 'কোটি'];
  
    if (number === 0) return 'শূন্য';
  
    function processGroup(n, scaleIndex) {
      if (n === 0) return '';
  
      let words = '';
  
      if (n > 99) {
        words += units[Math.floor(n / 100)] + 'শত ';
        n %= 100;
      }
  
      if (n > 19) {
        words += tens[Math.floor(n / 10)] + ' ';
        if (n % 10 > 0) words += units[n % 10] + ' ';
      } else if (n > 9) {
        words += teens[n - 10] + ' ';
      } else if (n > 0) {
        words += units[n] + ' ';
      }
  
      if (scaleIndex > 0 && words !== '') {
        words += scales[scaleIndex] + ' ';
      }
  
      return words;
    }
  
    let result = '';
    let remaining = number;
    let scaleIndex = 0;
  
    while (remaining > 0) {
      const group = remaining % 1000;
      if (group > 0) {
        result = processGroup(group, scaleIndex) + result;
      }
      remaining = Math.floor(remaining / 1000);
      scaleIndex++;
    }
  
    if (isTaka) {
      result += ' টাকা মাত্র';
    }
  
    return result.trim();
  });

  // Get total examinees slots
  handlebars.registerHelper('getTotalExamineesSlots', function(examineesPerMahala) {
    const totalExamineesSlots = examineesPerMahala.reduce((acc, current) => {
      return acc + current.regularExamineesSlots + current.irregularExamineesSlots;
    }, 0);
    return handlebars.helpers.enToBnNumber(totalExamineesSlots);
  });

  // Increment index (for serial numbers)
  handlebars.registerHelper('inc', function(value) {
    return parseInt(value) + 1;
  });

  // Marhala name map: expects exam object in root context
  // Moved to markaz-student-list-helpers.js
  // const marhalaNameMap = (exam) => { ... };

  // Get marhala stats: count and roll ranges for a madrasah's regesteredexamines
  // Moved to markaz-student-list-helpers.js
  // const getMarhalaStats = (regesteredexamines, marhalaId) => { ... };

  // Get total marhala count for all madrasahs under a markaz
  // Moved to markaz-student-list-helpers.js
  // const getTotalMarhalaCount = (allMadrasahWithDetails, marhalaId) => { ... };
};

/**
 * Prepares data for the template
 * @param {Object} data - Raw data from request
 * @returns {Object} - Processed data for template
 */
const prepareData = (data) => {
  // Apply specific data preparation based on template
  if (data && data.template === 'markaz-student-list.html') {
    // Call the specific data preparation function for markaz-student-list
    return markazStudentListHelpers.prepareMarkazStudentListData(data);
  }
  return { ...data, now: new Date() };
};

/**
 * Prepares data for markaz-student-list template
 * Adds marhalaNames map to exam, ensures regesteredexamines arrays exist
 * and orders marhalas in a fixed sequence
 * Moved to markaz-student-list-helpers.js
 * @param {Object} data
 * @returns {Object}
 */
// const prepareMarkazStudentListData = (data) => { ... };

module.exports = {
  loadTemplate,
  loadPartial,
  registerHelpers,
  prepareData,
  // Do not export markaz-student-list specific helpers from here anymore
  // getMarhalaStats,
  // getTotalMarhalaCount,
  // prepareMarkazStudentListData,
  // marhalaNameMap,
}; 