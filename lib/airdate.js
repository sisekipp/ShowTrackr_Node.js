const DAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export function nextAiring(dayOfWeek, time) {
  const dayIndex = DAYS.indexOf(String(dayOfWeek || '').toLowerCase());
  const match = /^(\d{1,2}):(\d{2})\s*(am|pm)?$/i.exec(String(time || '').trim());
  if (dayIndex === -1 || !match) return null;

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const ampm = match[3] ? match[3].toLowerCase() : null;
  if (ampm === 'pm' && hour < 12) hour += 12;
  if (ampm === 'am' && hour === 12) hour = 0;

  const now = new Date();
  const date = new Date(now);
  date.setHours(hour, minute, 0, 0);
  let diff = (dayIndex - date.getDay() + 7) % 7;
  if (diff === 0 && date <= now) diff = 7;
  date.setDate(date.getDate() + diff);
  date.setHours(hour - 2, minute, 0, 0);
  return date;
}
