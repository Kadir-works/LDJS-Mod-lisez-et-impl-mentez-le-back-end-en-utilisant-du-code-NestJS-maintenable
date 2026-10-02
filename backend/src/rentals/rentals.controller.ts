import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { RentalsService } from './rentals.service';

interface AuthenticatedRequest extends Request {
  user: { userId: number };
}

@Controller('rentals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Get()
  findAll() {
    return this.rentalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rentalsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'surface', 'price', 'description', 'picture'],
      properties: {
        name: { type: 'string', example: 'Appartement de test' },
        surface: { type: 'number', example: 50 },
        price: { type: 'number', example: 1200 },
        description: { type: 'string', example: 'Appartement lumineux' },
        picture: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_request, file, callback) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          callback(null, `${uniqueName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_request, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          callback(new BadRequestException('Le fichier doit être une image'), false);
          return;
        }

        callback(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: AuthenticatedRequest,
    @Body() body: CreateRentalDto,
  ) {
    if (!file) {
      throw new BadRequestException('Une image est obligatoire');
    }

    const apiUrl = process.env.API_URL ?? 'http://localhost:3001';
    const pictureUrl = `${apiUrl}/uploads/${file.filename}`;

    return this.rentalsService.create(body, request.user.userId, pictureUrl);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Appartement modifié' },
        surface: { type: 'number', example: 55 },
        price: { type: 'number', example: 1250 },
        description: { type: 'string', example: 'Nouvelle description' },
        picture: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_request, file, callback) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          callback(null, `${uniqueName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_request, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          callback(new BadRequestException('Le fichier doit être une image'), false);
          return;
        }

        callback(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateRentalDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() request: AuthenticatedRequest,
  ) {
    const apiUrl = process.env.API_URL ?? 'http://localhost:3001';
    const pictureUrl = file ? `${apiUrl}/uploads/${file.filename}` : undefined;

    return this.rentalsService.update(
      id,
      body,
      request.user.userId,
      pictureUrl,
    );
  }
}