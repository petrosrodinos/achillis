export interface CreateEmail {
  to: string;
  subject: string;
  text?: string;
  from?: string;
  html?: any;
  attachments?: any[];
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
  headers?: Record<string, string>;
  template_id?: string;
  dynamic_template_data?: Record<string, any>;
}

export interface EmailFromAddress {
  verification: string;
  confirmation: string;
}

export const EmailTemplates = {
  EMAIL_VERIFICATION: 'email-verification',
  PASSWORD_RESET: 'password-reset',
} as const;

export type EmailTemplate =
  (typeof EmailTemplates)[keyof typeof EmailTemplates];
