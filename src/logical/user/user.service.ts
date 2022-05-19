import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  findOne(username: string): string {
    if (username == 'Kid') {
      return 'Kid is here';
    } else {
      return 'no kids';
    }
  }
}
