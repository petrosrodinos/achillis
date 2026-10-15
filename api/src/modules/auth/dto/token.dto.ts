import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, Length, MaxLength } from 'class-validator';
import { PasswordFieldDto } from './register.dto';

export class VerifyEmailDto {
  @ApiProperty({ description: 'Token from the verification link' })
  @IsString()
  @Length(16, 256)
  token: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'knight@example.com', format: 'email' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @MaxLength(254)
  email: string;
}

export class ResetPasswordDto extends PasswordFieldDto {
  @ApiProperty({ description: 'Token from the reset link' })
  @IsString()
  @Length(16, 256)
  token: string;
}
