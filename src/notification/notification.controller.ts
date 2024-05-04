import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { NotificationService } from './notification.service';

import { AccessTokenGuard } from 'src/common/access-token.guard';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(AccessTokenGuard)
  @Get('')
  async getControllerUser(@Req() req: Request) {
    const userId = req.user['sub'];

    return this.notificationService.getNotifications(userId);
  }
}
