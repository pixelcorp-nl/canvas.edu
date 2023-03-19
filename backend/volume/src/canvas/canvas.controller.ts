import {
  Controller,
  Post,
  Get,
  Req,
  Body,
  Param,
  HttpStatus,
  HttpException,
  Query,
} from '@nestjs/common';
import { CanvasGateway } from './canvas.gateway';
import { imageDataDto } from './dto/imageDataDto';
import { PrismaUserService } from 'src/user/user.service';
import { Request } from 'express';
import { PrismaPixelService } from 'src/pxl/pixel.service';
import { IdentityService} from 'src/identity/identity.service';
import { extractRealIp } from 'src/ip/ip.service';
import { AdminService } from 'src/auth/admin.service';
import { PassService } from 'src/auth/password.service';
import { canvasWidth, canvasHeight } from '../config-linked.json';

@Controller('canvas')
export class CanvasController {
  constructor(
    private readonly canvasGate: CanvasGateway,
    private readonly userService: PrismaUserService,
    private readonly pixelService: PrismaPixelService,
    private readonly identityService: IdentityService,
    private readonly adminService: AdminService,
  ) {}

  async addPxlToDatabase(request: Request, imgData: imageDataDto) {
    const realIp = extractRealIp(request);

    const {x, y, data} = imgData;
    if (typeof x !== "number" || typeof y !== "number")
      return new HttpException({ status: HttpStatus.UNPROCESSABLE_ENTITY, error: 'expect number values' }, HttpStatus.UNPROCESSABLE_ENTITY);

    this.pixelService.createPixel({
      location: [x, y],
      artist: {connect: {
        ip: realIp,
      }},
      color: Array.from(data),
    })

    // update the users timestamp
    this.userService.updateUser({
      where: {
        ip: realIp,
      },
      data: {
        stamp: new Date(),  // current date
      }
    })
  }

  async timeoutCheck(request: Request, multiplier?: number)  {
    if (typeof multiplier === 'undefined')
      multiplier = 1;
    const timeoutLeft = await this.identityService.timeOutLeft(request, multiplier * this.adminService.getTimeOut())
    if (timeoutLeft > 0)
    {
      throw new HttpException({
        status: HttpStatus.TOO_MANY_REQUESTS,
        error: timeoutLeft,
      }, HttpStatus.TOO_MANY_REQUESTS, {});
    }
  }

  @Post('single')
  async paintToCanvas(@Body() pxlData: imageDataDto, @Req() request: Request) {
    await this.timeoutCheck(request);

    const tmpData = new Uint8ClampedArray(pxlData.data);
    if (tmpData.length != 4)
    {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'colordata is incorrect',
      }, HttpStatus.BAD_REQUEST, {});
    }

    // out of bounds check
    if (pxlData.x < 0 || pxlData.y < 0 || pxlData.x >= canvasWidth || pxlData.y >= canvasHeight)
    {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'out of bound',
      }, HttpStatus.BAD_REQUEST, {});
    }

    const user = await this.userService.getOrCreateUser(extractRealIp(request), 'unknown');

    // cannot throw from sub function so return and throw it here
    const error = await this.addPxlToDatabase(request, pxlData);
    if (typeof error !== "undefined")
      throw error;
    return this.canvasGate.paintToCanvas(pxlData);
  }

  @Post('multiple')
  async multiToCanvas(@Body() pxlDataArr: imageDataDto[], @Req() request: Request) {
    await this.timeoutCheck(request, pxlDataArr.length);
    const user = await this.userService.getOrCreateUser(extractRealIp(request), 'unknown');
    
    if (pxlDataArr.length > 42)
      throw new HttpException({ status: HttpStatus.PAYLOAD_TOO_LARGE, error: 'invalid code' }, HttpStatus.PAYLOAD_TOO_LARGE);
    pxlDataArr.forEach((pxl) => {
      const tmpData = new Uint8ClampedArray(pxl.data);

      // out of bounds check
      if (tmpData.length != 4 || pxl.x < 0 || pxl.y < 0 || pxl.x >= canvasWidth || pxl.y >= canvasHeight)
        return ;
      
      this.addPxlToDatabase(request, pxl);
      this.canvasGate.paintToCanvas(pxl);
    });
    return 0;
  }

  @Post('nameUser/:name')
  async nameUser(@Param('name') username: string, @Req() request: Request) {
    await this.timeoutCheck(request);
    const realIp = extractRealIp(request);
    return await this.userService.updateOrCreateUser(realIp, username);
  }

  @Get('coordinates')
  async findPxlData(@Query('x') x: number, @Query('y') y: number, @Req() request: Request) {
    await this.timeoutCheck(request);
    return this.pixelService.findCurrentPxl(x, y);
  }

  @Get('colorCheck')
  async getColor(@Query('x') x: number, @Query('y') y: number) {
    return this.canvasGate.getPxlData(x, y);
  }

  @Get('myPixels')
  async getMyPixels(@Req() request: Request)  {
    await this.timeoutCheck(request)
    const realIp = extractRealIp(request);
    const user = await this.userService.getOrCreateUser(realIp, 'unknown');
    return this.pixelService.Pixels({
      where: {
        artist: user,
      },
    })
  }

  // get all pixels and return them to requester, only meant for total replay!!
  @Get('allPixels')
  async getAllPixels(@Req() request: Request)  {
    await this.timeoutCheck(request, 5);  // magic add to config later to prevent spam
    return this.pixelService.Pixels({});
  }
}