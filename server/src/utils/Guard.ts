import { BadRequestException } from '@nestjs/common';

export default class Guard {
  static should(rule: boolean, message: string): void {
    if (!rule) {
      throw new BadRequestException(message);
    }
  }

  static exists(obj: any, message: string): void {
    Guard.should(obj !== undefined && obj !== null, message);
  }
}
