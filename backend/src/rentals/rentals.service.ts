import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';

const ownerSelection = {
  id: true,
  name: true,
  email: true,
  created_at: true,
  updated_at: true,
} as const;

type RentalWithOwner = Prisma.rentalsGetPayload<{
  include: { users: { select: typeof ownerSelection } };
}>;

@Injectable()
export class RentalsService {
  constructor(private readonly prisma: PrismaService) {}

  private formatRental(rental: RentalWithOwner) {
    const { users, ...rentalData } = rental;

    return {
      ...rentalData,
      surface: Number(rental.surface),
      price: Number(rental.price),
      owner: users,
    };
  }

  async findAll() {
    const rentals = await this.prisma.rentals.findMany({
      include: {
        users: { select: ownerSelection },
      },
    });

    return {
      rentals: rentals.map((rental) => this.formatRental(rental)),
    };
  }

  async findOne(id: number) {
    const rental = await this.prisma.rentals.findUnique({
      where: { id },
      include: {
        users: { select: ownerSelection },
      },
    });

    if (!rental) {
      throw new NotFoundException('Location introuvable');
    }

    return this.formatRental(rental);
  }

  async create(createRentalDto: CreateRentalDto, ownerId: number, picture: string) {
    await this.prisma.rentals.create({
      data: {
        name: createRentalDto.name,
        surface: createRentalDto.surface,
        price: createRentalDto.price,
        picture,
        description: createRentalDto.description,
        owner_id: ownerId,
      },
    });

    return { message: 'Rental created!' };
  }

  async update(
    id: number,
    updateRentalDto: UpdateRentalDto,
    ownerId: number,
    picture?: string,
  ) {
    const rental = await this.prisma.rentals.findUnique({ where: { id } });

    if (!rental) {
      throw new NotFoundException('Location introuvable');
    }

    if (rental.owner_id !== ownerId) {
      throw new ForbiddenException('Vous ne pouvez pas modifier cette location');
    }

    await this.prisma.rentals.update({
      where: { id },
      data: {
        ...updateRentalDto,
        ...(picture ? { picture } : {}),
      },
    });

    return { message: 'Rental updated!' };
  }
}