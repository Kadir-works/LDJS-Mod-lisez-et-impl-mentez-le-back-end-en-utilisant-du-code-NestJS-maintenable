import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Jean Dupont' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'jean@example.com' })
  @IsEmail()
  @MaxLength(255)
  email: string;

  // Le mot de passe sera hashé avant d'être enregistré en base.
  @ApiProperty({ example: 'MotDePasse123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;
}