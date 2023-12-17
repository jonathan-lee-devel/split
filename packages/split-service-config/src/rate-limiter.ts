import {rateLimit} from 'express-rate-limit';
import {DEFAULT_RATE_LIMIT_PER_WINDOW, DEFAULT_RATE_LIMIT_WINDOW_MS} from '@split-common/split-constants/dist/rate-limit';

export const makeRateLimiter = (
    windowMs: number,
    limit: number,
) => rateLimit({
  windowMs,
  limit,
  legacyHeaders: false,
});

export const defaultRateLimiter = makeRateLimiter(
    DEFAULT_RATE_LIMIT_WINDOW_MS,
    DEFAULT_RATE_LIMIT_PER_WINDOW,
);
