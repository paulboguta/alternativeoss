import { createServerActionProcedure } from 'zsa';
import { env } from '../env';

import { AdminOnlyError, PublicError } from './errors';
import { rateLimitByIp } from './rate-limiter';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shapeErrors({ err }: any) {
  const isAllowedError = err instanceof PublicError;

  // let's all errors pass through to the UI so debugging locally is easier
  const isDev = env.NODE_ENV === 'development';

  if (isAllowedError || isDev) {
    console.error(err);
    return {
      code: err.code ?? 'ERROR',
      message: `${!isAllowedError && isDev ? 'DEV ONLY ENABLED - ' : ''}${err.message}`,
    };
  } else {
    return {
      code: 'ERROR',
      message: 'Something went wrong',
    };
  }
}

export const adminAction = createServerActionProcedure()
  .experimental_shapeError(shapeErrors)
  .handler(async () => {
    // TODO: update when you introduce auth
    const isAdmin = process.env.NODE_ENV === 'development';

    if (!isAdmin) {
      throw new AdminOnlyError();
    }
    await rateLimitByIp();
    return { isAdmin };
  });

export const unauthenticatedAction = createServerActionProcedure()
  .experimental_shapeError(shapeErrors)
  .handler(async () => {
    await rateLimitByIp();
  });
