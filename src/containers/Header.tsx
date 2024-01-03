import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const [isActive, setActive] = useState("build");
  const navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
    switch (location?.pathname) {
      case "/build-page":
        setActive("build");
        break;
      case "/run-page":
        setActive("run");
        break;
      default:
        break;
    }
  }, []);

  const handleNavButton = (type: string) => {
    switch (type) {
      case "build":
        setActive("build");
        navigate("/build-page");
        break;
      case "run":
        setActive("run");
        navigate("/run-page");
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col">
      <div>
        <h1 className="px-2 text-3xl">.NET Deploy GUI</h1>
      </div>
      <div className="navbar p-0">
        <a
          className={
            "btn btn-ghost text-base " +
            (isActive === "build" ? "btn-active" : "")
          }
          onClick={() => handleNavButton("build")}
        >
          Publish
        </a>
        <a
          className={
            "btn btn-ghost text-base " +
            (isActive === "run" ? "btn-active" : "")
          }
          onClick={() => handleNavButton("run")}
        >
          Run
        </a>
      </div>
    </div>
  );
};

export default Header;
