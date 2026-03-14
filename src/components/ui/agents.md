# UI Component Creation Patterns

This document defines the standards and patterns for creating UI components inside `src/components/ui/`. All agents and contributors must follow these rules.

## Rules

### 1. Named exports only

Never use `export default`. Always use named exports for components, variant definitions, and types.

```tsx
// correct
export { Button, buttonVariants, type ButtonProps };

// wrong
export default function Button() {}
```

### 2. Extend native HTML element props

Every component must extend the native props of its underlying HTML element using `ComponentProps<"element">` from React.

```tsx
import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & ButtonVariants;
```

### 3. Use `tailwind-variants` for variants

Use `tv()` from `tailwind-variants` to define variant styles. Do NOT use `twMerge` separately. The `className` prop must be passed directly into the `tv()` call, which handles merging internally.

```tsx
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: "...",
  variants: {
    variant: {
      primary: "...",
      secondary: "...",
    },
    size: {
      sm: "...",
      lg: "...",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "lg",
  },
});

type ButtonVariants = VariantProps<typeof buttonVariants>;
```

### 4. Pass `className` through the variant function

The component must destructure `className` and pass it to the `tv()` call so consumers can override styles. Never wrap with `twMerge` separately.

```tsx
function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}
```

### 5. Component file structure

Each component file should follow this order:

1. Imports
2. Variant definition (`tv()`)
3. Type definitions (VariantProps + ComponentProps)
4. Component function
5. Named exports

### 6. Naming conventions

- File name: lowercase kebab-case (`button.tsx`, `text-input.tsx`)
- Component name: PascalCase (`Button`, `TextInput`)
- Variant definition: camelCase with `Variants` suffix (`buttonVariants`, `textInputVariants`)
- Props type: PascalCase with `Props` suffix (`ButtonProps`, `TextInputProps`)

### 7. Design tokens

Use the design tokens defined in `src/app/globals.css` via `@theme`. Reference them as Tailwind classes:

- Colors: `bg-accent-green`, `text-primary`, `border-border`, etc.
- Fonts: `font-mono` (JetBrains Mono), `font-sans` (Geist)

Never hardcode hex values in component classes. Always use the token-based Tailwind classes.

### 8. Tailwind only for styling

Use Tailwind CSS utility classes exclusively. No inline styles, no CSS modules, no styled-components.

### 9. Component template

```tsx
import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const exampleVariants = tv({
  base: "...",
  variants: {
    variant: {
      primary: "...",
    },
    size: {
      md: "...",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

type ExampleVariants = VariantProps<typeof exampleVariants>;

type ExampleProps = ComponentProps<"div"> & ExampleVariants;

function Example({ className, variant, size, ...props }: ExampleProps) {
  return (
    <div
      className={exampleVariants({ variant, size, className })}
      {...props}
    />
  );
}

export { Example, exampleVariants, type ExampleProps };
```
