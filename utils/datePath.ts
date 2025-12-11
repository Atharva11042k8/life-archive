const ONES = [
  "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"
];

const TENS = [
  "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"
];

function numberToWords(num: number): string {
  if (num === 0) return "zero";
  if (num < 20) return ONES[num];
  const digit = num % 10;
  const ten = Math.floor(num / 10);
  return TENS[ten] + (digit ? "-" + ONES[digit] : "");
}

export function getYearFolder(year: number): string {
  // 2026 -> 26 -> twenty-six
  const shortYear = year % 100;
  return numberToWords(shortYear);
}

export function getMonthFolder(monthIndex: number): string {
  // monthIndex is 0-based
  const date = new Date(2000, monthIndex, 1);
  return date.toLocaleString('en-US', { month: 'long' }).toLowerCase();
}

export function getDayFolder(day: number): string {
  return numberToWords(day);
}

export function getDateStructure(dateStr: string) {
  // dateStr format: YYYY-MM-DD
  const [y, m, d] = dateStr.split('-').map(Number);
  
  const yearFolder = getYearFolder(y);
  const monthFolder = getMonthFolder(m - 1);
  const dayFolder = getDayFolder(d);

  return { year: yearFolder, month: monthFolder, day: dayFolder };
}
