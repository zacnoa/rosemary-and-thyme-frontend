# Rosemary & Thyme Frontend

## Core versions

| Technology | Version |
| --- | --- |
| SolidJS | 1.9.14 |
| SolidStart | 1.3.2 |

## Overview

Rosemary & Thyme is a recipe platform for discovering, publishing, and managing recipes. Visitors can search the public recipe feed and read recipes, while authenticated users can create and edit their own recipes, like recipes, manage recipe visibility, and maintain their account.

The frontend is a server-rendered SolidStart application with file-based routing, reusable context providers, and a REST API integration. Tailwind CSS is used for styling, Vinxi provides the development and build tooling, and the production build is configured for Cloudflare Workers.

## Project structure

```text
.
├── src/
│   ├── components/
│   │   ├── auth/             # Authentication context and user state
│   │   ├── blog/             # Read-only recipe view and like state
│   │   ├── common/           # Shared UI and browser utilities
│   │   ├── dashboard/        # User recipes, liked recipes, and account settings
│   │   ├── dock/             # Reusable bottom dock and dock modules
│   │   ├── error/            # Error fallback components
│   │   ├── home/             # Public recipe feed and search
│   │   ├── notification/     # Global notification context and modal
│   │   └── recipeEditor/     # Editable recipe UI and recipe state provider
│   ├── model/
│   │   ├── interfaces/       # Recipe and feed interfaces
│   │   └── types/            # UUIDs, ingredients, instructions, images, and DTOs
│   ├── queries/              # Backend API requests
│   ├── routes/               # SolidStart file-based routes
│   ├── utils/                # Validation and cross-cutting helpers
│   ├── app.tsx               # Router and application-wide providers
│   ├── entry-client.tsx      # Client entry point and hydration
│   └── entry-server.tsx      # Server entry point and HTML document
├── app.config.ts             # SolidStart, Tailwind, middleware, and deployment config
├── tsconfig.json             # Compiler settings and the `~/*` source alias
├── wrangler.jsonc            # Cloudflare Workers deployment config
└── package.json              # Dependencies and development scripts
```

### `components`

Components are grouped by feature rather than by UI element type. Each larger feature owns its UI and, when needed, a `context` directory containing the context definition, provider, and access hook.

The application-level providers are composed in `src/app.tsx`:

- `NotificationProvider` exposes global loading, success, and error notifications.
- `AuthProvider` exposes the user returned by the server-side `getUser` query.
- Route-specific providers own narrower state. `RecipeProvider` manages the editable recipe, while `BlogProvider` manages the read-only recipe view and its like state.

The `dock` directory contains the reusable mobile-style navigation dock. Individual modules register their panels through `DockContext`, allowing the editor, public recipe view, and home page to compose only the controls they need.

### `model`

The model layer describes the data shared between routes, components, and API calls. `Recipe` is the main client-side shape, while the DTO types distinguish persisted image metadata from temporary browser `File` and object URL data.

### `queries`

Every backend operation is isolated in `src/queries`. This keeps endpoint URLs, HTTP methods, credentials, request bodies, and response conversion out of presentation components. Browser-side requests use `credentials: "include"`; server-side recipe and user queries use the cookie forwarding flow described below.

### `utils`

Utilities contain cross-cutting behavior such as recipe validation, API URL selection, redirect sanitization, account-deletion date calculations, numeric amount parsing, textarea resizing, and server middleware.

## Routes

SolidStart derives the URL structure from files inside `src/routes`.

| Route | Source | Purpose |
| --- | --- | --- |
| `/` | `routes/index.tsx` | Public landing page and cursor-paginated recipe search. The optional `query` URL parameter initializes the search field. |
| `/dashboard` | `routes/dashboard.tsx` | Authenticated user area for searching owned recipes, viewing liked recipes, changing account settings, and scheduling or cancelling account deletion. Signed-out visitors are redirected to login. |
| `/privacy` | `routes/privacy.tsx` | Privacy policy covering account data, authentication, recipe content, cookies, retention, and deletion rights. |
| `/auth/login` | `routes/auth/login.tsx` | Email/password and Google login. Preserves a sanitized `redirect` destination and supports resending verification emails. |
| `/auth/register` | `routes/auth/register.tsx` | Email/password or Google registration. Email/password accounts must verify their email before login. |
| `/auth/forgot-password` | `routes/auth/forgot-password.tsx` | Requests a password-reset email without revealing whether an account exists. |
| `/auth/reset-password` | `routes/auth/reset-password.tsx` | Accepts a `token` query parameter, submits a new password, and signs the user in after a successful reset. |
| `/auth/verify-email` | `routes/auth/verify-email.tsx` | Accepts a `token` query parameter and verifies a newly registered email address. |
| `/recipe/:id` | `routes/recipe/[id].tsx` | Loads a recipe on the server. The owner receives the editable view through `RecipeProvider`; everyone else receives the read-only `BlogProvider` view with like support. |
| `/recipe/*` | `routes/recipe/[...404].tsx` | Recipe-specific not-found page, including the target used when the backend returns `404` for a recipe ID. |
| `/*` | `routes/[...404].tsx` | Application-wide fallback for any unmatched URL. |

## Recipe state

Editable recipe state lives in `RecipeProvider` and is exposed to editor components through `RecipeContext`. The provider initializes a Solid `createStore` from the recipe returned by the backend. Using a store gives components fine-grained reactivity: an ingredient, instruction, image, or scalar field can change without replacing and rerendering the entire recipe tree.

### Data and relationships

The recipe uses a normalized structure with data separated from ordering and relationships.

Entity data is stored in records keyed by UUID:

```ts
images: Record<UUID, RecipeImage>
ingredients: Record<UUID, Ingredient>
instructions: Record<UUID, Instruction>
```

Relationships and display order are represented by UUID arrays:

```ts
heroImagesOrder: UUID[]
ingredientsOrder: UUID[]
instructionsOrder: UUID[]
instruction.images: UUID[]
```

The records are the single source of data for each entity, while the arrays describe where those entities appear. For example, an ingredient row reads an ID from `ingredientsOrder` and then resolves its data from `ingredients[id]`. Instruction images work the same way: an instruction stores image IDs, and the actual image data lives in the shared `images` record.

This approach provides stable identity, explicit ordering, and predictable updates. It also makes relationship cleanup deliberate: deleting an image removes its ID from the hero gallery and every instruction before removing the image record itself.

### Updates and persistence

Editor components never own the complete recipe. They call focused context operations such as `editIngredient`, `addInstruction`, or `removeImage`, and the provider applies targeted store updates with Solid's setters, `produce`, and `reconcile`.

A deferred effect observes the recipe store and sets `changedFlag` after any user edit. Before saving, the provider validates the recipe and reports the first blocking issue through the notification context.

Saving uses `multipart/form-data`:

1. `stripBlobData` converts the client recipe to a write DTO containing image IDs and persisted URLs, but no browser-only `File` or object URL values.
2. The serialized recipe is appended as an `application/json` part named `recipe`.
3. New image files are appended as binary parts keyed by image UUID, allowing the backend to associate each file with its DTO entry.
4. The saved response is converted back to client data and reconciled into the store. Temporary object URLs are revoked and `changedFlag` is cleared.

For recipes not owned by the current user, `BlogProvider` exposes the same recipe shape as read-only data and keeps the interactive `liked` and `likes` values in reactive signals.

## Session cookie forwarding

Authentication is based on the `session_cookie` cookie. There are two request paths to account for:

### Browser-to-backend requests

Most mutations and feed requests run in the browser and use `credentials: "include"`. The browser therefore stores and sends the session cookie with backend requests, subject to the backend's cookie and CORS configuration.

### SolidStart server-to-backend requests

`getUser` and `getRecipe` are SolidStart server queries. During server-side rendering, their backend request originates from the SolidStart server rather than from the user's browser, so the browser does not automatically attach its backend cookie to that second request.

The forwarding flow is:

1. `app.config.ts` registers `src/utils/cookiesMiddleware.ts` for every server-side request.
2. The middleware reads `session_cookie` from the incoming browser request with Vinxi's `getCookie`.
3. It stores the cookie value in `event.locals.sessionCookie` for the lifetime of that request.
4. Server queries access the same request event with `getRequestEvent()`.
5. They explicitly add `Cookie: session_cookie=<value>` to the request sent to the backend.

This preserves the user's authenticated session during SSR without exposing an HTTP-only cookie to client-side JavaScript.

## Running locally

Backend setup is outside the scope of this repository, but a reachable backend API is required for authentication, recipe data, and other API-backed features.

### Prerequisites

- Node.js 22 or newer
- pnpm
- Rosemary & Thyme backend available at `http://localhost:8080`, or at a custom URL configured below

### Configuration

The frontend reads the backend base URL from `VITE_API_URL` and falls back to `http://localhost:8080` when it is not set. To use another backend, create a `.env.local` file in the project root:

```env
VITE_API_URL=http://localhost:8080
```

The backend must allow credentialed requests from the frontend's local origin and use cookie settings appropriate for the local environment.

### Development

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open the local URL printed by Vinxi in the terminal.

### Available scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the development server with hot reloading. |
| `pnpm build` | Create the production build using the Cloudflare module preset. |
| `pnpm preview` | Preview the production build locally. |
| `pnpm start` | Start the built application. |

The production output is configured through `wrangler.jsonc` for deployment as a Cloudflare Worker with static assets.
