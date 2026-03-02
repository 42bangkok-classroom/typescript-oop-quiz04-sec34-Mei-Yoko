import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getLove(): string {
    return "Hello World!";
  }
}