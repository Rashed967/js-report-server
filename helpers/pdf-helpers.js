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
  handlebars.registerHelper('marhalaNameMap', function(exam) {
    const map = {};
    if (exam && Array.isArray(exam.examFeeForBoys)) {
      exam.examFeeForBoys.forEach(fee => {
        if (fee.marhala && exam.marhalaNames && exam.marhalaNames[fee.marhala]) {
          map[fee.marhala] = exam.marhalaNames[fee.marhala];
        }
      });
    }
    return map;
  });

  // Get marhala stats: count and roll ranges for a madrasah's regesteredexamines
  handlebars.registerHelper('getMarhalaStats', function(regesteredexamines, marhalaId) {
    if (!Array.isArray(regesteredexamines)) return { count: 0, rollRanges: [] };
    // Filter examinees for this marhala
    const filtered = regesteredexamines.filter(e => e.marhala === marhalaId);
    if (filtered.length === 0) return { count: 0, rollRanges: [] };
    // Sort by roll (as number)
    const sorted = filtered.slice().sort((a, b) => Number(a.roll) - Number(b.roll));
    // Find roll ranges (consecutive)
    const rollRanges = [];
    let start = null, end = null;
    for (let i = 0; i < sorted.length; i++) {
      const roll = Number(sorted[i].roll);
      if (start === null) {
        start = roll;
        end = roll;
      } else if (roll === end + 1) {
        end = roll;
      } else {
        rollRanges.push({ start, end });
        start = roll;
        end = roll;
      }
    }
    if (start !== null) {
      rollRanges.push({ start, end });
    }
    return { count: filtered.length, rollRanges };
  });

  // Get total marhala count for all madrasahs under a markaz
  handlebars.registerHelper('getTotalMarhalaCount', function(allMadrasahWithDetails, marhalaId) {
    if (!Array.isArray(allMadrasahWithDetails)) return 0;
    let total = 0;
    allMadrasahWithDetails.forEach(madrasah => {
      if (Array.isArray(madrasah.regesteredexamines)) {
        total += madrasah.regesteredexamines.filter(e => e.marhala === marhalaId).length;
      }
    });
    return total;
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

/**
 * Prepares data for markaz-student-list template
 * Adds marhalaNames map to exam, ensures regesteredexamines arrays exist
 * @param {Object} data
 * @returns {Object}
 */
const prepareMarkazStudentListData = (data) => {
  // Build marhalaNames map (marhalaId -> name)
  const marhalaNames = {};
  if (Array.isArray(data.allMarkaz)) {
    data.allMarkaz.forEach(markaz => {
      if (Array.isArray(markaz.marhala)) {
        markaz.marhala.forEach(m => {
          if (m._id && m.name && m.name.bengaliName) {
            marhalaNames[m._id] = m.name.bengaliName;
          }
        });
      }
    });
  }
  if (data.exam) {
    data.exam.marhalaNames = marhalaNames;
  }
  // Ensure regesteredexamines exists for all madrasahs
  if (Array.isArray(data.allMarkaz)) {
    data.allMarkaz.forEach(markaz => {
      if (Array.isArray(markaz.allMadrasahWithDetails)) {
        markaz.allMadrasahWithDetails.forEach(madrasah => {
          if (!Array.isArray(madrasah.regesteredexamines)) {
            madrasah.regesteredexamines = [];
          }
        });
      }
    });
  }
  return data;
};

module.exports = {
  loadTemplate,
  loadPartial,
  registerHelpers,
  prepareData,
  prepareMarkazStudentListData
}; 