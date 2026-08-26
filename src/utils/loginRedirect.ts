/**
 * Builds a `/auth/login?redirect=...` href that sends the visitor back to `path`
 * after they sign in - used everywhere a signed-out visitor is sent to the login
 * page instead of hardcoding `"/auth/login"` (routes/dashboard.tsx's redirect,
 * BlogProvider.toggleLike, CreateRecipeModule, UserModule's login link), so "where
 * they came from" survives the detour through `/auth/login` and, from there,
 * potentially through Google's own consent screen and back - see
 * routes/auth/login.tsx and `AuthController.startGoogleLogin` on the backend, the
 * two places this same `redirect` param is read back.
 */
export const loginHref = (path: string): string =>
  `/auth/login?redirect=${encodeURIComponent(path)}`;

/**
 * Whitelists a `redirect` query param down to a safe, same-origin relative path.
 * Mirrors `sanitizeRedirectPath` on the backend (`AuthController`/`GoogleOidcSuccessHandler`) -
 * kept in sync manually, same as `RecipeValidation`'s frontend/backend pair.
 *
 * Guards against an open redirect via `?redirect=https://evil.example` or the
 * protocol-relative `?redirect=//evil.example`, which browsers still resolve as a
 * full external URL rather than a path on this origin.
 *
 * @returns `path` if it's safe, `"/"` otherwise (including when `path` is `null`/`undefined`)
 */
export const sanitizeRedirect = (path: string | null | undefined): string =>
  path && path.startsWith("/") && !path.startsWith("//") && !path.includes("://")
    ? path
    : "/";
