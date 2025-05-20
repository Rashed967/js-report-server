/**
 * Helper functions and data preparation specific to markaz-student-list.html
 */

// Get marhala stats: count and roll ranges for a madrasah's regesteredexamines
const getMarhalaStats = (regesteredexamines, marhalaId) => {
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
  // Build marhalaNames map (marhalaId -> name) and marhalaIdMap (name -> id)
  const marhalaNames = {};
  const marhalaIdMap = {};
  if (Array.isArray(data.allMarkaz)) {
    data.allMarkaz.forEach(markaz => {
      if (Array.isArray(markaz.marhala)) {
        markaz.marhala.forEach(m => {
          if (m._id && m.name && m.name.bengaliName) {
            marhalaNames[m._id] = m.name.bengaliName;
            marhalaIdMap[m.name.bengaliName] = m._id;
          }
        });
      }
    });
  }

  // Define fixed order for marhalas
  // Note: Ordering is handled by the explicit template structure now,
  // but keeping this map for potential future use or reference.
  const marhalaOrder = {
    'আত্ তাহাস্‌সুস ফিল ফিকহি ওয়াল ইফতা': 1,
    'ফযীলত (মাতব)': 2,
    'সানাবিয়্যাতুল উলইয়া': 3,
    'মুতাওয়াসসিতাহ (৬ষ্ঠ শ্রেণী)': 4,
    'ইবতেদাইয়্যাহ (৫ম শ্রেণী)': 5,
    'ইলমুত তাজবীদ ওয়াল কিরাআত': 6,
    'হিফজুল কুরআন পূর্ণ': 7,
    'হিফজুল কুরআন ২০পারা': 8,
    'হিফজুল কুরআন ১০পারা': 9,
    'নাযেরা': 10,
    'কিরাআত': 11
  };

  if (data.exam) {
    data.exam.marhalaNames = marhalaNames;
    data.exam.marhalaIdMap = marhalaIdMap;
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
  getMarhalaStats,
  getTotalMarhalaCount,
  prepareMarkazStudentListData,
  marhalaNameMap,
};
