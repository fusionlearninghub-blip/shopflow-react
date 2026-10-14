# ShopFlow

An e-commerce storefront built with React and TypeScript. Shoppers browse live product data, search, filter, sort, manage a cart that survives a page reload, and check out through a validated form.

**Live demo:** https://e-commerce-nu-one-26.vercel.app/

![ShopFlow screenshot](./screenshot.png)

## Features

- Products loaded from the [DummyJSON](https://dummyjson.com/products) REST API, with loading, error and retry states
- Search, category filter and sorting (price, rating, name)
- Product details dialog (closes with Escape)
- Cart with add, remove, quantity change, clear and live total
- Cart saved in `localStorage` and restored on reload (bad saved data is ignored, not a crash)
- Checkout form validated with React Hook Form and Zod, with an order confirmation (demo only, no payment taken)
- Keyboard-friendly and screen-reader labels on controls and dialogs
- Responsive layout

## Built with

React 19, TypeScript, Vite, React Hook Form, Zod, Vitest, React Testing Library

## How it is organised

```
src/
  cart/        cartReducer.ts (pure logic), CartContext.tsx (useReducer + Context), storage.ts
  components/  Header, Hero, ShopControls, ProductCard, CartSidebar, ProductModal, CheckoutModal, Footer
  lib/         api.ts, useProducts.ts, filterProducts.ts, money.ts
  App.tsx      page layout and UI state
```

Cart logic lives in a pure reducer, so it is tested without rendering anything.

## Run it locally

```bash
git clone https://github.com/fusionlearninghub-blip/E-Commerce.git
cd E-Commerce
npm install
npm run dev
```

Other commands:

```bash
npm test        # run all tests once
npm run build   # type-check and build for production
```

## Tests

27 tests cover the cart reducer, saved-cart handling, search/filter/sort, and the full app flow (loading, error and retry, add to cart, remove, reload persistence, product dialog, checkout validation and confirmation). The API is mocked in tests.

## What I learned / challenges

The original version was plain JavaScript that edited the page by hand. Moving to React meant describing the UI from state instead, and putting every cart change through one reducer. That removed a class of bugs where the cart list, the count and the total could disagree. Rendering product data as JSX text (instead of building HTML strings) also removes the injection risk the first version had.

## Author

Kingsley Osayande. [Portfolio](https://kingsley-osayande-portfolio.vercel.app/)
