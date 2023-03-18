import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { CanvasGateway } from 'src/canvas/canvas.gateway';
import { PrismaPixelService } from 'src/pxl/pixel.service';
import { AdminService } from './admin.service';
import { PassService } from './password.service';

@Controller('admin')
export class AdminController {
  
  constructor(
    private readonly passService: PassService,
    private readonly adminService: AdminService,
    private readonly pixelService: PrismaPixelService,
    private readonly canvasGate: CanvasGateway,
  ) {}

  @Post('timeout')
  changeTimeout(@Query('time') timeout: number, @Query('code') code: string) {
    if (this.passService.checkCode(code) == false)
      return ;
    this.adminService.setTimeout(timeout);
    console.log('timeout set to: ', timeout);
  }

  @Post('playback')
  async playbackFromDatabase(@Req() request: Request, @Query('code') code: string) {
    if (this.passService.checkCode(code) == false)
      throw new HttpException({ status: HttpStatus.FORBIDDEN, error: 'invalid code' }, HttpStatus.FORBIDDEN);
    const pxlData = await this.pixelService.Pixels({
      orderBy: {
      stamp: "asc",
      },
    });
    this.canvasGate.playBack(pxlData);
  }

 }