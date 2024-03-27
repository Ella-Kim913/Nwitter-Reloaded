import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./compoments/layout"
import Home from "./routes/home"
import Profile from "./routes/propfile";
import Login from "./routes/login";
import Create_Account from "./routes/create-account";
import { createGlobalStyle, styled } from "styled-components";
import reset from "styled-reset";
import { useEffect, useState } from "react";
import LoadingScreen from "./compoments/loading-screen";
import { auth } from "./firsbase";
import ProtectedRoute from "./compoments/protected-route";
import PasswordReset from "./routes/password-reset";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><Layout /></ProtectedRoute>, //protect for the logined users
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
  {
    path: "/password-reset",
    element: <PasswordReset />
  },
]);

const GlobalStyles = createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }
  body {
    background-color: #D6D3F0;
    color:#0B3142;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  ::-webkit-scrollbar {
    display:none;
    }
`;


function App() {
  const [isLoading, setIsLoading] = useState(true);
  const init = async () => {
    //wait for firebase
    await auth.authStateReady();
    setIsLoading(false);
  };
  useEffect(() => {
    init();
  }, []);
  return (<Wrapper>
    <GlobalStyles />
    {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
  </Wrapper>
  );
}

export default App
