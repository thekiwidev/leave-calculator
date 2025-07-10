# Copilot Instructions for Project: Advanced Leave Calculator (React - Vite PWA)

## Operator Interaction

- When asked to fix code, first explain the problems found.
- When asked to generate tests, first explain what tests will be created.
- When making multiple changes, provide a step-by-step overview first.

## Environment Variables

- If a `.env` file exists, load it for local environment variables.
- Document any new environment variables in `README.md`.
- Provide example values in `.env.example`.
- **Specific to this project**: If an API key for `api-ninjas.com` is required and handled client-side (though a server-side proxy is preferred), ensure it's loaded securely via environment variables.

## Version Control

- Keep commits atomic and focused on a single change.
- Follow conventional commit message format (e.g., `feat:`, `fix:`, `chore:`).
- Update `.gitignore` for new build artifacts or dependencies.
- Use the current `CHANGELOG.md` title (including the version number) as the commit message header.
- **Bump Web App Version**:
  - After adding a new entry to `CHANGELOG.md`, update the `version` in `package.json` to a new semantic version (e.g., `"version": "0.1.1"`). This should match the `[X.Y.Z]` in your changelog header.
  - For PWA, ensure any manifest/service worker versioning is considered for cache busting if applicable.

## Code Style

- Follow the existing project code style and conventions.
- Use TypeScript types and JSDoc comments for all new functions and components.
- Include inline comments for complex or non-obvious logic.

## Change Logging

