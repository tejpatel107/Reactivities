import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import LoginForm from "../../features/users/LoginForm";
import ProfilePage from "../../features/profile/ProfilePage";
import RequireAuth from "./RequireAuth";

export const routes: RouteObject[] = [
    { // this root route
        path: "/",
        element: <App />,
        children: [
            {
                element: <RequireAuth />,
                children: [
                    { path: "activities", element: <ActivityDashboard /> },
                    { path: "activities/:id", element: <ActivityDetails /> },
                    { path: "activities/:id/attend", element: <ActivityDetails /> },
                    { path: "createActivity", element: <ActivityForm key="create" /> },
                    { path: "manageActivity/:id", element: <ActivityForm key="edit" /> },
                    { path: "profiles/:username", element: <ProfilePage /> },
                    { path: "login", element: <LoginForm /> },
                ]
            },
            { path: "not-found", element: <NotFound /> },
            { path: "*", element: <Navigate replace to={"/not-found"} /> },
            { path: "server-error", element: <ServerError /> },
        ]
    },
]

export const router = createBrowserRouter(routes);