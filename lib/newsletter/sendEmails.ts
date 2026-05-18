import type { Resend } from 'resend';
import { escapeNewsletterHtml } from './escapeHtml';

function fromAddress(): string {
  return process.env.RESEND_FROM_EMAIL || 'Yeti Welding <onboarding@resend.dev>';
}

const ACCENT = '#c41e3a';

/** Welcome email sent immediately after single opt-in signup. */
export async function sendNewsletterWelcomeEmail(
  resend: Resend,
  opts: { to: string; blogUrl: string; unsubscribeUrl: string }
): Promise<{ error: unknown | null }> {
  const safeBlog = escapeNewsletterHtml(opts.blogUrl);
  const safeUnsub = escapeNewsletterHtml(opts.unsubscribeUrl);

  const { error } = await resend.emails.send({
    from: fromAddress(),
    to: [opts.to],
    subject: 'Welcome to the Yeti Welding newsletter',
    headers: {
      'List-Unsubscribe': `<${opts.unsubscribeUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;background:#f4f2ef;font-family:Georgia,'Times New Roman',serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f2ef;padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.06);">
      <tr><td style="background:#1a1a1a;padding:24px 28px;border-bottom:3px solid ${ACCENT};">
        <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,.55);">Yeti Welding</p>
        <p style="margin:8px 0 0;font-size:22px;font-weight:600;color:#ffffff;line-height:1.25;">Good to have you here</p>
      </td></tr>
      <tr><td style="padding:28px 28px 8px;">
        <p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#2d2a26;">We share what&#8217;s happening at the shop &#8212; custom fabrication projects, build process photos, practical welding tips, and news straight from the team in Springville, Utah.</p>
        <p style="margin:0 0 24px;font-size:16px;line-height:1.65;color:#2d2a26;">No noise, no filler. Just the stuff we&#8217;re actually working on.</p>
        <a href="${safeBlog}" style="display:inline-block;padding:12px 22px;background:${ACCENT};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;border-radius:3px;letter-spacing:0.04em;">Read the blog</a>
      </td></tr>
      <tr><td style="padding:0 28px 28px;">
        <p style="margin:24px 0 0;padding-top:20px;border-top:1px solid #e8e4df;font-size:12px;line-height:1.6;color:#6b6560;">
          <a href="${safeUnsub}" style="color:${ACCENT};">Unsubscribe</a> anytime. We only use your email for updates you signed up for.
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`,
    text: `Welcome to Yeti Welding updates.\n\nWe share what's happening at the shop -- custom fabrication projects, build process photos, practical welding tips, and news straight from the team in Springville, Utah.\n\nNo noise, no filler. Just the stuff we're actually working on.\n\nRead the blog: ${opts.blogUrl}\n\nUnsubscribe anytime: ${opts.unsubscribeUrl}\n`,
  });

  return { error: error ?? null };
}

export async function sendNewsletterInternalSignupEmail(
  resend: Resend,
  opts: { businessEmail: string; subscriberEmail: string }
): Promise<{ error: unknown | null }> {
  const safe = escapeNewsletterHtml(opts.subscriberEmail);
  const { error } = await resend.emails.send({
    from: fromAddress(),
    to: [opts.businessEmail],
    replyTo: opts.subscriberEmail,
    subject: 'Blog newsletter — new subscriber',
    html: `<!DOCTYPE html><html><body style="font-family:sans-serif;line-height:1.6">
<p><strong>New blog newsletter subscriber</strong></p>
<p>Email: <a href="mailto:${safe}">${safe}</a></p>
<p style="color:#666;font-size:12px">Single opt-in from yetiwelding.com/blog</p>
</body></html>`,
    text: `New blog newsletter subscriber\n\nEmail: ${opts.subscriberEmail}\n`,
  });

  return { error: error ?? null };
}

/** Confirmation email sent to the subscriber after they unsubscribe. */
export async function sendNewsletterUnsubscribeConfirmationEmail(
  resend: Resend,
  opts: { to: string; blogUrl: string }
): Promise<{ error: unknown | null }> {
  const safeBlog = escapeNewsletterHtml(opts.blogUrl);

  const { error } = await resend.emails.send({
    from: fromAddress(),
    to: [opts.to],
    subject: "You've been unsubscribed from Yeti Welding updates",
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;background:#f4f2ef;font-family:Georgia,'Times New Roman',serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f2ef;padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.06);">
      <tr><td style="background:#1a1a1a;padding:24px 28px;border-bottom:3px solid ${ACCENT};">
        <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,.55);">Yeti Welding</p>
        <p style="margin:8px 0 0;font-size:22px;font-weight:600;color:#ffffff;line-height:1.25;">You've been unsubscribed</p>
      </td></tr>
      <tr><td style="padding:28px 28px 8px;">
        <p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#2d2a26;">We've removed you from our newsletter list. You won't receive any more updates from us.</p>
        <p style="margin:0 0 24px;font-size:16px;line-height:1.65;color:#2d2a26;">If you unsubscribed by accident or change your mind, you can sign up again anytime from our blog.</p>
        <a href="${safeBlog}" style="display:inline-block;padding:12px 22px;background:${ACCENT};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;border-radius:3px;letter-spacing:0.04em;">Visit the blog</a>
      </td></tr>
      <tr><td style="padding:0 28px 28px;">
        <p style="margin:24px 0 0;padding-top:20px;border-top:1px solid #e8e4df;font-size:12px;line-height:1.6;color:#6b6560;">
          This is a one-time confirmation. You will not receive further emails.
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`,
    text: `You've been unsubscribed from Yeti Welding updates.\n\nWe've removed you from our list. You won't receive any more updates from us.\n\nIf you change your mind, you can sign up again at: ${opts.blogUrl}\n`,
  });

  return { error: error ?? null };
}

