import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';

interface AuthenticatedRequest extends Request {
  user: { userId: number };
}

@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: CreateMessageDto })
  create(
    @Body() body: CreateMessageDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.messagesService.create(body, request.user.userId);
  }
}