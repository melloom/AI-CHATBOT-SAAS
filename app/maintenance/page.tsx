import { MaintenancePage } from "@/components/maintenance/maintenance-page"

// Static rendering for maintenance page - content doesn't change frequently
export const dynamic = 'force-static'
export const revalidate = 3600 // Revalidate every hour

export default function MaintenancePreviewPage() {
  return (
    <MaintenancePage
      title="Scheduled Maintenance"
      subtitle="We're working to improve your experience"
      message="We're performing scheduled maintenance to enhance our platform. Please check back soon."
      estimatedTime="2 hours"
      progress={45}
      theme="dark"
      showProgress={true}
      showEstimatedTime={true}
      showContactInfo={true}
      showSocialLinks={true}
      contactEmail="support@chathub.ai"
      contactPhone="+1 (555) 123-4567"
    />
  )
} 