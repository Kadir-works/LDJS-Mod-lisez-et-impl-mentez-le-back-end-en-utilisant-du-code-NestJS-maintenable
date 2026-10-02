import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMessageDto: CreateMessageDto, userId: number) {
    const rental = await this.prisma.rentals.findUnique({
      where: { id: createMessageDto.rental_id },
    });

    if (!rental) {
      throw new BadRequestException('La location indiquée est introuvable');
    }

    // L'auteur vient du JWT, jamais d'un user_id envoyé par le client.
    await this.prisma.messages.create({
      data: {
        rental_id: createMessageDto.rental_id,
        user_id: userId,
        message: createMessageDto.message,
      },
    });

    return { message: 'Message sent!' };
  }
}