/**
 * Builds the HTML body for a broadcast email sent via Resend Broadcasts.
 * Body paragraphs are split on double newlines; single newlines become <br>.
 * Uses {{ RESEND_UNSUBSCRIBE_URL }} so Resend injects its managed unsubscribe link.
 */
export function buildBroadcastEmailHtml(opts: {
  subject: string;
  body: string;
  blogUrl: string;
}): string {
  const safeBlog = escapeNewsletterHtml(opts.blogUrl);
  const safeSubject = escapeNewsletterHtml(opts.subject);

  const paragraphsHtml = opts.body
    .split(/\n\n+/)
    .filter((p) => p.trim())
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#2d2a26;">${escapeNewsletterHtml(p).replace(/\n/g, '<br>')}</p>`
    )
    .join('');

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;background:#f4f2ef;font-family:Georgia,'Times New Roman',serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f2ef;padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.06);">
      <tr><td style="background:#1a1a1a;padding:24px 28px;border-bottom:3px solid ${ACCENT};">
        <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,.55);">Yeti Welding</p>
        <p style="margin:8px 0 0;font-size:22px;font-weight:600;color:#ffffff;line-height:1.25;">${safeSubject}</p>
      </td></tr>
      <tr><td style="padding:28px 28px 8px;">
        ${paragraphsHtml}
        <a href="${safeBlog}" style="display:inline-block;padding:12px 22px;background:${ACCENT};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;border-radius:3px;letter-spacing:0.04em;">Read the blog</a>
      </td></tr>
      <tr><td style="padding:0 28px 28px;">
        <p style="margin:24px 0 0;padding-top:20px;border-top:1px solid #e8e4df;font-size:12px;line-height:1.6;color:#6b6560;">
          <a href="{{ RESEND_UNSUBSCRIBE_URL }}" style="color:${ACCENT};">Unsubscribe</a> anytime. You&#8217;re receiving this because you subscribed to Yeti Welding updates.
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

/** Plain-text fallback for a broadcast email. */
export function buildBroadcastEmailText(opts: { body: string; blogUrl: string }): string {
  return `${opts.body}\n\nRead the blog: ${opts.blogUrl}\n\nUnsubscribe: {{ RESEND_UNSUBSCRIBE_URL }}\n`;
}

/** Used by legacy confirm links for subscribers who signed up before single opt-in. */
export async function sendNewsletterInternalConfirmedEmail(
  resend: Resend,
  opts: { businessEmail: string; subscriberEmail: string }
): Promise<{ error: unknown | null }> {
  const safe = escapeNewsletterHtml(opts.subscriberEmail);
  const { error } = await resend.emails.send({
    from: fromAddress(),
    to: [opts.businessEmail],
    replyTo: opts.subscriberEmail,
    subject: 'Blog newsletter — subscription confirmed (legacy link)',
    html: `<!DOCTYPE html><html><body style="font-family:sans-serif;line-height:1.6">
<p><strong>Newsletter subscription completed via confirmation link</strong></p>
<p>Email: <a href="mailto:${safe}">${safe}</a></p>
<p style="color:#666;font-size:12px">Legacy double opt-in link from yetiwelding.com/blog</p>
</body></html>`,
    text: `Newsletter subscription completed via confirmation link\n\nEmail: ${opts.subscriberEmail}\n`,
  });

  return { error: error ?? null };
}
