import NavMain from '@/components/app-sidebar'
import React, { FC } from 'react'

export const Layout: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <NavMain>{children}</NavMain>
    </div>
  )
}
