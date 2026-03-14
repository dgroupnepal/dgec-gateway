const store = new Map<string, { count: number; resetAt: number }>();

export const checkRateLimit = (key: string, maxRequests: number, windowMs: number) => {
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, remaining: maxRequests - 1 };
  }

  if (current.count >= maxRequests) {
    return { limited: true, remaining: 0, resetAt: current.resetAt };
  }

  current.count += 1;
  store.set(key, current);
  return { limited: false, remaining: maxRequests - current.count };
};
