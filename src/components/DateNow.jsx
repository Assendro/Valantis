const now = new Date();

function correctDate(date) {
    if(date < 10) {
      return `0${date}`
    } 
    return `${date}`
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}${correctDate(month)}${correctDate(day)}`
}

function DateNow() {
  return formatDate(now)
}

export default DateNow