- Every time code is modified, append an entry to `CHANGELOG.md`:

  - Use [Semantic Versioning](https://semver.org/) principles.
  - Include the date and a concise description of each change.
  - Group changes by version and type (Added, Changed, Fixed, etc.).
  - New changes should be added to the top of the changelog, after the header (`# Changelog`).

- Follow the example below to log the changes:

```markdown
## [0.2.3] - Title (short descriptive title of the changes made and should be unique per change log entry)

- Fixed email validation regex to accept all valid email formats
- Updated pattern from `\\S+@\\S+\\.\\S+` to `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Improved support for all mail providers and standard email formats

## [0.1.0] - Initial Authentication Implementation

- Added authentication screen with login and register functionality
- Implemented form validation for username, email, and password fields
- Added subscription details fetching on successful login/registration
- Integrated with backend JWT authentication system
```

## Code Documenting

- When writing code, use comments to document each code so it would be easily understood.
- See the `comment-guide.md` file in the docs folder for the comments highlights docs.
- Use comments highlight to highlight the important parts of the code and comments.
- See example below:

  ```ts
  //@helper: function to calculate age
  //this function calculates user age range
  const calculateAge = (age: number) => {
    let ageBracket: string;

    // if age is less than 18 they're minor
    if (age < 18) ageBracket = "minor";
    // if age is over 18 and less than 40, they're youth
    else if (age > 18 && age < 40) ageBracket = "adult";
    // if they're older than 40 they're old
    else ageBracket = "old Man";

    // @comment: return the ageBracket
    return ageBracket;
  };
  ```

## Testing Requirements

- Include unit tests for all new functionality.
- Maintain at least 80% code coverage.
- Add integration or end-to-end tests for critical flows (API calls, date calculations, holiday management, form submissions).

## Command Execution

- Always run commands in the current working directory, unless explicitly navigating elsewhere.
- If directory changes are required, explicitly check or request confirmation.
- Do not `cd` into directories unless necessary for the command.
- If you're running scripts, or installing packages, just do it directly in the current working directory, without changing directories.

## Package Management

- Use `bun` as the default package manager for scripts and installing packages:

  ```bash
  bun install <package>
  bun add <package>
  bun run <script>
  ```

  - Do not switch to `npm` or `yarn` without asking.

## Project Setup & Structure

- Follow the existing project structure. Do not introduce new folders or files without prior approval.
- If new structure or configuration is necessary, ask for confirmation before scaffolding.
- **Specific to this project**: The project uses React with Vite as a build tool. Ensure the standard React/Vite project structure is maintained.

## Import Conventions (React/Vite)

- Use `@` as a path alias for the project root for modules.

  - **Configuration**: This typically involves setting up `paths` in `tsconfig.json` and `resolve.alias` in `vite.config.js`. Confirm this setup or ask if it needs to be configured.
    <!-- end list -->
    ```ts
    import { MyComponent } from "@/components";
    ```

- For files within the same folder or sibling folders, use relative imports:

```ts
import { Helper } from "./Helper";
import { AnotherComponent } from "../AnotherComponent";
```

## Additional Project-Specific Guidelines

### API Interactions & Data Handling

- **Robust API Error Handling**: Implement comprehensive `try-catch` blocks for all API calls to gracefully handle network issues, invalid responses, and server errors. Provide informative user feedback for any failures.
- **Data Validation**: Before using data fetched from the API or user input, always validate its format and content to prevent unexpected behavior or security vulnerabilities. For public holidays, ensure dates are valid and in the expected `YYYY-MM-DD` format.
- **Local Storage Management**: When interacting with `localStorage`, ensure proper `JSON.stringify` and `JSON.parse` usage. Implement error handling for cases where `localStorage` might be full or inaccessible.

### Performance & Optimization

- **Lazy Loading**: Consider using `React.lazy` and `Suspense` for code-splitting larger components or routes to improve initial load times, especially for the PWA aspect.
- **Memoization**: Use `React.memo`, `useMemo`, and `useCallback` where appropriate to prevent unnecessary re-renders of components and recalculations of expensive values, particularly in the leave calculation logic.
- **Bundle Size Analysis**: Regularly monitor the application's bundle size (e.g., using `rollup-plugin-visualizer` with Vite) and identify opportunities to reduce it.

### PWA Specifics

- **Service Worker Cache Strategy**: Define a clear caching strategy for the service worker (e.g., "stale-while-revalidate" for API data, "cache-first" for assets). Ensure proper cache invalidation to deliver updated content to users.
- **Offline Fallback**: Implement an offline fallback page or message to guide users when they are completely offline and trying to access parts of the app that require a network.
- **Manifest Configuration**: Ensure `manifest.json` is correctly configured with appropriate `name`, `short_name`, `icons`, `start_url`, `display`, and `theme_color` for a good "Add to Home Screen" experience.

### Date Handling Best Practices (`date-fns`)

- **Immutability**: Always treat `date-fns` outputs as immutable. Operations like `addDays` return a _new_ date object; do not mutate existing date objects.
- **Timezones**: Be mindful of timezones. Since leave calculations are typically based on local working days, ensure date parsing and formatting align with the user's local timezone or a specified "Nigeria" timezone, especially when interacting with the API which provides UTC dates. Use `date-fns-tz` if precise timezone handling is required beyond local system time.
- **Date Comparisons**: When comparing dates, use `isSameDay`, `isBefore`, `isAfter` from `date-fns` rather than direct object comparison (`===`) as date objects are distinct even if they represent the same point in time.

### State Management (`Zustand`)

- **Store Design**: Design Zustand stores with clear responsibilities (e.g., one store for `publicHolidays`, another for `leaveCalculation`).
- **Selectors**: Use Zustand's selector pattern (`useStore(state => state.value)`) to ensure components only re-render when the specific slice of state they depend on changes.
- **Persistence Middleware**: Leverage Zustand's middleware for `localStorage` persistence to simplify saving and loading state.

### User Interface / User Experience (Refined)

- **Form Feedback**: Provide immediate and clear validation feedback for all form inputs (e.g., if a GL is out of range, or a date format is incorrect).
- **Loading States**: Implement distinct loading states for API calls, calculations, and data persistence to inform the user about ongoing operations.
- **Accessibility**: Beyond basic ARIA attributes, consider keyboard navigation flow, focus management, and sufficient color contrast for all UI elements, especially interactive ones.
