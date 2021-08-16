import { HolidayPeriod } from '../holidays/types';

class DateUtil {
  static getPeriodBetweenDates = ({
    startingDate,
    endingDate,
  }: HolidayPeriod) => {
    let dates = [];

    const theStartDate = new Date(startingDate);
    const theEndDate = new Date(endingDate);
    while (theStartDate <= theEndDate) {
      const year = new Date(theStartDate).getFullYear().toString();
      let month = (new Date(theStartDate).getMonth() + 1).toString();
      let day = new Date(theStartDate).getDate().toString();
      month = month.length === 1 ? `0${month}` : month;
      day = day.length === 1 ? `0${day}` : day;
      dates = [...dates, `${year}-${month}-${day}`];
      theStartDate.setDate(theStartDate.getDate() + 1);
    }
    return dates;
  };
}

export default DateUtil;
