import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MainLayout } from "./layout/main-layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import RequirementManagement from "./components/RequirementMAnagement";
import UserTable from "./components/UserTable";

function App() {

  return (
    <div>
      <ToastContainer/>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/users" element={<UserTable />} />
            <Route path="/requirements" element={<RequirementManagement />} />
            <Route path="*" element={<h1>Not Found</h1>} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;