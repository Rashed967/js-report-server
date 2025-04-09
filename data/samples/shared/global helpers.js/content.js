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
