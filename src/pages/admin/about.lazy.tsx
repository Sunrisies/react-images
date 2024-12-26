import * as React from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/admin/about')({
  component: AboutComponent,
})

function AboutComponent() {
  return (
    <div className="p-2">
      <h3>About</h3>
    </div>
  )
}
