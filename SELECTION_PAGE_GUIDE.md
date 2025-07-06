# Selection Page Implementation Guide

## Overview
The selection page (`/selection`) is a new feature that allows first-time users to choose between two main services:
1. **Web Building Services** - Custom website development and design
2. **AI Chatbot Platform** - ChatHub's main chatbot platform

## How It Works

### First-Time User Flow
1. When a user visits the site for the first time, they are automatically redirected to `/selection`
2. The selection page presents two service options with detailed features and benefits
3. User makes a choice and is redirected to their preferred service
4. The choice is stored in localStorage for future visits

### User Preference Storage
- `userServicePreference`: Stores the user's service choice ('web-building' or 'chatbot')
- `hasVisitedSelection`: Tracks if the user has visited the selection page

### Service Redirects
- **Web Building**: Redirects to `/web-building/home`
- **Chatbot Platform**: Redirects to `/` (main ChatHub landing page)

## Features

### Selection Page (`/selection`)
- **Modern UI**: Beautiful gradient backgrounds and smooth animations
- **Service Cards**: Detailed feature comparison for each service
- **Theme Toggle**: Global theme switching (light/dark mode)
- **Responsive Design**: Works on all device sizes
- **Loading States**: Smooth transitions with loading indicators

### Theme Integration
- **Global Theme Toggle**: Available on all pages
- **Persistent Theme**: Theme preference is saved in localStorage
- **Dark Mode Support**: Full dark mode support across all pages

### Change Preference Feature
- **Floating Button**: "Change Service" button on both landing pages
- **Reset Functionality**: Clears user preferences and redirects to selection
- **Easy Access**: Positioned in top-right corner for easy access

## Technical Implementation

### Key Components
1. **Selection Page**: `app/selection/page.tsx`
2. **Updated Landing Page**: `app/page.tsx` (ChatHub main page)
3. **Updated Web Building**: `app/web-building/home/page.tsx`
4. **Theme Toggle**: `components/ui/theme-toggle.tsx`

### LocalStorage Keys
```javascript
// User service preference
localStorage.setItem('userServicePreference', 'web-building' | 'chatbot')

// Track if user has visited selection
localStorage.setItem('hasVisitedSelection', 'true')
```

### Navigation Flow
```
First Visit → /selection → Choose Service → Redirect to Service Page
Return Visit → Check localStorage → Redirect to Preferred Service
Change Service → Clear localStorage → Redirect to /selection
```

## Customization

### Adding New Services
To add more service options:
1. Add new service card in `app/selection/page.tsx`
2. Update the `handleServiceSelection` function
3. Add corresponding redirect logic

### Styling
- Uses Tailwind CSS for styling
- Supports both light and dark themes
- Responsive design with mobile-first approach
- Smooth animations and transitions

### Theme Customization
- Theme toggle uses `next-themes` library
- Supports system theme detection
- Persistent theme storage

## User Experience

### Benefits
- **Personalized Experience**: Users see content relevant to their needs
- **Clear Choice**: Easy-to-understand service comparison
- **Flexible**: Users can change their preference anytime
- **Fast**: Quick redirects based on stored preferences

### Accessibility
- Keyboard navigation support
- Screen reader friendly
- High contrast themes
- Responsive design for all devices

## Future Enhancements

### Potential Improvements
1. **Analytics**: Track service preferences and user behavior
2. **A/B Testing**: Test different service descriptions
3. **Personalization**: Show different content based on user choice
4. **Onboarding**: Add guided tours for each service
5. **Integration**: Connect with user accounts and preferences

### Additional Features
- Service-specific onboarding flows
- Customized content based on user choice
- Integration with user accounts
- Advanced analytics and tracking 