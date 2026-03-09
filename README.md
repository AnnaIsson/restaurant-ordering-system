# 🍽️ Bella Vista — Restaurant Menu & Ordering System

An Angular 17 + TypeScript application for browsing menus, managing a cart, and placing orders.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ 
- npm v9+
- Angular CLI v17: `npm install -g @angular/cli@17`

### Installation

```bash
# 1. Clone / unzip project
cd restaurant-ordering-system

# 2. Install dependencies
npm install

# 3. Start the dev server
ng serve

# 4. (Optional) Start JSON Server mock API on port 3000
npm run json-server
```

Open `http://localhost:4200` in your browser.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── navbar/              # App-wide navigation bar
│   │   ├── menu-list/           # Browse all menu items with filters
│   │   ├── menu-detail/         # Individual item detail page
│   │   ├── cart/                # Cart view & management
│   │   ├── order-form/          # Multi-step reactive checkout form
│   │   └── order-confirmation/  # Post-order success page
│   ├── services/
│   │   ├── menu.service.ts      # Fetch & filter menu items (RxJS)
│   │   ├── cart.service.ts      # Cart state management (BehaviorSubject)
│   │   └── order.service.ts     # Order placement & retrieval
│   ├── models/
│   │   ├── menu-item.model.ts   # MenuItem, Category, MenuFilter interfaces
│   │   ├── cart.model.ts        # Cart, CartItem interfaces
│   │   └── customer.model.ts    # Customer, Order, Address, PaymentInfo
│   ├── guards/
│   │   └── cart.guard.ts        # Blocks checkout when cart is empty
│   ├── interceptors/
│   │   └── error.interceptor.ts # Centralized HTTP error handling
│   ├── pipes/
│   │   ├── filter-menu.pipe.ts  # Filter items by category/search
│   │   └── price-range.pipe.ts  # Filter items by min/max price
│   ├── directives/
│   │   └── highlight.directive.ts  # Highlight recommended/discounted items
│   ├── app.routes.ts            # Routing with lazy loading
│   ├── app.config.ts            # App-level providers
│   └── app.component.ts         # Root component
├── assets/
│   └── data/db.json             # Mock REST API data (18 menu items)
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
├── index.html
├── main.ts
└── styles.scss                  # Global styles with Material overrides
```

---

## ✅ Features Implemented

### 1. TypeScript Fundamentals
- **Interfaces**: `MenuItem`, `Category`, `MenuFilter`, `Cart`, `CartItem`, `Customer`, `Order`, `Address`, `PaymentInfo`
- **Type aliases**: `OrderStatus`, `SpiceLevel`
- **Access modifiers**: private/public across all services
- **Generics**: used in RxJS operators (`Observable<T>`, `BehaviorSubject<T>`)

### 2. Angular Architecture
- **Standalone components** (Angular 17 pattern — no NgModules)
- **Data binding**: `[property]`, `(event)`, `{{interpolation}}`, `[(ngModel)]`
- **Directives**: `*ngFor`, `*ngIf`, `[ngClass]`, `[ngStyle]`, custom `appHighlight`
- **Components**: navbar, menu-list, menu-detail, cart, order-form, order-confirmation

### 3. Routing & Navigation
- Routes: `/menu`, `/menu/:id`, `/cart`, `/checkout`, `/confirmation`
- **Lazy loading** for all feature components (`loadComponent`)
- **Route parameters** for dynamic menu item details
- **Route guards**: `CartGuard` blocks `/checkout` with empty cart
- **Route titles** configured per route

### 4. Services & Dependency Injection
- **MenuService**: Loads data via `HttpClient`, exposes `BehaviorSubject` streams, filter/search methods
- **CartService**: Full cart state management with `BehaviorSubject`, add/remove/update
- **OrderService**: Order placement with order ID generation
- All services are `providedIn: 'root'` (singleton DI)

### 5. Forms & Validation
- **Template-driven forms**: Filters (checkboxes, search), special instructions
- **Reactive forms**: Multi-step checkout with `FormBuilder`, `FormGroup`
- **Dynamic validators**: Payment fields update based on selected method; delivery fields update based on delivery type
- **Validation messages**: All fields have `mat-error` directives
- **Validators used**: `required`, `email`, `minLength`, `pattern`

### 6. Custom Pipes & Directives
- **`FilterMenuPipe`**: Filters by category + search term
- **`PriceRangePipe`**: Filters by min/max price range
- **`HighlightDirective`**: Adds CSS classes for recommended/discounted items
- **Built-in pipes**: `CurrencyPipe`, `DatePipe`, `SlicePipe`, `AsyncPipe`

### 7. Angular Material UI
- `MatToolbar`, `MatCard`, `MatButton`, `MatIcon`, `MatBadge`
- `MatFormField`, `MatInput`, `MatSelect`, `MatRadio`, `MatCheckbox`
- `MatStepper`, `MatDivider`, `MatChips`, `MatTooltip`
- `MatSnackBar` for toast notifications
- `MatProgressSpinner` for loading states
- `MatMenu` for mobile navigation
- Theme: custom dark amber/gold color scheme

### 8. Observables & RxJS
- `BehaviorSubject` for cart and menu state
- `Observable` streams throughout
- Operators: `map`, `filter`, `tap`, `catchError`, `retry`, `debounceTime`, `distinctUntilChanged`, `takeUntil`, `take`
- `ErrorInterceptor` for centralized HTTP error handling

---

## 🛣️ Routes

| Route | Component | Guard |
|-------|-----------|-------|
| `/` | Redirects to `/menu` | — |
| `/menu` | MenuListComponent | — |
| `/menu/:id` | MenuDetailComponent | — |
| `/cart` | CartComponent | — |
| `/checkout` | OrderFormComponent | CartGuard |
| `/confirmation` | OrderConfirmationComponent | — |

---

## 🎨 Design Choices
- **Color palette**: Deep espresso (`#1a0a00`), warm amber (`#f59e0b`), cream white (`#faf7f4`)
- **Typography**: Playfair Display (headings) + DM Sans (body)
- **Responsive**: Mobile-first grid layouts, collapsible navigation

---

## 📦 Tech Stack

| Technology | Purpose |
|-----------|---------|
| Angular 17 | Framework (standalone components) |
| TypeScript 5.2 | Language |
| Angular Material 17 | UI component library |
| RxJS 7.8 | Reactive programming |
| Angular Router | Client-side routing |
| Angular Forms | Template + Reactive forms |
| JSON Server | Mock REST API (optional) |
| SCSS | Styling |

