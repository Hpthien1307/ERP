import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { publicRoutes, privateRoutes } from "./routes"
import ProtectedRoute from "./routes/protectedRoute"
import AdminLayout from "./components/layout/adminLayout"
import { useEffect } from "react"
import { useAuth } from "./store/useAuth"
import { socket } from "./lib/socket"
const App = () => {
  const { checkAuth, isAuthenticated } = useAuth()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (isAuthenticated) {
      socket.connect()
    } else {
      socket.disconnect()
    }

    return () => {
      socket.disconnect()
    }
  }, [isAuthenticated])

  return (
    <Router>
      <Routes>
        {publicRoutes.map((item, index) => {
          const Page = item.component
          return <Route key={index} path={item.path} element={<Page />} />
        })}

        <Route>
          {privateRoutes.map((item, index) => {
            const Page = item.component
            return (
              <Route
                key={index}
                path={item.path}
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Page />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
            )
          })}
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}
export default App
