import { EmailTemplates } from '@/integrations/notifications/resend/interfaces/mail.interfaces';

const EmailAddress = 'info@logiqdev.com';

export const EmailConfig = {
  email_addresses: {
    verification: EmailAddress,
    confirmation: EmailAddress,
  },
  templates: {
    email_verification: {
      subject: 'White Knight — confirm your email',
      template_id: EmailTemplates.EMAIL_VERIFICATION,
    },
    password_reset: {
      subject: 'White Knight — reset your password',
      template_id: EmailTemplates.PASSWORD_RESET,
    },
  },
};
