import { Injectable, Logger } from '@nestjs/common';
import { ClientErrorDto } from './dto/client-error.dto';

const MAX_LOGGED_CONTEXT_CHARS = 4000;

@Injectable()
export class TelemetryService {
  private readonly logger = new Logger('ClientError');

  recordClientError(dto: ClientErrorDto): void {
    const context = dto.context
      ? JSON.stringify(dto.context).slice(0, MAX_LOGGED_CONTEXT_CHARS)
      : undefined;
    const sanitize = (value: string) => value.replace(/[\r\n]+/g, ' ⏎ ');
    this.logger.error(
      [
        `message="${sanitize(dto.message)}"`,
        `url="${sanitize(dto.url)}"`,
        `ua="${sanitize(dto.userAgent)}"`,
        context ? `context=${context}` : null,
      ]
        .filter(Boolean)
        .join(' '),
      dto.stack,
    );
  }
}
