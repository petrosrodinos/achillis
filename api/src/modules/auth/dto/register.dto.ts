import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, Length, Matches, MaxLength } from 'class-validator';

export const USERNAME_PATTERN = /^[A-Za-z0-9_]+$/;

export class PasswordFieldDto {
  @ApiProperty({
    description: '8–72 chars, at least one letter and one digit',
    example: 'Excalibur42',
    minLength: 8,
    maxLength: 72,
  })
  @IsString()
  @Length(8, 72, { message: 'password must be 8–72 characters' })
  @Matches(/[A-Za-z]/, { message: 'password must contain at least one letter' })
  @Matches(/\d/, { message: 'password must contain at least one digit' })
  password: string;
}

export class RegisterDto extends PasswordFieldDto {
  @ApiProperty({ example: 'knight@example.com', format: 'email' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @MaxLength(254)
  email: string;

  @ApiProperty({
    example: 'Sir_Galahad',
    minLength: 3,
    maxLength: 20,
    pattern: USERNAME_PATTERN.source,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(3, 20, { message: 'username must be 3–20 characters' })
  @Matches(USERNAME_PATTERN, {
    message: 'username may only contain letters, digits and underscores',
  })
  username: string;
}
