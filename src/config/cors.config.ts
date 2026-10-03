import { env, splitOrigins } from './env';

const extraOrigins = new Set([
  env.clientUrl,
  ...env.allowedOrigins,
  ...splitOrigins(process.env.CORS_ORIGIN),
]);

const isLocalDevOrigin = (origin: string) => {
  if (env.isProd) {
    return false;
  }
  try {
    const { hostname, protocol } = new URL(origin);
    const local = hostname === 'localhost' || hostname === '127.0.0.1';
    return local && (protocol === 'http:' || protocol === 'https:');
  } catch {
    return false;
  }
};

export const isAllowedOrigin = (origin?: string) => {
  if (!origin) {
    return true;
  }
  if (extraOrigins.has(origin)) {
    return true;
  }
  return isLocalDevOrigin(origin);
};

export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }
    console.log('Blocked by CORS:', origin);
    callback(null, false);
  },
  credentials: env.corsCredentials,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'Origin',
    'X-Requested-With',
    'X-Auth-Token',
    'X-Tenant-Id',
  ],
  optionsSuccessStatus: 204,
  maxAge: 86400,
};
