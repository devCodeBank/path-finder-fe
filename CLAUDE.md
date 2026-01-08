# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

**Development server:**

```bash
yarn dev
```

**Build and production:**

```bash
yarn build      # Full production build with TypeScript compilation
yarn clean      # Remove dist directory
yarn preview    # Preview production build locally
```

**Code quality:**

```bash
yarn lint       # Run ESLint to check code quality
yarn lint:fix   # Auto-fix ESLint issues
yarn format     # Format code with Prettier
```

## Architecture Overview

This is an **Applicant Tracking System (ATS)** frontend built with React 19, TypeScript, and Material-UI. The application uses Redux Toolkit for state management and AWS Amplify for authentication.

### Key Architectural Patterns

- **Component-based architecture** with Material-UI + styled-components
- **Redux Toolkit** for global state management (currently auth slice only)
- **Feature-based routing** with React Router DOM 7.x
- **AWS Amplify** integration for user authentication via Cognito
- **TypeScript path aliases** configured for clean imports

### State Management Structure

- Global state: Redux slices in `src/redux/slices/`
- Authentication state: `authSlice.ts` manages user login/logout
- Store configuration: `src/redux/store.ts`

### Layout System

- `AuthLayout` - For authentication pages (login, signup, etc.)
- `PlatformLayout` - Main application layout with sidebar and top navigation
- `SettingsLayout` - For settings pages with specialized navigation

### Component Organization

Components are organized by function in `src/components/`:

- `buttons/` - Button components
- `input/` - Form input components (text, password, select, etc.)
- `layout/` - Layout wrapper components
- `text/` - Typography and text components

Each component follows the pattern:

```
componentName/
├── ComponentName.tsx
└── index.ts (optional)
```

## Development Guidelines

### Import Aliases (tsconfig.app.json)

Use these path aliases instead of relative imports:

- `@components/*` → `src/components/*`
- `@pages/*` → `src/pages/*`
- `@api/*` → `src/api/*`
- `@hooks/*` → `src/hooks/*`
- `@redux/*` → `src/redux/*`
- `@theme/*` → `src/theme/*`
- `@utils/*` → `src/utils/*`
- `@assets/*` → `src/assets/*`
- `@services/*` → `src/services/*`
- `@config/*` → `src/config/*`
- `@types/*` → `src/types/*`

### Component Creation Standards

- Use **const arrow functions** for components, not function declarations
- **Props interface** at the top of each component, extending from `@types/components`
- **Named exports** for components
- **Styled components** for custom styling with Material-UI theme integration
- Follow **PascalCase** for component files and **kebab-case** for directories
- **Always use design tokens** from `@theme/tokens` instead of hardcoded values

### Design System & Theming

The application uses a comprehensive design token system:

- **Color tokens**: Brand, neutral, semantic, border, text, and background colors
- **Spacing tokens**: Consistent spacing scale (xs, sm, md, lg, xl, 2xl, etc.)
- **Typography tokens**: Font families, sizes, weights, and line heights
- **Radius tokens**: Border radius variants (sm, md, lg, xl, full)
- **Shadow tokens**: Box shadow variants (sm, md, lg, xl)
- **Z-index tokens**: Consistent layering (dropdown, sidebar, navbar, modal, etc.)

Import design tokens:

```typescript
import { colorTokens, radiusTokens } from "@theme/tokens";
// Or import everything
import { tokens } from "@theme/tokens";
```

Access theme tokens in styled-components:

```typescript
const StyledComponent = styled.div`
  background-color: ${({ theme }) => theme.palette.brand?.primary};
  padding: ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => radiusTokens.md};
`;
```

### Enhanced TypeScript Usage

The codebase includes advanced TypeScript utilities in `@types/utils`:

- **Utility types**: `Optional<T, K>`, `DeepPartial<T>`, `RequiredKeys<T>`, etc.
- **Component types**: `ComponentWithRef<T, P>`, `PropsWithChildren<P>`
- **Form types**: `FormField<T>`, `FormState<T>`, `AsyncState<T>`
- **Event handlers**: Type-safe event handler definitions
- **Type guards**: `isString()`, `isNumber()`, `isArray()`, etc.
- **Branded types**: For nominal typing (`UserId`, `Email`, etc.)

Enhanced component interfaces are available in `@types/components`:

```typescript
import type { ButtonProps, InputProps, SelectProps } from "@types/components";
```

### SVG Handling

- Use `?react` suffix to import SVGs as React components via vite-plugin-svgr
- All SVGs should use `currentColor` instead of hardcoded colors
- Place interactive SVGs in `src/assets/`, static ones in `public/`
- Use the `convert-icons.js` utility script to process new SVGs

### Environment Configuration

Required environment variables:

- `VITE_AWS_USER_POOL_ID` - AWS Cognito User Pool ID
- `VITE_AWS_USER_POOL_CLIENT_ID` - AWS Cognito Client ID

AWS Amplify configuration is in `src/config/amplify.ts`.

## Page Structure

Pages are organized by feature in `src/pages/`:

- `authentication/` - Login, signup, password reset flows
- `settings/` - User settings, admin settings, job settings
- Main app pages: `dashboard/`, `candidates/`, `jobs/`, etc.

## Deployment Context

Currently deployed on home server with Nginx. Planned migration to AWS. Build artifacts go to `dist/` directory after running `yarn build`.
