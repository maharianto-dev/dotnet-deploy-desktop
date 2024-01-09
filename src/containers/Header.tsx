import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ResultTypeEnum, setResult } from "../redux/resultSlice";
import { RootState } from "../redux/store";

const Header = () => {
  const actionState = useSelector((state: RootState) => state.actionState.value);
  const [isActive, setActive] = useState("build");
  const navigate = useNavigate();
  let location = useLocation();
  const dispatch = useDispatch();

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

  const resetResultBox = () => {
    dispatch(
      setResult({
        type: ResultTypeEnum.EMPTY,
        message: null,
      })
    );
  };
  const handleNavButton = (type: string) => {
    resetResultBox();
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
        <button
          className={
            "btn btn-ghost text-base " +
            (isActive === "build" ? "btn-active" : "")
          }
          onClick={() => handleNavButton("build")}
          disabled={!actionState}
        >
          Publish
        </button>
        <button
          className={
            "btn btn-ghost text-base " +
            (isActive === "run" ? "btn-active" : "")
          }
          onClick={() => handleNavButton("run")}
          disabled={!actionState}
        >
          Run
        </button>
      </div>
    </div>
  );
};

export default Header;
