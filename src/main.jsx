import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import PrivateRouter from "./guard/PrivateRouter.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import { ToastContainer } from "react-toastify";
import Chat from "./pages/Chat.jsx";
import Projects from "./pages/Projects.jsx";
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store.js';
import { PersistGate } from "redux-persist/integration/react";
import Notifications from "./pages/Notifications.jsx";
import Profile from "./pages/Profile.jsx";
import AddPublication from "./pages/AddPublication.jsx";
import Games from "./pages/Games/Games.jsx";
import AddStories from "./pages/AddStories.jsx";
import LobbyWaiting from "./pages/Games/LobbyWaiting.jsx";
import ChatList from "./pages/ChatList.jsx";
import { setupInterceptors } from "./hooks/customAxios.js";
import QuizGame from "./pages/Games/QuizGame.jsx";
import SearchUsers from "./pages/SearchUsers.jsx";
import HangmanGame from "./components/HangmanGame/HangmanGame.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRouter>
        <App />
      </PrivateRouter>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/chat-list",
        element: <ChatList />,
      },
      {
        path: "/chat/:roomId",
        element: <Chat />,
      },
      {
        path: "/projects",
        element: <Projects />,
      },
      {
        path: "/games",
        element: <Games />,
      },
      {
        path: "/games/:name/lobby",
        element: <LobbyWaiting />,
      },
      {
        path: "/notifications",
        element: <Notifications />,
      },
      {
        path: "/profile/:username",
        element: <Profile />,
      },
      {
        path: "/addPublication",
        element: <AddPublication />,
      },
      {
        path: "/addStories",
        element: <AddStories />,
      },
      {
        path: "/games/Quiz/room/:roomId",
        element: <QuizGame />,
      },
      {
        path: "/games/hangman",
        element: <HangmanGame />,
      },
      {
        path: "/search-users",
        element: <SearchUsers/>
      }
    ],
  },
  {
    path: "/login",
    element: <Login />,
    //sariq
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <h1>Page not found</h1>,
  },
]);

setupInterceptors(store);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
        <ToastContainer />
      </PersistGate>
    </Provider>
  </StrictMode>
);


// 