import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  rental_id: number;

  // Présent pour respecter le contrat actuel du frontend, mais non utilisé pour l'auteur.
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  user_id?: number;

  @ApiProperty({ example: 'Bonjour, je souhaite avoir plus d informations.' })
  @IsString()
  @IsNotEmpty()
  message: string;
}