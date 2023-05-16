import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CanvasGateway } from './canvas.gateway'
import { imageDataDto } from './dto/addToQueue-dto';

@Controller('canvas')
export class CanvasController {
  constructor(
    private readonly canvasGate: CanvasGateway,
  ) {}

  @Post('single')
  async paintToCanvas(@Body() pxlData: imageDataDto) {
    var tmpData = new Uint8ClampedArray(pxlData.data);
    if (tmpData.length != 4)
    {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'colordata is incorrect',
      }, HttpStatus.FORBIDDEN, {});
    }
    return this.canvasGate.paintToCanvas(pxlData);
  }
}