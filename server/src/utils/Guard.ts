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

  static allElementsExist<T extends { id: string }>(
    requestedIds: Array<string>,
    received: Array<T>,
    message: (missingIds: string) => string,
  ): void {
    const receivedIds = received.map((el) => el.id);
    const missingIds = requestedIds
      .filter((el) => !receivedIds.includes(el))
      .join(', ');
    Guard.should(requestedIds.length === received.length, message(missingIds));
  }

  static isValidUUID(uuid: string, message: string): void {
    const regexExp =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    Guard.should(regexExp.test(uuid), message);
  }
}
