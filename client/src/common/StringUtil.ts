export class StringUtil {
  static zipString(string: string): string {
    return string.replaceAll(" ", "").toLowerCase();
  }
}
