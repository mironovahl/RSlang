const DateHelper = {
  getBeutifyTodayDate: () => {
    const dateTodayObj = new Date();
    const year = dateTodayObj.getFullYear();
    let month = dateTodayObj.getMonth() + 1;
    month = (month < 10) ? `0${month}` : month;
    let day = dateTodayObj.getDate();
    day = (day < 10) ? `0${day}` : day;
    return `${year}-${month}-${day}`;
  },

  /** вернуть переданную дату в формате ГГГГ-ММ-ДД */
  getBeutifyDate: (dateObj) => {
    const year = dateObj.getFullYear();
    let month = dateObj.getMonth() + 1;
    month = (month < 10) ? `0${month}` : month;
    let day = dateObj.getDate();
    day = (day < 10) ? `0${day}` : day;
    return `${year}-${month}-${day}`;
  },

  /** вернуть дату на сегодня в формате ГГГГ-ММ-ДД */
  getTodayDate: () => {
    const nextDay = new Date();
    const dateStr = DateHelper.getBeutifyDate(nextDay);
    return dateStr;
  },

  /** вернуть дату на завтра в формате ГГГГ-ММ-ДД */
  getTomorrowDate: () => {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    const dateStr = DateHelper.getBeutifyDate(nextDay);
    return dateStr;
  },

  /** вернуть дату через неделю в формате ГГГГ-ММ-ДД */
  getNextWeekDate: () => {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 7);
    const dateStr = DateHelper.getBeutifyDate(nextDay);
    return dateStr;
  },

  /** вернуть дату через месяц в формате ГГГГ-ММ-ДД */
  getNextMonthDate: () => {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 31);
    const dateStr = DateHelper.getBeutifyDate(nextDay);
    return dateStr;
  },
};

export default DateHelper;
