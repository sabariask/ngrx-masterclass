# 🚀 NgRx Masterclass

A comprehensive Angular 21 application demonstrating **advanced NgRx state management patterns** and best practices. This project showcases real-world scenarios including authentication, data management, effects handling, router integration, and multiple feature modules with centralized state.

## 📋 Project Purpose

This masterclass project serves as an educational resource for learning and implementing NgRx patterns in Angular applications. It covers:

- **State Management**: Centralized store with NgRx for predictable state changes
- **Feature Modules**: Multiple feature stores (Counter, Todos, Auth) with isolated state
- **Side Effects**: NgRx Effects for handling asynchronous operations and API calls
- **Selectors**: Efficient state selection with memoization
- **Router Integration**: NgRx Router Store for handling route state
- **Component Store**: Local component state management with ComponentStore
- **Authentication**: Guard-protected routes and auth flow
- **HTTP Interceptors**: Error handling and request/response transformation
- **Testing**: Unit tests demonstrating testable patterns

## ✨ Key Features Implemented

### 1. **Counter Feature** 🔢
- Simple state management example
- Actions for increment/decrement operations
- Selectors for computed state (isPositive, isNegative, summary)
- Last updated timestamp tracking

### 2. **Todos Feature** 📝
- CRUD operations with API integration
- Multiple store patterns:
  - **Todo Store**: Main state with effects for API calls
  - **Todo Filter Store**: ComponentStore for filter management
  - **Todo Pagination Store**: ClientSide pagination handling
  - **Todo Local Store**: LocalStorage persistence
- Todo detail view and list view
- Dynamic filtering and sorting
- Retry logic and error handling

### 3. **Signal Todos Feature** ⚡
- Modern Angular Signals integration for reactivity
- Signal-based state management alternative to NgRx
- Demonstrates hybrid approach: Signals + Traditional Store
- Use case: Compare Signal patterns with traditional NgRx patterns

### 4. **Notes Feature** 📓 *(NEW)*
- Full CRUD note management system
- Advanced NgRx patterns:
  - **Note Facade**: Simplified store interface for components
  - **Note Store**: Main state with effects for API integration
  - **Note Filter Store**: ComponentStore for dynamic filtering
  - **Computed Selectors**: Note counts and pinned notes
- Note list and detail views
- Pin/unpin functionality
- Real-time search and filtering
- Error handling and loading states

### 5. **Authentication** 🔐
- Login/logout functionality
- Auth Guard for route protection
- Redirect guard for logged-in users
- User profile management
- Auth State with effects

### 6. **Dashboard** 📊
- Overview of application metrics
- Real-time data binding with async pipe

### 7. **Analytics** 📈
- Application usage analytics
- State-driven analytics data

### 8. **Shared Components** 🎨
- Toast notification system
- Reusable UI components

## 🛠️ Technology Stack

- **Angular**: 21.0.0
- **NgRx**: 21.1.0 (Store, Effects, Router Store, Component Store, DevTools)
- **RxJS**: 7.8.0
- **TypeScript**: Latest
- **Vitest**: Unit testing framework
- **Karma**: Test runner
- **SCSS**: Styling

## 📦 Project Structure

```
src/
├── app/
│   ├── features/               # Feature modules
│   │   ├── auth/              # Authentication feature
│   │   │   └── login/
│   │   ├── counter/           # Counter feature with store
│   │   │   └── store/         # Counter NgRx store
│   │   ├── todos/             # Todos feature with store
│   │   │   ├── store/         # Todo NgRx store & ComponentStores
│   │   │   ├── todo-list/
│   │   │   ├── todo-item/
│   │   ├── todo-detail/
│   │   │   └── todo-signal/   # Signal-based Todos implementation
│   │   └── notes/             # Notes feature (NEW)
│   │       ├── store/         # Note NgRx store & ComponentStores
│   │       ├── note.facade.ts # Facade pattern for simplified access
│   │       ├── note-list/
│   │       └── note-card/
│   ├── state/                 # App root state
│   ├── store/                 # App-level stores (Auth, Router)
│   ├── services/              # Core services
│   ├── guards/                # Route guards
│   ├── interceptors/          # HTTP interceptors
│   ├── models/                # Data models
│   ├── analytics/             # Analytics component
│   ├── dashboard/             # Dashboard component
│   └── shared/                # Shared components
├── public/
└── server/                    # Mock JSON server for development
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 11.12.1 (or higher)

### Installation

```bash
# Install dependencies
npm install

# Start mock JSON server (in another terminal)
npm run start:server
```

### Development Server

To start a local development server, run:

```bash
npm start
```

or

```bash
ng serve
```

The application will be available at `http://localhost:4200/`. Changes to source files will trigger automatic reload.

