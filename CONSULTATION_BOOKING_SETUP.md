# Consultation Booking System Setup

## Overview
The web building page now has a complete consultation booking system connected to Formspree. When users click "Book Free Consultation" or any "Get Started" button, they'll be redirected to a Formspree form that collects their information and sends it to your email.

## What's Set Up

### 1. Formspree Integration
- All consultation buttons are connected to Formspree endpoint: `https://formspree.io/f/mgvylnze`
- Forms include hidden fields to track:
  - Service type (e.g., "Web Development Consultation", "Basic Website")
  - Source (which page/section the request came from)
  - Redirect URL to success page

### 2. Success Page
- Created `/web-building/success` page
- Shows confirmation message and next steps
- Provides contact information for urgent questions

### 3. Connected Buttons
- **Hero Section**: "Book Free Consultation" button
- **Free Consultation Card**: "Book Free Consultation" button  
- **Pricing Section**: All "Get Started" buttons
- **Additional Services**: "Book Consultation" and "Subscribe" buttons
- **Contact Form**: "Book Consultation" button

## Setup Instructions

### 1. Update Your Domain
Replace `https://yourdomain.com` with your actual domain in all the `_next` redirect URLs in `app/web-building/page.tsx`:

```tsx
<input type="hidden" name="_next" value="https://yourdomain.com/web-building/success" />
```

### 2. Configure Formspree
1. Go to [Formspree.io](https://formspree.io) and create an account
2. Create a new form with the endpoint: `mgvylnze`
3. Configure email notifications
4. Set up spam protection if needed

### 3. Test the System
1. Deploy your site
2. Click any "Book Free Consultation" button
3. Fill out the form
4. Verify you receive the email
5. Check that users are redirected to the success page

## Customization Options

### 1. Add More Form Fields
You can add additional hidden fields to track more information:

```tsx
<input type="hidden" name="budget_range" value="Under $1,000" />
<input type="hidden" name="timeline" value="ASAP" />
```

### 2. Create Different Forms
For different services, you can create separate Formspree forms:

```tsx
// For e-commerce projects
<form action="https://formspree.io/f/YOUR_ECOMMERCE_FORM_ID" method="POST">

// For consultation only  
<form action="https://formspree.io/f/YOUR_CONSULTATION_FORM_ID" method="POST">
```

### 3. Add Form Validation
You can add client-side validation before submission:

```tsx
const handleSubmit = (e) => {
  if (!contactForm.name || !contactForm.email) {
    e.preventDefault()
    alert('Please fill in all required fields')
  }
}
```

### 4. Integrate with CRM
Instead of Formspree, you can connect to:
- **Calendly**: For direct calendar booking
- **HubSpot**: For CRM integration
- **Zapier**: For automation workflows
- **Custom API**: For your own backend

## Alternative Solutions

### Option 1: Calendly Integration
Replace Formspree with Calendly for direct calendar booking:

```tsx
<Button onClick={() => window.open('https://calendly.com/your-link', '_blank')}>
  Book Free Consultation
</Button>
```

### Option 2: HubSpot Forms
Use HubSpot's form builder for better CRM integration:

```tsx
<form action="https://forms.hubspot.com/YOUR_FORM_ID" method="POST">
```

### Option 3: Custom Backend
Create your own API endpoint to handle form submissions and store in your database.

## Troubleshooting

### Form Not Submitting
- Check that the Formspree endpoint is correct
- Verify all required fields are filled
- Check browser console for errors

### No Email Received
- Check Formspree dashboard for form submissions
- Verify email settings in Formspree
- Check spam folder

### Success Page Not Loading
- Update the `_next` URL with your correct domain
- Ensure the success page is deployed
- Check for any routing issues

## Next Steps

1. **Set up email templates** in Formspree for professional responses
2. **Add analytics tracking** to see which buttons get clicked most
3. **Create follow-up sequences** for different service types
4. **Integrate with your calendar** for automatic scheduling
5. **Add phone number collection** for immediate follow-up calls

The system is now ready to capture leads and start generating consultation requests! 