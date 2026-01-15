import { Resend } from 'resend';

// Initialize Resend lazily to avoid module-level initialization errors
let resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string; messageId?: string }> {
  try {
    const resendInstance = getResend();
    if (!resendInstance) {
      console.error('RESEND_API_KEY is not set in environment variables');
      return {
        success: false,
        error: 'Email service is not configured',
      };
    }

    const { data, error } = await resendInstance.emails.send({
      from: options.from || process.env.RESEND_FROM_EMAIL || 'Yeti Welding <onboarding@resend.dev>',
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''), // Fallback to plain text if not provided
      replyTo: options.replyTo,
    });

    if (error) {
      console.error('Resend error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email',
      };
    }

    return {
      success: true,
      messageId: data?.id,
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}





