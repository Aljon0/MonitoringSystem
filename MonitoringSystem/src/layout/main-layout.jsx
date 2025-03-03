import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  

  return (
    <>
      <div className="main-layout">
        <div className="main-layout__content">
          <div className="main-layout__content--right">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
