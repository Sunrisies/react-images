import { createLazyFileRoute } from '@tanstack/react-router'
import { SEODashboard } from '@/pages/seo/dashboard'

export const Route = createLazyFileRoute('/dashboard/seo')({
  component: SEODashboard,
})