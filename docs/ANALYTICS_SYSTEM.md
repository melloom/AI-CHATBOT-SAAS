# Platform Analytics System

## Overview

The Platform Analytics System provides comprehensive insights into platform usage, performance, and business metrics. It tracks real-time data from Firebase and presents it through an intuitive dashboard interface.

## Features

### 📊 Real-time Metrics
- **User Analytics**: Total users, active users, growth rate
- **Chatbot Analytics**: Active chatbots, conversation volume, response times
- **Revenue Analytics**: Monthly revenue, subscription counts, conversion rates
- **Performance Analytics**: Response times, uptime, error rates, load times

### 📈 Interactive Charts
- **User Growth Chart**: New user registrations over time
- **Chatbot Usage Chart**: Daily conversation volume
- **Revenue Trends**: Monthly revenue progression
- **Performance Metrics**: System performance over time

### ⚡ Quick Actions
- **View All Users**: Navigate to user management
- **Manage Chatbots**: Access chatbot administration
- **Manage Companies**: Company management interface
- **System Settings**: Platform configuration

## Data Sources

### Firebase Collections

#### Users Collection
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  createdAt: string,
  lastLoginAt: string,
  role: 'user' | 'admin',
  companyId?: string
}
```

#### Chatbots Collection
```javascript
{
  id: string,
  name: string,
  companyId: string,
  createdAt: string,
  lastActiveAt: string,
  status: 'active' | 'inactive',
  configuration: object
}
```

#### Conversations Collection
```javascript
{
  id: string,
  chatbotId: string,
  userId: string,
  messageCount: number,
  duration: number,
  satisfactionScore?: number,
  avgResponseTime?: number,
  createdAt: string
}
```

#### Subscriptions Collection
```javascript
{
  id: string,
  userId: string,
  plan: 'basic' | 'pro' | 'enterprise',
  status: 'active' | 'cancelled' | 'expired',
  createdAt: string,
  amount: number
}
```

#### Analytics Events Collection
```javascript
{
  event: string,
  data: object,
  timestamp: string,
  createdAt: string
}
```

## API Endpoints

### GET /api/analytics
Returns comprehensive analytics data for the platform.

**Query Parameters:**
- `type`: Specific data type (overview, user-growth, chatbot-usage, revenue, performance)
- `days`: Number of days for time series data (default: 30)
- `months`: Number of months for revenue data (default: 12)

**Response:**
```javascript
{
  overview: {
    users: { total, active, newThisMonth, growthRate },
    chatbots: { total, active, conversations, avgResponseTime },
    conversations: { total, thisMonth, avgMessagesPerConversation, satisfactionScore },
    revenue: { monthly, growth, subscriptions, conversionRate },
    performance: { avgResponseTime, uptime, errorRate, loadTime }
  },
  userGrowth: TimeSeriesData[],
  chatbotUsage: TimeSeriesData[],
  revenue: TimeSeriesData[],
  performance: {
    responseTime: TimeSeriesData[],
    uptime: TimeSeriesData[],
    errorRate: TimeSeriesData[]
  }
}
```

### POST /api/analytics
Tracks analytics events.

**Body:**
```javascript
{
  event: string,
  data: object
}
```

## Usage

### Accessing Analytics
1. Navigate to `/dashboard/admin/analytics`
2. Ensure you have admin privileges
3. View real-time metrics and charts
4. Use quick actions for common tasks

### Tracking Events
```javascript
import { trackEvent, trackUserActivity, trackChatbotUsage } from '@/lib/analytics'

// Track custom events
await trackEvent('user_action', { action: 'login', userId: '123' })

// Track user activity
await trackUserActivity('123', 'login', { method: 'email' })

// Track chatbot usage
await trackChatbotUsage('chatbot-123', 'company-456', 'conversation_started')
```

### Performance Monitoring
```javascript
import { trackPerformanceMetrics, calculateAndTrackPerformance } from '@/lib/analytics'

// Track performance metrics
await trackPerformanceMetrics({
  avgResponseTime: 1.2,
  uptime: 99.9,
  errorRate: 0.1,
  loadTime: 0.8
})

// Calculate and track automatically
await calculateAndTrackPerformance()
```

## Data Processing

### User Analytics
- **Total Users**: Count of all registered users
- **Active Users**: Users who logged in within last 30 days
- **Growth Rate**: Percentage change in new users vs last month

### Chatbot Analytics
- **Active Chatbots**: Chatbots with conversations in last 30 days
- **Conversation Volume**: Total conversations and messages
- **Response Times**: Average response time from conversations

### Revenue Analytics
- **Monthly Revenue**: Calculated from active subscriptions
- **Subscription Count**: Number of active subscriptions
- **Conversion Rate**: Percentage of users with subscriptions

### Performance Analytics
- **Response Time**: Average chatbot response time
- **Uptime**: System availability percentage
- **Error Rate**: Percentage of failed requests
- **Load Time**: Average page load time

## Security

### Authentication
- All analytics endpoints require valid Firebase authentication
- Admin privileges required for accessing analytics data
- User data is anonymized where possible

### Data Privacy
- Personal information is not exposed in analytics
- Aggregate data only for privacy compliance
- Data retention policies apply

## Customization

### Adding New Metrics
1. Update the `AnalyticsData` interface in `lib/analytics.ts`
2. Modify the `getAnalyticsData` function to calculate new metrics
3. Update the dashboard component to display new data
4. Add corresponding API endpoint if needed

### Custom Charts
1. Create new chart components using Recharts
2. Add data retrieval functions to `lib/analytics.ts`
3. Update the dashboard to include new charts
4. Add proper loading and error states

### Event Tracking
1. Define new event types in the analytics system
2. Use `trackEvent` function to log events
3. Create data processing functions for new events
4. Update dashboard to display new metrics

## Troubleshooting

### Common Issues

#### No Data Displayed
- Check Firebase connection and permissions
- Verify user has admin privileges
- Ensure collections exist and contain data
- Check browser console for errors

#### Performance Issues
- Reduce data query time ranges
- Implement pagination for large datasets
- Use caching for frequently accessed data
- Optimize Firebase queries

#### Chart Rendering Issues
- Verify data format matches chart expectations
- Check for null or undefined values
- Ensure proper date formatting
- Validate chart component props

### Debug Mode
Enable debug logging by setting environment variable:
```bash
NEXT_PUBLIC_ANALYTICS_DEBUG=true
```

## Future Enhancements

### Planned Features
- **Real-time Updates**: WebSocket integration for live data
- **Export Functionality**: CSV/PDF export of analytics data
- **Custom Dashboards**: User-configurable dashboard layouts
- **Advanced Filtering**: Date ranges, user segments, etc.
- **Alert System**: Threshold-based notifications
- **Predictive Analytics**: Trend analysis and forecasting

### Performance Optimizations
- **Caching Layer**: Redis integration for faster queries
- **Data Aggregation**: Pre-calculated metrics for better performance
- **Lazy Loading**: Progressive data loading for large datasets
- **CDN Integration**: Static asset optimization

## Support

For issues or questions about the analytics system:
1. Check the browser console for error messages
2. Verify Firebase configuration and permissions
3. Review the API documentation
4. Contact the development team

---

*Last updated: December 2024* 