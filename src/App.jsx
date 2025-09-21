import { createHashRouter, RouterProvider } from "react-router-dom"
import AuthLayout from "./Layouts/AuthLayout"
import MainLayout from "./Layouts/MainLayout"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import FeedPage from "./pages/FeedPage"
import PostDetailsPage from "./pages/PostDetailsPage"
import ProfilePage from "./pages/ProfilePage"
import NotFoundPage from "./pages/NotFoundPage"


function App() {
const router = createHashRouter([
  {path: "", element:<AuthLayout/>, children:[
    {path: "login", element:<LoginPage/>},
    {path: "register", element:<RegisterPage/>},
  ]},
  {path: "", element:<MainLayout/>, children:[
    {index: true, element:<FeedPage/>},
    {path: "post-details", element:<PostDetailsPage/>},
    {path: "profile", element:<ProfilePage/>},
    {path: "*", element:<NotFoundPage/>},
  ]}
])
  return (
   <>
   <RouterProvider router={router} />
   </>
  )
}

export default App
