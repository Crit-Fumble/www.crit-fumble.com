# @crit-fumble/react

Framework-agnostic React components for RPG applications.

## Installation

```bash
npm install @crit-fumble/react
```

## Usage

```tsx
import { Button, AccountConnections } from '@crit-fumble/react';

function MyComponent() {
  return (
    <div>
      <Button variant="primary" onClick={() => console.log('Clicked!')}>
        Click me!
      </Button>
      
      <AccountConnections 
        linkClassName="custom-link-class"
        quickActions={[
          { href: '/chat', icon: '💬', label: 'Chat' },
          { href: '/roll', icon: '🎲', label: 'Roll Dice' }
        ]}
      />
    </div>
  );
}
```

## Components

### Button

A flexible button component with multiple variants and sizes.

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'success' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `icon`: React.ReactNode
- `fullWidth`: boolean
- `isLoading`: boolean

### LinkButton

A button that renders as a link.

**Props:**
- `href`: string
- `variant`: 'primary' | 'secondary' | 'danger' | 'success' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `icon`: React.ReactNode
- `fullWidth`: boolean

### AccountConnections

A complete account connections interface for RPG applications, supporting WorldAnvil and OpenAI integrations.

**Props:**
- `linkClassName`: string (optional) - Custom CSS class for action links
- `apiEndpoints`: object (optional) - Custom API endpoints for worldanvil and openai
- `quickActions`: array (optional) - Array of quick action links with href, icon, and label

## License

MIT