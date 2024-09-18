import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  Dashboard,
  HomeLayout,
  Landing,
  Login,
  Logout,
  Register,
  ForgotPassword,
  ResetPassword,
  DisplayItinerary,
  SavedItineraries,
  ItineraryDetail,
} from "./pages";
import { ToastContainer, toast } from "react-toastify";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
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
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
      {
        path: "forgotpassword",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password/:resetToken",
        element: <ResetPassword />,
      },
      {
        path: "/display-itinerary",
        element: <DisplayItinerary />,
      },
      {
        path: "/saved-itineraries",
        element: <SavedItineraries />,
      },
      {
        path: "/itinerary/:id",
        element: <ItineraryDetail />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-center" />
    </>
  );
}

export default App;
