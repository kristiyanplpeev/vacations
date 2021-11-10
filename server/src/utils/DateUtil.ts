import { AbsencePeriod } from '../holidays/interfaces';

class DateUtil {
  static getPeriodBetweenDates = ({
    startingDate,
    endingDate,
  }: AbsencePeriod) => {
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

  static areDatesEqual = (dateOne: Date, dateTwo: Date): boolean => {
    return (
      dateOne.getDate() === dateTwo.getDate() &&
      dateOne.getMonth() === dateTwo.getMonth() &&
      dateOne.getFullYear() === dateTwo.getFullYear()
    );
  };

  static getTomorrowDate = (date: Date): Date => {
    const newDate = new Date(date);
    return new Date(newDate.setDate(newDate.getDate() + 1));
  };

  static roundDate = (date: Date): Date => {
    if (date.getUTCHours() < 12) {
      date.setUTCHours(0, 0, 0, 0);
    } else {
      date.setUTCHours(24, 0, 0, 0);
    }
    return date;
  };
}

export default DateUtil;
