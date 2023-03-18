import { Module } from '@nestjs/common';
import { CanvasModule } from 'src/canvas/canvas.module';
import { PixelModule } from 'src/pxl/pixel.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PassService } from './password.service';

@Module({
  imports: [CanvasModule, PixelModule],
  providers: [PassService, AdminService],
  controllers: [AdminController],
  exports: [AdminService, PassService],
})
export class AuthModule {}
