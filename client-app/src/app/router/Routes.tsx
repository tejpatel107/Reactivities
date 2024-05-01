import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import TestErrors from "../../features/errors/TestError";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";

export const routes : RouteObject[] = [
    { // this root route
        path : "/",
        element: <App />,
        children: [
            {path : "activities", element: <ActivityDashboard />},
            {path : "activities/:id", element: <ActivityDetails />},
            {path : "CreateActivity", element: <ActivityForm key="create" />},
            {path : "EditActivity/:id", element: <ActivityForm key="edit"/>},
            {path : "errors", element: <TestErrors />},
            {path : "not-found", element: <NotFound />},
            {path : "*", element: <Navigate replace to={"/not-found"}/>},
            {path : "server-error", element: <ServerError/>},
        ]
    },
]

export const router = createBrowserRouter(routes);