import { ApiProperty } from '@nestjs/swagger';

export class OkEntity {
  @ApiProperty({ example: true })
  ok: true;
}
