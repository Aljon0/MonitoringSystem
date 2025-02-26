import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserTable from "./components/UserTable";

function App() {
  return (
    <div>
      <RegisterForm />
      <LoginForm />
      <ToastContainer />
      <UserTable/>
    </div>
  );
}

export default App;