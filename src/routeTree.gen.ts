/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './pages/__root.lazy'
import { Route as IndexImport } from './pages/index'
import { Route as AdminIndexImport } from './pages/admin/index'
import { Route as AdminPersonalInfoImport } from './pages/admin/personalInfo'
import { Route as AdminGalleryImport } from './pages/admin/gallery'
import { Route as AdminEditImport } from './pages/admin/edit'
import { Route as AdminBlogImport } from './pages/admin/blog'
import { Route as AdminArticlesImport } from './pages/admin/articles'

// Create Virtual Routes

const AuthLoginLazyImport = createFileRoute('/auth/login')()
const AdminAboutLazyImport = createFileRoute('/admin/about')()

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const AdminIndexRoute = AdminIndexImport.update({
  id: '/admin/',
  path: '/admin/',
  getParentRoute: () => rootRoute,
} as any)

const AuthLoginLazyRoute = AuthLoginLazyImport.update({
  id: '/auth/login',
  path: '/auth/login',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./pages/auth/login.lazy').then((d) => d.Route))

const AdminAboutLazyRoute = AdminAboutLazyImport.update({
  id: '/admin/about',
  path: '/admin/about',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./pages/admin/about.lazy').then((d) => d.Route))

const AdminPersonalInfoRoute = AdminPersonalInfoImport.update({
  id: '/admin/personalInfo',
  path: '/admin/personalInfo',
  getParentRoute: () => rootRoute,
} as any)

const AdminGalleryRoute = AdminGalleryImport.update({
  id: '/admin/gallery',
  path: '/admin/gallery',
  getParentRoute: () => rootRoute,
} as any)

const AdminEditRoute = AdminEditImport.update({
  id: '/admin/edit',
  path: '/admin/edit',
  getParentRoute: () => rootRoute,
} as any)

const AdminBlogRoute = AdminBlogImport.update({
  id: '/admin/blog',
  path: '/admin/blog',
  getParentRoute: () => rootRoute,
} as any)

const AdminArticlesRoute = AdminArticlesImport.update({
  id: '/admin/articles',
  path: '/admin/articles',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/admin/articles': {
      id: '/admin/articles'
      path: '/admin/articles'
      fullPath: '/admin/articles'
      preLoaderRoute: typeof AdminArticlesImport
      parentRoute: typeof rootRoute
    }
    '/admin/blog': {
      id: '/admin/blog'
      path: '/admin/blog'
      fullPath: '/admin/blog'
      preLoaderRoute: typeof AdminBlogImport
      parentRoute: typeof rootRoute
    }
    '/admin/edit': {
      id: '/admin/edit'
      path: '/admin/edit'
      fullPath: '/admin/edit'
      preLoaderRoute: typeof AdminEditImport
      parentRoute: typeof rootRoute
    }
    '/admin/gallery': {
      id: '/admin/gallery'
      path: '/admin/gallery'
      fullPath: '/admin/gallery'
      preLoaderRoute: typeof AdminGalleryImport
      parentRoute: typeof rootRoute
    }
    '/admin/personalInfo': {
      id: '/admin/personalInfo'
      path: '/admin/personalInfo'
      fullPath: '/admin/personalInfo'
      preLoaderRoute: typeof AdminPersonalInfoImport
      parentRoute: typeof rootRoute
    }
    '/admin/about': {
      id: '/admin/about'
      path: '/admin/about'
      fullPath: '/admin/about'
      preLoaderRoute: typeof AdminAboutLazyImport
      parentRoute: typeof rootRoute
    }
    '/auth/login': {
      id: '/auth/login'
      path: '/auth/login'
      fullPath: '/auth/login'
      preLoaderRoute: typeof AuthLoginLazyImport
      parentRoute: typeof rootRoute
    }
    '/admin/': {
      id: '/admin/'
      path: '/admin'
      fullPath: '/admin'
      preLoaderRoute: typeof AdminIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/admin/articles': typeof AdminArticlesRoute
  '/admin/blog': typeof AdminBlogRoute
  '/admin/edit': typeof AdminEditRoute
  '/admin/gallery': typeof AdminGalleryRoute
  '/admin/personalInfo': typeof AdminPersonalInfoRoute
  '/admin/about': typeof AdminAboutLazyRoute
  '/auth/login': typeof AuthLoginLazyRoute
  '/admin': typeof AdminIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/admin/articles': typeof AdminArticlesRoute
  '/admin/blog': typeof AdminBlogRoute
  '/admin/edit': typeof AdminEditRoute
  '/admin/gallery': typeof AdminGalleryRoute
  '/admin/personalInfo': typeof AdminPersonalInfoRoute
  '/admin/about': typeof AdminAboutLazyRoute
  '/auth/login': typeof AuthLoginLazyRoute
  '/admin': typeof AdminIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/admin/articles': typeof AdminArticlesRoute
  '/admin/blog': typeof AdminBlogRoute
  '/admin/edit': typeof AdminEditRoute
  '/admin/gallery': typeof AdminGalleryRoute
  '/admin/personalInfo': typeof AdminPersonalInfoRoute
  '/admin/about': typeof AdminAboutLazyRoute
  '/auth/login': typeof AuthLoginLazyRoute
  '/admin/': typeof AdminIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/admin/articles'
    | '/admin/blog'
    | '/admin/edit'
    | '/admin/gallery'
    | '/admin/personalInfo'
    | '/admin/about'
    | '/auth/login'
    | '/admin'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/admin/articles'
    | '/admin/blog'
    | '/admin/edit'
    | '/admin/gallery'
    | '/admin/personalInfo'
    | '/admin/about'
    | '/auth/login'
    | '/admin'
  id:
    | '__root__'
    | '/'
    | '/admin/articles'
    | '/admin/blog'
    | '/admin/edit'
    | '/admin/gallery'
    | '/admin/personalInfo'
    | '/admin/about'
    | '/auth/login'
    | '/admin/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AdminArticlesRoute: typeof AdminArticlesRoute
  AdminBlogRoute: typeof AdminBlogRoute
  AdminEditRoute: typeof AdminEditRoute
  AdminGalleryRoute: typeof AdminGalleryRoute
  AdminPersonalInfoRoute: typeof AdminPersonalInfoRoute
  AdminAboutLazyRoute: typeof AdminAboutLazyRoute
  AuthLoginLazyRoute: typeof AuthLoginLazyRoute
  AdminIndexRoute: typeof AdminIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AdminArticlesRoute: AdminArticlesRoute,
  AdminBlogRoute: AdminBlogRoute,
  AdminEditRoute: AdminEditRoute,
  AdminGalleryRoute: AdminGalleryRoute,
  AdminPersonalInfoRoute: AdminPersonalInfoRoute,
  AdminAboutLazyRoute: AdminAboutLazyRoute,
  AuthLoginLazyRoute: AuthLoginLazyRoute,
  AdminIndexRoute: AdminIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.lazy.tsx",
      "children": [
        "/",
        "/admin/articles",
        "/admin/blog",
        "/admin/edit",
        "/admin/gallery",
        "/admin/personalInfo",
        "/admin/about",
        "/auth/login",
        "/admin/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/admin/articles": {
      "filePath": "admin/articles.tsx"
    },
    "/admin/blog": {
      "filePath": "admin/blog.tsx"
    },
    "/admin/edit": {
      "filePath": "admin/edit.tsx"
    },
    "/admin/gallery": {
      "filePath": "admin/gallery.tsx"
    },
    "/admin/personalInfo": {
      "filePath": "admin/personalInfo.tsx"
    },
    "/admin/about": {
      "filePath": "admin/about.lazy.tsx"
    },
    "/auth/login": {
      "filePath": "auth/login.lazy.tsx"
    },
    "/admin/": {
      "filePath": "admin/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
