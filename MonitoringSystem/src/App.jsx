import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MainLayout } from "./layout/main-layout";

function App() {

  return (
    <div>
      <ToastContainer/>
      <MainLayout />
    </div>
  );
}

export default App;