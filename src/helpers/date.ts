export const todayIso = (plus?: number, sDate?: string) => {
  const t = new Date().toISOString().split("T")[0]
  const x = sDate
    ? addDays(new Date(sDate), plus ?? 0)
    : addDays(new Date(t), plus ?? 0);
  return x;
};

function addDays(date: Date, days: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString();
}

export const today = (plus?: number, sDate?: string) => {
  const x = sDate
    ? new Date(sDate).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];
  if (!plus) return new Date(x);

  const z = x.split("-");
  const day = (parseInt(z[2]) + plus).toString();
  return new Date(z[0] + "-" + z[1] + "-" + day);
};


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
