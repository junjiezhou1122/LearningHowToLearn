import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import ResourceDetail from "../pages/ResourceDetail";
import Forum from "../pages/Forum";
import LearningRecord from "../pages/LearningRecord";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "resource/:id",
        element: <ResourceDetail />,
      },
      {
        path: "forum",
        element: <Forum />,
      },
      {
        path: "learning-record",
        element: <LearningRecord />,
      },
    ],
  },
]);

export default router;
