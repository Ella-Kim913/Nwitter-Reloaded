import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./compoments/layout"
import Home from "./routes/home"
import Profile from "./routes/propfile";
import Login from "./routes/login";
import Create_Account from "./routes/create-account";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />
      }

    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/create-account",
    element: <Create_Account />
  },
]);

const GlobalStyles = createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }
  body {
    background-color: black;
    color:white;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

function App() {
  return <>
    <GlobalStyles />
    <RouterProvider router={router} />
  </>;
}

export default App
