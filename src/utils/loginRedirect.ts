/**
 * Provides the loginHref function.
 */
export const loginHref = (path: string): string =>
  `/auth/login?redirect=${encodeURIComponent(path)}`;

/**
 * Provides the sanitizeRedirect function.
 */
export const sanitizeRedirect = (path: string | null | undefined): string =>
  path && path.startsWith("/") && !path.startsWith("//") && !path.includes("://")
    ? path
    : "/";
