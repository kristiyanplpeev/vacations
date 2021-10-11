export class StringUtil {
  static stringCapitalize(string: string): string {
    if (string.length > 0) {
      return string[0].toUpperCase() + string.substring(1);
    } else {
      return string;
    }
  }
}
