import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResendMailService } from '@/integrations/notifications/resend/services/mail.service';
import { AppUrls } from '@/shared/config/app-urls';
import { EmailConfig } from '@/shared/config/email';

/**
 * Sends account emails through the Resend integration. When RESEND_API_KEY is missing (local dev),
 * the link is logged with Logger.warn instead (contracts §2.7).
 * Callers invoke these fire-and-forget; errors are logged, never thrown.
 */
@Injectable()
export class AuthMailService {
  private readonly logger = new Logger(AuthMailService.name);
  private readonly appUrl: string;
  private readonly resendEnabled: boolean;

  constructor(
    private readonly mailService: ResendMailService,
    config: ConfigService,
  ) {
    this.appUrl = config.get<string>('APP_URL') ?? 'http://localhost:5173';
    this.resendEnabled = Boolean(config.get<string>('RESEND_API_KEY'));
  }

  sendVerificationEmail(to: string, username: string, token: string): void {
    const verifyUrl = AppUrls.verifyEmail(this.appUrl, token);
    this.dispatch('verification', to, verifyUrl, () =>
      this.mailService.sendEmail({
        to,
        from: EmailConfig.email_addresses.verification,
        subject: EmailConfig.templates.email_verification.subject,
        template_id: EmailConfig.templates.email_verification.template_id,
        dynamic_template_data: { username, verifyUrl },
      }),
    );
  }

  sendPasswordResetEmail(to: string, username: string, token: string): void {
    const resetUrl = AppUrls.resetPassword(this.appUrl, token);
    this.dispatch('password reset', to, resetUrl, () =>
      this.mailService.sendEmail({
        to,
        from: EmailConfig.email_addresses.verification,
        subject: EmailConfig.templates.password_reset.subject,
        template_id: EmailConfig.templates.password_reset.template_id,
        dynamic_template_data: { username, resetUrl },
      }),
    );
  }

  private dispatch(
    kind: string,
    to: string,
    link: string,
    send: () => Promise<unknown>,
  ): void {
    setImmediate(async () => {
      if (!this.resendEnabled) {
        this.logger.warn(
          `RESEND_API_KEY not set — ${kind} link for ${to}: ${link}`,
        );
        return;
      }
      try {
        await send();
      } catch (error) {
        this.logger.error(
          `Failed to send ${kind} email to ${to}: ${(error as Error).message}`,
        );
      }
    });
  }
}
