# Plumber Assistant – Dashboard

This is a UI prototype with mock data for managing plumbing service requests.

## Features

- **Responsive interface** optimized for desktop and mobile
- **WCAG AA accessibility** with full keyboard and screen reader support
- **Dark mode** for comfortable usage
- **Advanced filters** for requests by date, urgency, status and text search
- **Table/card view** to adapt to user preferences

## Available Pages

- **Requests**: Management and display of service requests
- **Clients**: Client database with request history
- **Checklist**: List of activities to complete
- **Calendar**: (Coming soon) Appointment management
- **Settings**: Application configurations

## Keyboard Shortcuts

- `F`: Focus on search bar
- `R`: Reset filters on Requests page
- `D`: Toggle dark mode

## Important Note

**No active integrations.** All displayed data is mock and stored locally. In the future we will enable:
- Airtable integration for data persistence
- Calendar synchronization for appointment management
- Real-time notification system

## Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`