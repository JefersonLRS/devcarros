import { createBrowserRouter } from "react-router-dom";

// Site pages
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Dashboard } from "./pages/dashboard";
import { CarDetail } from "./pages/car";
import { New } from "./pages/dashboard/new";

// Components
import { Layout } from "./components/layout";
import { Private } from "./routes/Private";
import { Favorites } from "./pages/dashboard/favorites";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/car/:id",
        element: <CarDetail />,
      },
      {
        path: "/dashboard",
        element: (
          <Private>
            <Dashboard />
          </Private>
        ),
      },
      {
        path: "/dashboard/new",
        element: (
          <Private>
            <New />
          </Private>
        ),
      },
      {
        path: "/dashboard/favorites",
        element: (
          <Private>
            <Favorites />
          </Private>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export { router };
