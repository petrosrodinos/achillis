import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { ProfileService } from './profile.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { GameSettingsEntity, MeEntity } from './entities/me.entity';

@ApiTags('Me')
@ApiCookieAuth('wk_access')
@Controller('me')
@UseGuards(JwtGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({
    summary: 'Current user with profile, settings and unlocked characters',
  })
  @ApiResponse({ status: 200, type: MeEntity })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  getMe(@CurrentUser('id') userId: string) {
    return this.profileService.getMe(userId);
  }

  @Patch('settings')
  @ApiOperation({ summary: 'Partially update game settings' })
  @ApiResponse({ status: 200, type: GameSettingsEntity })
  @ApiResponse({
    status: 400,
    description:
      'Validation failed (unknown action / input code, out-of-range value)',
  })
  updateSettings(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateSettingsDto,
  ) {
    return this.profileService.updateSettings(userId, dto);
  }
}
