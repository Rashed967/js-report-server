function nowLocalStr () {
  return new Date().toLocaleDateString()
}


function multiply(a, b) {
  return a * b;
}

function enToBnNumber(input) {
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
}

function debugEnToBn(input) {
  const en = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

  if (input === undefined || input === null) return '⚠️ undefined';

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
}





function formatBnDate(isoString) {
  if (!isoString) return '';

  const dateOnly = isoString.split('T')[0]; // "2025-04-09"
  const enDigits = ['0','1','2','3','4','5','6','7','8','9'];
  const bnDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];

  let result = '';
  for (let i = 0; i < dateOnly.length; i++) {
    const idx = enDigits.indexOf(dateOnly[i]);
    result += idx > -1 ? bnDigits[idx] : dateOnly[i];
  }

  return result;
}


function todayBnDate() {
  const enNums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const bnNums = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  const formatted = `${year}-${month}-${day}`;

  return formatted.split('').map(ch => {
    const idx = enNums.indexOf(ch);
    return idx !== -1 ? bnNums[idx] : ch;
  }).join('');
}


function multiplyBn(a, b) {
  const en = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

  const result = Number(a) * Number(b);
  const str = result.toString();

  let final = '';
  for (let i = 0; i < str.length; i++) {
    const index = en.indexOf(str[i]);
    if (index !== -1) {
      final += bn[index];
    } else {
      final += str[i];
    }
  }

  return final;
}


function minusBn(a, b) {
  if (typeof a !== 'number') a = parseFloat(a);
  if (typeof b !== 'number') b = parseFloat(b);
  const result = a - b;
  return enToBnNumber(result);
}




// Helper function to convert number to Bengali words

function numberToBengaliWords(number, isTaka = false) {
  const units = [
    '',
    'এক',
    'দুই',
    'তিন',
    'চার',
    'পাঁচ',
    'ছয়',
    'সাত',
    'আট',
    'নয়'
  ];
  const teens = [
    'দশ',
    'এগার',
    'বার',
    'তের',
    'চৌদ্দ',
    'পনের',
    'ষোল',
    'সতের',
    'আঠার',
    'ঊনিশ'
  ];
  const tens = [
    '',
    'দশ',
    'বিশ',
    'ত্রিশ',
    'চল্লিশ',
    'পঞ্চাশ',
    'ষাট',
    'সত্তর',
    'আশি',
    'নব্বই'
  ];
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
}


function getTotalExamineesSlots(examineesPerMahala) {
  const totalExamineesSlots = examineesPerMahala.reduce((acc, current) => {
    return acc + current.totalExamineesSlots;
  }, 0);
  return enToBnNumber(totalExamineesSlots);
}

