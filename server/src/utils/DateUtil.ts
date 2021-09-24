import { HolidayPeriod } from '../holidays/interfaces';

class DateUtil {
  static getPeriodBetweenDates = ({
    startingDate,
    endingDate,
  }: HolidayPeriod) => {
    let dates = [];
    const theDate = new Date(startingDate);
    while (theDate <= endingDate) {
      dates = [...dates, new Date(theDate)];
      theDate.setDate(theDate.getDate() + 1);
    }
    return dates;
  };

  static dateToString = (date: Date): string => {
    return date.toISOString().slice(0, 10);
  };

  static getTomorrowDate = (date: Date): Date => {
    const newDate = new Date(date);
    return new Date(newDate.setDate(newDate.getDate() + 1));
  };
}

export default DateUtil;
