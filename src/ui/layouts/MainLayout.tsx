import { Outlet } from "react-router-dom";
import { Header } from "../components/Header.tsx";
import { Footer } from "../components/Footer.tsx";

export function MainLayout() {
  return (
    <div className="layout">
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
