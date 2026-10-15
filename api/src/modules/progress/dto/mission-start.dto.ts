import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { MISSION_IDS, MissionId } from '@/shared/constants/game.constants';

export class MissionStartDto {
  @ApiProperty({ enum: MISSION_IDS, example: 'm01' })
  @IsIn(MISSION_IDS)
  missionId: MissionId;
}
