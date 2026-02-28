/**
 * @project AncestorTree
 * @file src/lib/lunar-calendar.ts
 * @description Vietnamese lunar calendar conversion utility
 * @version 1.0.0
 * @updated 2026-02-25
 */

// Lunar calendar data tables based on Ho Ngoc Duc's algorithm
// Reference: https://www.informatik.uni-leipzig.de/~duc/amlich/

const PI = Math.PI;

function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = Math.floor((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  if (jd < 2299161) {
    jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
  }
  return jd;
}

function jdToDate(jd: number): [number, number, number] {
  let a: number, b: number, c: number;
  if (jd > 2299160) {
    a = jd + 32044;
    b = Math.floor((4 * a + 3) / 146097);
    c = a - Math.floor((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = b * 100 + d - 4800 + Math.floor(m / 10);
  return [day, month, year];
}

function newMoon(k: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  let deltat: number;
  if (T < -11) {
    deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }
  return Jd1 + C1 - deltat;
}

function sunLongitude(jdn: number): number {
  const T = (jdn - 2451545.0) / 36525;
  const T2 = T * T;
  const dr = PI / 180;
  const M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
  let L = L0 + DL;
  L = L * dr;
  L = L - PI * 2 * (Math.floor(L / (PI * 2)));
  return Math.floor(L / PI * 6);
}

function getLunarMonth11(yy: number, timeZone: number): number {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = Math.floor(off / 29.530588853);
  let nm = newMoon(k);
  const sunLong = sunLongitude(nm + 0.5 + timeZone / 24);
  if (sunLong >= 9) {
    nm = newMoon(k - 1);
  }
  return Math.floor(nm + 0.5 + timeZone / 24);
}

function getLeapMonthOffset(a11: number, timeZone: number): number {
  const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last: number;
  let i = 1;
  let arc = sunLongitude(newMoon(k + i) + 0.5 + timeZone / 24);
  do {
    last = arc;
    i++;
    arc = sunLongitude(newMoon(k + i) + 0.5 + timeZone / 24);
  } while (arc !== last && i < 14);
  return i - 1;
}

/**
 * Convert solar (Gregorian) date to Vietnamese lunar date
 */
export function solarToLunar(dd: number, mm: number, yy: number, timeZone = 7): {
  day: number;
  month: number;
  year: number;
  leap: boolean;
} {
  const k = Math.floor((jdFromDate(dd, mm, yy) - 2415021.076998695) / 29.530588853);
  let monthStart = Math.floor(newMoon(k) + 0.5 + timeZone / 24);
  if (monthStart > jdFromDate(dd, mm, yy)) {
    monthStart = Math.floor(newMoon(k - 1) + 0.5 + timeZone / 24);
  }
  let a11 = getLunarMonth11(yy, timeZone);
  let b11 = a11;
  let lunarYear: number;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, timeZone);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, timeZone);
  }
  const lunarDay = jdFromDate(dd, mm, yy) - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29);
  let lunarLeap = false;
  let lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) {
        lunarLeap = true;
      }
    }
  }
  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }
  return { day: lunarDay, month: lunarMonth, year: lunarYear, leap: lunarLeap };
}

/**
 * Convert Vietnamese lunar date to solar (Gregorian) date
 */
export function lunarToSolar(lunarDay: number, lunarMonth: number, lunarYear: number, lunarLeap = false, timeZone = 7): {
  day: number;
  month: number;
  year: number;
} {
  let a11: number, b11: number;
  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1, timeZone);
    b11 = getLunarMonth11(lunarYear, timeZone);
  } else {
    a11 = getLunarMonth11(lunarYear, timeZone);
    b11 = getLunarMonth11(lunarYear + 1, timeZone);
  }
  const k = Math.floor(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let off = lunarMonth - 11;
  if (off < 0) {
    off += 12;
  }
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, timeZone);
    let leapMonth = leapOff - 2;
    if (leapMonth < 0) {
      leapMonth += 12;
    }
    if (lunarLeap && lunarMonth !== leapMonth) {
      return { day: 0, month: 0, year: 0 };
    } else if (lunarLeap || off >= leapOff) {
      off += 1;
    }
  }
  const monthStart = Math.floor(newMoon(k + off) + 0.5 + timeZone / 24);
  const [day, month, year] = jdToDate(monthStart + lunarDay - 1);
  return { day, month, year };
}

/**
 * Parse a lunar date string like "15/7" to day and month
 */
export function parseLunarString(lunarStr: string): { day: number; month: number } | null {
  const parts = lunarStr.split('/');
  if (parts.length !== 2) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  if (isNaN(day) || isNaN(month) || day < 1 || day > 30 || month < 1 || month > 12) {
    return null;
  }
  return { day, month };
}

/**
 * Get the next occurrence of a recurring lunar date (e.g., death anniversary)
 * Returns the solar date of the next occurrence
 */
export function getNextLunarOccurrence(lunarDay: number, lunarMonth: number, referenceDate = new Date()): Date {
  const currentYear = referenceDate.getFullYear();

  // Try current year first
  const thisYear = lunarToSolar(lunarDay, lunarMonth, currentYear);
  const thisYearDate = new Date(thisYear.year, thisYear.month - 1, thisYear.day);

  if (thisYearDate >= referenceDate) {
    return thisYearDate;
  }

  // Try next year
  const nextYear = lunarToSolar(lunarDay, lunarMonth, currentYear + 1);
  return new Date(nextYear.year, nextYear.month - 1, nextYear.day);
}

/**
 * Format a lunar date for display
 */
export function formatLunarDate(day: number, month: number, year?: number): string {
  const monthStr = `tháng ${month}`;
  if (year) {
    return `${day} ${monthStr} năm ${year} (ÂL)`;
  }
  return `${day}/${month} (ÂL)`;
}

/**
 * Get all lunar "giỗ" dates in a solar month, for calendar display
 */
export function getLunarDatesInSolarMonth(
  solarMonth: number,
  solarYear: number,
  lunarDates: { day: number; month: number; label: string }[]
): { solarDay: number; lunarDay: number; lunarMonth: number; label: string }[] {
  const results: { solarDay: number; lunarDay: number; lunarMonth: number; label: string }[] = [];

  for (const ld of lunarDates) {
    const solar = lunarToSolar(ld.day, ld.month, solarYear);
    if (solar.month === solarMonth && solar.year === solarYear) {
      results.push({
        solarDay: solar.day,
        lunarDay: ld.day,
        lunarMonth: ld.month,
        label: ld.label,
      });
    }
  }

  return results.sort((a, b) => a.solarDay - b.solarDay);
}
