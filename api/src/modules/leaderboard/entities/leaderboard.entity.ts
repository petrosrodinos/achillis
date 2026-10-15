import { ApiProperty } from '@nestjs/swagger';

export class LeaderboardMeEntity {
  @ApiProperty() rank: number;
  @ApiProperty() username: string;
  @ApiProperty() level: number;
  @ApiProperty() points: number;
  @ApiProperty({ nullable: true, type: Number }) bestTimeMs: number | null;
}

export class LeaderboardEntryEntity extends LeaderboardMeEntity {
  @ApiProperty() isCurrentUser: boolean;
}

export class LeaderboardPaginationEntity {
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() limit: number;
  @ApiProperty() totalPages: number;
  @ApiProperty() hasNext: boolean;
  @ApiProperty() hasPrev: boolean;
}

export class LeaderboardResponseEntity {
  @ApiProperty({ type: [LeaderboardEntryEntity] })
  data: LeaderboardEntryEntity[];
  @ApiProperty({ type: LeaderboardPaginationEntity })
  pagination: LeaderboardPaginationEntity;
  @ApiProperty({ type: LeaderboardMeEntity, nullable: true })
  me: LeaderboardMeEntity | null;
}