## 🏗️ Building

To build the project for production:

```bash
npm run build
```

Build artifacts will be stored in the `dist/` directory with optimizations for performance.

## 🧪 Testing

### Unit Tests

Run unit tests with Vitest:

```bash
npm test
```

or

```bash
ng test
```

Tests are written for:
- State reducers
- Selectors
- Components
- Services
- Store effects

### Watch Mode

For development with auto-reload:

```bash
npm run watch
```

## 📚 Key Learning Concepts

### State Management
- Store creation and configuration
- Actions as events
- Reducers for state transitions
- Effects for side effects
- Selectors with memoization and composition

### Design Patterns
- **Facade Pattern**: Simplified store interface (NoteFacade) for component access
- **ComponentStore**: Local component state management
- **Hybrid Approach**: Combining traditional NgRx with modern Angular Signals

### Advanced Patterns
- Feature store composition
- Selector memoization and composition
- Effects error handling and retry logic
- Router state integration
- Component Store for local state
- Signals-based reactivity (Signal Todos)
- OnPush change detection strategy

### Best Practices
- Immutability
- Single Responsibility Principle
- Reactive programming with RxJS
- Async pipe for automatic subscription management
- Type safety with TypeScript
- Feature-scoped stores with lazy loading
- Separation of concerns with Facades

## 🌐 Navigation & Routes

After logging in, you can navigate between:

- **Dashboard** (`/dashboard`) - Application overview and metrics
- **Todos** (`/todos`) - Traditional NgRx-based todo management
- **Signal Todos** (`/todo-signal`) - Modern Angular Signals implementation
- **Counter** (`/counter`) - Simple counter state management example
- **Notes** (`/notes`) - Advanced note management with Facade pattern *(NEW)*
- **Analytics** (`/analytics`) - Application analytics and insights

All feature routes are protected by the `authGuard` (except Counter) and require user authentication.

## 🔑 Authentication Flow

The application includes a complete authentication flow:
1. User logs in via the login page
2. Auth effects call the user service
3. Auth state is updated with user data
4. Auth Guard protects routes based on login state
5. Router redirects to appropriate pages
6. User can logout to clear auth state

## 🛑 Error Handling

Comprehensive error handling includes:
- HTTP error interceptor
- Toast notifications for user feedback
- Effects error handling with retry logic
- Guard-based access control

## 🏛️ Facade Pattern Implementation

The **Notes feature** demonstrates the Facade pattern for NgRx:

```typescript
// Simplified interface for components
@Injectable()
export class NoteFacade {
  allNotes$ = this.store.select(NoteSelectors.selectAllNotes);
  loading$ = this.store.select(NoteSelectors.selectNotesLoading);
  error$ = this.store.select(NoteSelectors.selectNotesError);
  pinnedNotes$ = this.store.select(NoteSelectors.selectPinnedNotes);
  
  getNoteById$(id: number) {
    return this.store.select(NoteSelectors.selectNoteById(id));
  }
}
```

**Benefits:**
- Hides complexity of store selection logic
- Provides single source of truth for note-related selectors
- Simplifies component code with pre-composed observables
- Makes testing easier with dependency injection
- Improves maintainability when store structure changes

## ⚡ Angular Signals Integration

The **Signal Todos** feature showcases Angular's modern Signals API:

- **Signal-based State**: Alternative to Observables for reactive state
- **Computed Signals**: Derived state that automatically updates
- **Effects**: Built-in side effect handling for Signals
- **Performance**: Fine-grained reactivity without zone.js overhead
- **Use Case**: Compare Signals with traditional NgRx/RxJS patterns

**Note:** This demonstrates a hybrid approach - both NgRx and Signals patterns can coexist in the same application.

## 🧩 Code Scaffolding

Generate new components using Angular CLI:

```bash
ng generate component component-name
```

For a complete list of available schematics:

```bash
ng generate --help
```

## 📝 Development Standards

- **Code Format**: Prettier with custom configuration
- **Standalone Components**: Using Angular's latest standalone API
- **Change Detection**: OnPush strategy for performance
- **Type Safety**: Strict TypeScript mode enabled
- **Immutability**: All state mutations through actions

## 🤝 Contributing

This is an educational project. Feel free to:
- Experiment with different NgRx patterns
- Add new features
- Enhance existing implementations
- Share improvements

## 📖 Resources

- [NgRx Documentation](https://ngrx.io/)
- [Angular Documentation](https://angular.io/)
- [RxJS Documentation](https://rxjs.dev/)
- [Store DevTools Extension](https://github.com/reduxjs/redux-devtools)

## 📄 License

This project is part of the NgRx Masterclass series and is provided for educational purposes.

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.