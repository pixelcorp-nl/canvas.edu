import { WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { PrismaPixelService } from 'src/pxl/pixel.service';
import { imageDataDto } from './dto/imageDataDto';
import { PxlDataDto, RGBA } from './dto/pixelDataDto';
import { Pixel } from '@prisma/client';
import { canvasWidth, canvasHeight, replayTimeout, replayPxlCount } from '../config-linked.json';

const bytesPerColor = 4;

function modifyRegion(data: Uint8ClampedArray, regionStart: number, newValues: [number, number, number, number]) {
  for (let i = 0; i < 4; i++) {
    data[regionStart + i] = newValues[i];
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
@WebSocketGateway({
  // transports: ['websocket'],
  cors: {
    origin: '*',
  },
  namespace: '/canvas'
})
export class CanvasGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private isReplaying = false;
  constructor(
    private readonly pixelService: PrismaPixelService,
  ) {}
  private canvas: {
    height: number;
    width: number;
    data: Uint8ClampedArray;
  } = {
    height: canvasHeight,
    width: canvasWidth,
    data: new Uint8ClampedArray(canvasHeight * canvasWidth * bytesPerColor)
  };
  // private server: Server;
  @WebSocketServer() server: Server;

  async loadCanvasFromDB()  {
    const allPixels = await this.pixelService.Pixels({
        orderBy: {
        stamp: "asc",
      },
    });
    allPixels.forEach(pxl => {
      const pixel = {
        x: pxl.location[0],
        y: pxl.location[1],
        data: pxl.color,
      };
      modifyRegion(this.canvas.data, (pixel.y * this.canvas.width + pixel.x) * bytesPerColor, [Number(pixel.data[0]), Number(pixel.data[1]), Number(pixel.data[2]), Number(pixel.data[3])]);
      this.server.emit('update', pixel);
    });
  }

  async playBack(pixelData: Pixel[]) {
    this.isReplaying = true;
    const whiteBg = new Uint8ClampedArray(canvasHeight * canvasWidth * bytesPerColor);
    for (let i = 0; i <whiteBg.length; i++) {
      whiteBg.buffer[i] = 255;
    }
    const emptyCanvas = {
      height: canvasHeight,
      width: canvasWidth,
      data: whiteBg,
    }
    this.server.emit("init", emptyCanvas);
    // const pixels: imageDataDto[] = pixelData.map(pixel => ({
    //   x: pixel.location[0],
    //   y: pixel.location[1],
    //   data: new Uint8ClampedArray(pixel.color),
    // }))
    await sleep(5000);
    // for (let i = 0; i < pixels.length; i++) {
    //   this.server.emit("update", pixels[i]);
    //   sleep(42);
    // }
    // for (let i = 0; i < pixels.length / replayPxlCount; i++)  {
    //   this.server.emit('multiple-update', pixels.splice(i * replayPxlCount, i * replayPxlCount + replayPxlCount));
    //   sleep(replayTimeout);
    // }
    this.isReplaying = false;
    this.server.emit('init', this.canvas);
  }

  afterInit(server: Server) {
    // this.server = server;
    this.loadCanvasFromDB();
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.emit('init', this.canvas)
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // api call resolver
  paintToCanvas(add: imageDataDto) {
    modifyRegion(this.canvas.data, (add.y * this.canvas.width + add.x) * bytesPerColor, [Number(add.data[0]), Number(add.data[1]), Number(add.data[2]), Number(add.data[3])]);
    if (this.isReplaying == true)
      return ;
    this.server.emit('update', add);
  }

  getPxlData(x: number, y: number) {
    const dataStartLocation = (y * this.canvas.width + x) * bytesPerColor;
    return (new PxlDataDto(x, y, new RGBA(this.canvas.data.slice(dataStartLocation, dataStartLocation + bytesPerColor))));
  }
}
