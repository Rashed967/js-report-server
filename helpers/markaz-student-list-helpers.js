/**
 * Helper functions and data preparation specific to markaz-student-list.html
 */

// Get marhala stats: count and roll ranges for a madrasah's regesteredexamines
const getMarhalaStats = (examinees, marhalaId) => {
  // Ensure examinees is a valid array
  if (!examinees || !Array.isArray(examinees)) {
    // console.log(`getMarhalaStats: Invalid examinees array for marhalaId ${marhalaId}`);
    return { count: 0, rollRanges: [] };
  }

  // Filter examinees for this marhalaId
  const marhalaExaminees = examinees.filter(ex => ex.marhala === marhalaId);

  // Get count
  const count = marhalaExaminees.length;

  // Get roll ranges
  const rollRanges = [];
  if (count > 0) {
    // Extract and sort roll numbers as numbers
    const rolls = marhalaExaminees.map(ex => parseInt(ex.roll)).sort((a, b) => a - b);

    let start = rolls[0];
    let end = rolls[0];

    for (let i = 1; i < rolls.length; i++) {
      // Check for consecutive rolls
      if (rolls[i] === end + 1) {
        end = rolls[i];
      } else {
        // Push the completed range and start a new one
        rollRanges.push({ start, end });
        start = rolls[i];
        end = rolls[i];
      }
    }
    // Push the last range
    rollRanges.push({ start, end });
  }

  // console.log(`getMarhalaStats: Marhala ID ${marhalaId}, Count: ${count}, Roll Ranges: ${JSON.stringify(rollRanges)}`);
  return { count, rollRanges };
};

// Helper function to sum all marhala counts
const sumMarhalaCounts = (marhalaTotalCounts) => {
  if (!marhalaTotalCounts) return 0;
  return Object.values(marhalaTotalCounts).reduce((sum, count) => sum + count, 0);
};

// Get total marhala count for all madrasahs under a markaz
const getTotalMarhalaCount = (allMadrasahWithDetails, marhalaId) => {
  if (!Array.isArray(allMadrasahWithDetails)) return 0;
  let total = 0;
  allMadrasahWithDetails.forEach(madrasah => {
    if (Array.isArray(madrasah.regesteredexamines)) {
      total += madrasah.regesteredexamines.filter(e => e.marhala === marhalaId).length;
    }
  });
  return total;
};

// Marhala name map: expects exam object in root context
const marhalaNameMap = (exam) => {
  const map = {};
  if (exam && Array.isArray(exam.examFeeForBoys)) {
    exam.examFeeForBoys.forEach(fee => {
      if (fee.marhala && exam.marhalaNames && exam.marhalaNames[fee.marhala]) {
        map[fee.marhala] = exam.marhalaNames[fee.marhala];
      }
    });
  }
  return map;
};

/**
 * Prepares data for markaz-student-list template
 * Adds marhalaNames map to exam, ensures regesteredexamines arrays exist
 * and orders marhalas in a fixed sequence
 * @param {Object} data
 * @returns {Object} - Processed data for template
 */
