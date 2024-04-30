import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { NotificationService } from './notification.service';

import { RefreshTokenGuard } from 'src/common/refresh-token.guard';

@Controller('api/notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(RefreshTokenGuard)
  @Get('')
  async getControllerUser(@Req() req: Request) {
    const userId = req.user['sub'];
    return this.notificationService.getNotifications(userId);
  }
}
