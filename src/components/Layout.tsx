import React, { ReactNode } from "react";
import Header from "../containers/Header";
import { Outlet } from "react-router-dom";

interface Props {
  children?: ReactNode;
  // any props that come into the component
}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col h-screen overflow-y-auto">
      <div className="flex flex-shrink-0 flex-col h-1/8 w-full bg-slate-800 p-2">
        <Header />
      </div>
      <div className="flex bg-cyan-800 p-4 grow max-h-[87vh]">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
