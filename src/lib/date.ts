export function displayDate(dateString: string, lang: string): string {
  return Intl.DateTimeFormat(lang, {
    dateStyle: "medium",
  }).format(new Date(dateString));
}

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

function utcParts(dateString: string) {
  const date = new Date(dateString);
  return {
    day: date.getUTCDate(),
    month: date.getUTCMonth(),
    year: date.getUTCFullYear(),
  };
}

/** A date as the ECAM prints it: "01 JAN 2014", or "2014年1月1日" in Chinese. */
export function ecamDate(dateString: string, lang: string): string {
  const { day, month, year } = utcParts(dateString);
  if (lang === "zh") return `${year}年${month + 1}月${day}日`;
  return `${String(day).padStart(2, "0")} ${MONTHS[month]} ${year}`;
}

/** A date in a five-character FCU window: "16OCT". */
export function lcdDate(dateString: string): string {
  const { day, month } = utcParts(dateString);
  return `${String(day).padStart(2, "0")}${MONTHS[month]}`;
}
