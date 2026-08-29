import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>
      <header>
        <h1>PulseHire</h1>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;