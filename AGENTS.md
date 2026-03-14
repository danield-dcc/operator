# Project Rules (devroast)

## Core UI patterns
- Composition over props: use Root/Title/Description/etc subcomponents (named exports, no dot notation).
- Tailwind only for styling; use theme tokens from `src/app/globals.css`.
- Prefer `tailwind-variants` (`tv`) for variants; pass `className` through `tv`.
- Avoid template-string class interpolation; use `twMerge` when combining classes manually.

## Layout + structure
- Navbar is global in `src/app/layout.tsx` and uses composed `Navbar*` components.
- Homepage lives in `src/app/page.tsx` and uses composed UI pieces.

## Components
- UI components live in `src/components/ui/`.
- Named exports only; extend `ComponentProps<"tag">` for each subcomponent.

## Content
- Keep text concise and product-focused (roast tone).
