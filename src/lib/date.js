/**
 * Utilitas tanggal berbahasa Indonesia, zona waktu WIB (Asia/Jakarta).
 * Semua tanggal di aplikasi disimpan sebagai string ISO "YYYY-MM-DD"
 * dan jam sebagai "HH:mm" agar konsisten dan mudah dibandingkan.
 */

export const TIMEZONE = "Asia/Jakarta";

export const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
export const HARI_SENIN_DULU = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
const BULAN_SINGKAT = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

/** Tanggal hari ini di WIB, format "YYYY-MM-DD". */
export function todayISO() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Jam sekarang (0–23) di WIB. */
export function currentHourWIB() {
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: TIMEZONE,
      hour: "2-digit",
      hourCycle: "h23",
    }).format(new Date())
  );
}

/** "YYYY-MM-DD" -> Date (UTC tengah hari, aman dari pergeseran zona waktu). */
export function parseISO(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12));
}

export function toISO(date) {
  return date.toISOString().slice(0, 10);
}

export function addDays(iso, n) {
  const d = parseISO(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return toISO(d);
}

/** Nama hari, mis. "Senin". */
export function dayName(iso) {
  return HARI[parseISO(iso).getUTCDay()];
}

/** Senin pada minggu yang sama dengan tanggal yang diberikan. */
export function startOfWeek(iso) {
  const diff = (parseISO(iso).getUTCDay() + 6) % 7;
  return addDays(iso, -diff);
}

/** "Senin, 2 November 2026" */
export function formatLong(iso) {
  const d = parseISO(iso);
  return `${HARI[d.getUTCDay()]}, ${d.getUTCDate()} ${BULAN[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** "2 November 2026" */
export function formatDate(iso) {
  const d = parseISO(iso);
  return `${d.getUTCDate()} ${BULAN[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** "2 Nov 2026" */
export function formatShort(iso) {
  const d = parseISO(iso);
  return `${d.getUTCDate()} ${BULAN_SINGKAT[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** "2 November" */
export function formatDayMonth(iso) {
  const d = parseISO(iso);
  return `${d.getUTCDate()} ${BULAN[d.getUTCMonth()]}`;
}

/** "November 2026" */
export function formatMonthYear(iso) {
  const d = parseISO(iso);
  return `${BULAN[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** "2 – 8 November 2026" atau "30 November – 6 Desember 2026" */
export function formatWeekRange(startIso) {
  const s = parseISO(startIso);
  const e = parseISO(addDays(startIso, 6));
  if (s.getUTCMonth() === e.getUTCMonth()) {
    return `${s.getUTCDate()} – ${e.getUTCDate()} ${BULAN[e.getUTCMonth()]} ${e.getUTCFullYear()}`;
  }
  if (s.getUTCFullYear() === e.getUTCFullYear()) {
    return `${s.getUTCDate()} ${BULAN[s.getUTCMonth()]} – ${e.getUTCDate()} ${BULAN[e.getUTCMonth()]} ${e.getUTCFullYear()}`;
  }
  return `${formatDate(startIso)} – ${formatDate(toISO(e))}`;
}

/** "09:00" -> "09.00" */
export function formatTime(t) {
  return (t || "").replace(":", ".");
}

/** "09.00 – 12.00 WIB" */
export function formatTimeRange(start, end) {
  return `${formatTime(start)} – ${formatTime(end)} WIB`;
}

/** Sapaan sesuai jam WIB (PRD HOME-1). */
export function greeting(hour = currentHourWIB()) {
  if (hour >= 4 && hour < 11) return "Selamat pagi";
  if (hour >= 11 && hour < 15) return "Selamat siang";
  if (hour >= 15 && hour < 18) return "Selamat sore";
  return "Selamat malam";
}

/** Bandingkan jam "HH:mm" -> menit. */
export function timeToMinutes(t) {
  const [h, m] = (t || "0:0").split(":").map(Number);
  return h * 60 + m;
}

