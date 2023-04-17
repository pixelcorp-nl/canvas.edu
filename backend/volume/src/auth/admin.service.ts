import { timeout } from '@src/config/config.json'

export class AdminService {
  // default timeout is 1000 milliseconds
  private timeout: number;
  constructor() {
    this.timeout = timeout;
  }

  getTimeOut() :  number {
    return this.timeout;
  }

  setTimeout(timeout: number) {
    this.timeout = timeout;
  }

}
