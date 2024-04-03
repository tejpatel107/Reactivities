import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";

export const routes : RouteObject[] = [
    { // this root route
        path : "/",
        element: <App />,
        children: [
            {path : "activities", element: <ActivityDashboard />},
            {path : "activities/:id", element: <ActivityDetails />},
            {path : "CreateActivity", element: <ActivityForm key="create" />},
            {path : "EditActivity/:id", element: <ActivityForm key="edit"/>},
        ]
    },
]

export const router = createBrowserRouter(routes);