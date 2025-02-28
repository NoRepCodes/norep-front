export const today = (plus?: number, sDate?: string) => {
  const x = sDate
    ? addDays(new Date(sDate), plus ?? 0)
    : addDays(new Date(), plus ?? 0);
  return x;
};


function addDays(date: Date, days: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export const convertDate = (date: string) => {
  let d = date.split("-");
  return d[2] + "," + months[parseInt(d[1]) - 1];
};
export const getYear = (date: string) => {
  let d = date.split("-");
  return d[0];
};

export const todaySplit: (sDate?: string) => string[] = (sDate) => {
  if (!sDate) return new Date().toISOString().split("T")[0].split("-");
  else return new Date(sDate).toISOString().split("T")[0].split("-");
};

export const convSeconds = (s: number) => {
  const zeroPad = (num: number) => String(num).padStart(2, "0");
  const hh = zeroPad(Math.floor(s / 3600));
  const hh_x = parseInt(zeroPad(Math.floor(s % 3600)));
  const mm = zeroPad(Math.floor(hh_x / 60));
  const ss = zeroPad(Math.floor(s % 60));
  return `${hh}:${mm}:${ss}`;
};

export const todayString = (sDate: string) => {
  return new Date(sDate).toISOString().split("T")[0];
};

export const months = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
  "ene",
];
export const monthsLarge = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