const prepareMarkazStudentListData = (data) => {
  // Build marhalaNames map (marhalaId -> name), marhalaIdMap (name -> id), and marhalaMap (id -> marhala object)
  const marhalaNames = {};
  const marhalaIdMap = {};
  const marhalaMap = {}; // New map: id -> marhala object

  // Collect marhala info from exam.examFeeForBoys
  if (data.exam && Array.isArray(data.exam.examFeeForBoys)) {
    data.exam.examFeeForBoys.forEach(fee => {
      if (fee.marhala && fee.marhala._id && fee.marhala.name && fee.marhala.name.bengaliName) {
        const id = fee.marhala._id;
        const nameBn = fee.marhala.name.bengaliName;
        marhalaNames[id] = nameBn;
        marhalaIdMap[nameBn] = id;
        marhalaMap[id] = fee.marhala; // Store the whole marhala object
      }
    });
  }

  // Collect marhala info from allMarkaz.marhala (in case some marhalas are only listed here)
  if (Array.isArray(data.allMarkaz)) {
    data.allMarkaz.forEach(markaz => {
      if (Array.isArray(markaz.marhala)) {
        markaz.marhala.forEach(m => {
          if (m._id && m.name && m.name.bengaliName) {
            const id = m._id;
            const nameBn = m.name.bengaliName;
            // Only add if not already added from examFeeForBoys
            if (!marhalaNames[id]) {
               marhalaNames[id] = nameBn;
               marhalaIdMap[nameBn] = id;
               marhalaMap[id] = m; // Store the whole marhala object
            }
          }
        });
      }
    });
  }


  // Define fixed order for marhalas - Update keys to match sample data names
  const marhalaOrder = {
    'আত্ তাখাসসুস ফিল ফিকহি ওয়াল ইফতা': 1,
    'ফযীলত (স্নাতক)': 2, // Corrected name
    'সানাবিয়াতুল উলইয়া': 3,
    'মুতাওয়াসসিতাহ (৮ম শ্রেণী)': 4, // Corrected name
    'ইবতেদাইয়্যাহ (৫ম শ্রেণী)': 5,
    'নাজেরা': 6, // Placing Nazera and Kiat before Hifz as per latest image/request order
    'ইলমুত তাজবীদ ওয়াল কিরাআত': 7,
    'হিফজুল কুরআন পূর্ণ': 8,
    'হিফজুল কুরআন ২০পারা': 9,
    'হিফজুল কুরআন ১০পারা': 10
  };

  if (data.exam) {
    data.exam.marhalaNames = marhalaNames;
    data.exam.marhalaIdMap = marhalaIdMap;
    data.exam.marhalaMap = marhalaMap; // Add the new map
  }

  // Ensure regesteredexamines exists for all madrasahs
  if (Array.isArray(data.allMarkaz)) {
    let grandTotalExaminees = 0; // Initialize grand total
    let totalWrittenExaminees = 0; // Initialize total written examinees
    let totalOralExaminees = 0; // Initialize total oral examinees

    // Define lists of Darsiyat and Hifz marhala names (Bengali)
    const darsiyatMarhalaNames = [
      'আত্ তাখাসসুস ফিল ফিকহি ওয়াল ইফতা',
      'ফযীলত (স্নাতক)',
      'সানাবিয়াতুল উলইয়া',
      'মুতাওয়াসসিতাহ (৮ম শ্রেণী)',
      'ইবতেদাইয়্যাহ (৫ম শ্রেণী)',
      'নাজেরা',
      'ইলমুত তাজবীদ ওয়াল কিরাআত'
    ];
    const hifzMarhalaNames = [
      'হিফজুল কুরআন পূর্ণ',
      'হিফজুল কুরআন ২০পারা',
      'হিফজুল কুরআন ১০পারা'
    ];

    data.allMarkaz.forEach(markaz => {
      if (Array.isArray(markaz.allMadrasahWithDetails)) {
        // Ensure regesteredexamines exists for all madrasahs and initialize marhala total counts
        markaz.marhalaTotalCounts = {}; // Initialize an object to store total counts per marhala for this markaz

        markaz.allMadrasahWithDetails.forEach(madrasah => {
          if (!Array.isArray(madrasah.regesteredexamines)) {
            madrasah.regesteredexamines = [];
          }

          // Aggregate examinee counts per marhala for this markaz and add to grand total, written, and oral totals
          madrasah.regesteredexamines.forEach(examinee => {
            const marhalaId = examinee.marhala;
            if (marhalaId) {
              markaz.marhalaTotalCounts[marhalaId] = (markaz.marhalaTotalCounts[marhalaId] || 0) + 1;

              // Check if marhala is Darsiyat or Hifz using the marhalaMap (id -> marhala object)
              const marhala = data.exam.marhalaMap ? data.exam.marhalaMap[marhalaId] : null;
              if (marhala && marhala.name && marhala.name.bengaliName) {
                const marhalaBnName = marhala.name.bengaliName;
                if (darsiyatMarhalaNames.includes(marhalaBnName)) {
                  
                  totalWrittenExaminees++;
                } else if (hifzMarhalaNames.includes(marhalaBnName)) {
                  totalOralExaminees++;
                }
                // console.log(totalWrittenExaminees)
              }
            }
          });
          grandTotalExaminees += madrasah.regesteredexamines.length; // Add madrasah total to grand total
        });
      }
    });

    data.grandTotalExaminees = grandTotalExaminees; // Add grand total to the data object
    data.totalWrittenExaminees = totalWrittenExaminees; // Add total written examinees to data

    data.totalOralExaminees = totalOralExaminees; // Add total oral examinees to data
  }

  // Sort marhalas based on the defined order for potential future use or verification
  // This sorting is not directly used for the current fixed table header structure
  // but can be helpful for dynamic generation or verification.
  if (data.exam && Array.isArray(data.exam.examFeeForBoys)) {
    data.exam.examFeeForBoys.sort((a, b) => {
      const orderA = marhalaOrder[a.marhala.name.bengaliName] || Infinity;
      const orderB = marhalaOrder[b.marhala.name.bengaliName] || Infinity;
      return orderA - orderB;
    });
  }

  return data;
};

module.exports = {
  getMarhalaStats,
  getTotalMarhalaCount,
  prepareMarkazStudentListData,
  marhalaNameMap,
  sumMarhalaCounts,
};
