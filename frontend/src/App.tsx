import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRootRoute, createRoute, createRouter, RouterProvider, Outlet } from '@tanstack/react-router';
import Layout from './components/Layout';
import Home from './pages/Home';
import Agents from './pages/Agents';
import Missions from './pages/Missions';
import Assets from './pages/Assets';
import MostWanted from './pages/MostWanted';
import Admin from './pages/Admin';
import DKSDepartment from './pages/DKSDepartment';

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const agentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/agents',
  component: Agents,
});

const missionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/missions',
  component: Missions,
});

const assetsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/assets',
  component: Assets,
});

const mostWantedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/most-wanted',
  component: MostWanted,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: Admin,
});

const dksDepartmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/departments/dks',
  component: DKSDepartment,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  agentsRoute,
  missionsRoute,
  assetsRoute,
  mostWantedRoute,
  adminRoute,
  dksDepartmentRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
