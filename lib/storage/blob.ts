import { put } from '@vercel/blob';

export class BlobNotConfiguredError extends Error {
  constructor() {
    super('Blob is not configured');
  }
}

function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function requireBlob() {
  if (!blobConfigured()) throw new BlobNotConfiguredError();
  return { put };
}

function sanitizePathSegment(input: string): string {
  return input.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 120);
}

export async function blobPutBuffer(opts: {
  path: string;
  data: Buffer;
  contentType: string;
  cacheControlMaxAgeSeconds?: number;
}): Promise<{ url: string }> {
  const { put } = requireBlob();
  const safePath = opts.path
    .split('/')
    .map((seg) => sanitizePathSegment(seg))
    .join('/');

  const result = await put(safePath, opts.data, {
    access: 'public',
    contentType: opts.contentType,
    cacheControlMaxAge: opts.cacheControlMaxAgeSeconds,
  });

  return { url: result.url };
}

