/**
 * Small in-memory rate limiter per IP and route. Enough for a single Strapi
 * instance; resets when Strapi restarts.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export default (config: { max?: number; windowMs?: number }) => {
  const max = config?.max ?? 10;
  const windowMs = config?.windowMs ?? 10 * 60 * 1000;

  return async (ctx: any, next: () => Promise<void>) => {
    const forwarded = ctx.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : ctx.request.ip;
    const key = `${ctx.method} ${ctx._matchedRoute ?? ctx.path} ${ip}`;
    const now = Date.now();

    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }
    bucket.count += 1;

    if (bucket.count > max) {
      ctx.status = 429;
      ctx.set('Retry-After', String(Math.ceil((bucket.resetAt - now) / 1000)));
      ctx.body = { error: { code: 'too_many_requests' } };
      return;
    }

    // Keep the map from growing forever.
    if (buckets.size > 5000) {
      for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
    }

    await next();
  };
};
