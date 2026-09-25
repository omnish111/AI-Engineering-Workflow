/**
 * Email Service Interface and Implementation
 * Decoupled mail delivery abstraction conforming to DI and modular architecture.
 */

export interface SendMailOptions {
  readonly to: string;
  readonly subject: string;
  readonly text: string;
  readonly html?: string;
}

export interface IEmailService {
  sendPasswordResetEmail(email: string, rawToken: string): Promise<boolean>;
}

export class EmailService implements IEmailService {
  private readonly sentEmails: SendMailOptions[] = [];

  async sendPasswordResetEmail(email: string, rawToken: string): Promise<boolean> {
    const mail: SendMailOptions = {
      to: email.toLowerCase().trim(),
      subject: 'Password Reset Request',
      text: `You requested a password reset. Use this token to reset your password: ${rawToken}. Valid for 15 minutes.`,
      html: `<p>You requested a password reset.</p><p>Token: <code>${rawToken}</code></p><p>This link expires in 15 minutes.</p>`
    };
    this.sentEmails.push(mail);
    return true;
  }

  getSentEmails(): readonly SendMailOptions[] {
    return [...this.sentEmails];
  }

  clearSentEmails(): void {
    this.sentEmails.length = 0;
  }
}
