# Common Components Directory

This directory is for reusable UI components that can be used across multiple screens.

## Intended Components:
- Loading spinners
- Custom buttons
- Modal containers
- Form inputs
- Card layouts
- Banner components

## Current Status:
- Empty - ready for common/reusable components as needed

## Usage:
When you create components that are used in multiple places, add them here and export them for easy importing:

```typescript
// Example: Button.tsx, Loading.tsx, Modal.tsx, etc.
export { default as Button } from './Button';
export { default as Loading } from './Loading';
export { default as Modal } from './Modal';
```

## Note:
Game-specific components should stay in `src/components/game/`
