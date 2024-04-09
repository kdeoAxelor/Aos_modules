import { createBrowserRouter } from "react-router-dom";
import Index from "app/views";
import AllTeams from "app/views/AllTeams";
import MyOpportunities from "app/views/MyOpportunities";
import Login from "./components/Login";
import Home from "./components/Home";
import CreateDataForm from "./views/AllTeams/Create";
import EditForm from "./views/AllTeams/Edit";
import CreateNewEntry from "./views/MyOpportunities/Create";
import GridView from "./views/MyOpportunities/GridView";
import EditOpportunity from "./views/MyOpportunities/Edit";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/",
    element: <Index />,
    children: [
      {
        path: "/homepage",
        element: <Home />,
      },
      {
        path: "/all-teams",
        element: <AllTeams />,
      },
      {
        path: "/all-teams/create-entry",
        element: <CreateDataForm />,
      },
      {
        path: "/all-teams/edit-entry/:id",
        element: <EditForm />,
      },
      {
        path: "all-teams/view-entry/:id",
        element: <EditForm />,
      },

      {
        path: "/my-opportunities",
        element: <MyOpportunities />,
      },
      {
        path: "/my-opportunities/grid-view",
        element: <GridView />,
      },
      {
        path: "/my-opportunities/create-entry",
        element: <CreateNewEntry />,
      },
      {
        path: "/my-opportunities/view-opportunity/:id",
        element: <EditOpportunity />,
      },
      {
        path: "/my-opportunities/edit-opportunity/:id",
        element: <EditOpportunity />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
