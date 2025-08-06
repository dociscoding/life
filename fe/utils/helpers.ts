export function toUTF16(codePoint: number) {
  var TEN_BITS = parseInt("1111111111", 2);
  function u(codeUnit: number) {
    return "\\u" + codeUnit.toString(16).toUpperCase();
  }

  if (codePoint <= 0xffff) {
    return u(codePoint);
  }
  codePoint -= 0x10000;

  // Shift right to get to most significant 10 bits
  var leadSurrogate = 0xd800 + (codePoint >> 10);

  // Mask to get least significant 10 bits
  var tailSurrogate = 0xdc00 + (codePoint & TEN_BITS);

  return u(leadSurrogate) + u(tailSurrogate);
}

export const formatDate = (dateString: string, detailed?: boolean) => {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = { month: "short" };
  const month = new Intl.DateTimeFormat("en-US", options).format(date);

  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Helper function to add "st", "nd", "rd", or "th" to the day
  function getDayWithSuffix(day: number): string {
    if (day > 3 && day < 21) return day + "th";
    switch (day % 10) {
      case 1:
        return day + "st";
      case 2:
        return day + "nd";
      case 3:
        return day + "rd";
      default:
        return day + "th";
    }
  }

  // Format time as HH:MM
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;

  if (detailed) {
    return `${month} ${getDayWithSuffix(day)}, ${formattedTime}`;
  } else {
    return `${month} ${getDayWithSuffix(day)}, ${date.getFullYear()}`;
  }
};
