/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'

// Create Virtual Routes

const GameIdLazyImport = createFileRoute('/game/$id')()

// Create/Update Routes

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const GameIdLazyRoute = GameIdLazyImport.update({
  path: '/game/$id',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/game.$id.lazy').then((d) => d.Route))

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
    '/game/$id': {
      id: '/game/$id'
      path: '/game/$id'
      fullPath: '/game/$id'
      preLoaderRoute: typeof GameIdLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({ IndexRoute, GameIdLazyRoute })

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/game/$id"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/game/$id": {
      "filePath": "game.$id.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
