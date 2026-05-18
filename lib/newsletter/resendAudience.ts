import type { Resend } from 'resend';

function errMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err && typeof (err as { message: unknown }).message === 'string') {
    return (err as { message: string }).message;
  }
  return String(err ?? '');
}

/** Treat duplicate / already-member Resend responses as success. */
export function isResendContactCreateBenignError(error: unknown): boolean {
  const m = errMessage(error).toLowerCase();
  return (
    m.includes('already') ||
    m.includes('duplicate') ||
    m.includes('exist') ||
    m.includes('unique') ||
    m.includes('taken')
  );
}

export async function addNewsletterAudienceContact(
  resend: Resend,
  email: string
): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const audienceId = process.env.RESEND_NEWSLETTER_AUDIENCE_ID?.trim();
  if (!audienceId) {
    console.warn('RESEND_NEWSLETTER_AUDIENCE_ID is not set; skipping Resend audience contact create');
    return { ok: true };
  }

  const { error } = await resend.contacts.create({
    email,
    audienceId,
    unsubscribed: false,
  });

  if (!error) return { ok: true };

  if (isResendContactCreateBenignError(error)) {
    // Contact already exists (e.g. previously unsubscribed re-subscriber).
    // Explicitly mark them as subscribed so re-subscribes take effect in Resend.
    const { error: updateError } = await resend.contacts.update({
      email,
      unsubscribed: false,
    });
    if (!updateError) return { ok: true };
    const m = errMessage(updateError).toLowerCase();
    if (m.includes('not found') || m.includes('404')) return { ok: true };
    return { ok: false, error: updateError };
  }

  return { ok: false, error };
}

export async function setNewsletterContactUnsubscribed(
  resend: Resend,
  email: string
): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { error } = await resend.contacts.update({
    email,
    unsubscribed: true,
  });

  if (!error) return { ok: true };
  const m = errMessage(error).toLowerCase();
  if (m.includes('not found') || m.includes('404')) {
    return { ok: true };
  }
  return { ok: false, error };
}
