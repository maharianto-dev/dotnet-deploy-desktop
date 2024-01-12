import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { ResultTypeEnum, setResult } from "../redux/resultSlice";
import { setActionFalse, setActionTrue } from "../redux/actionStateSlice";
import { GetDeploymentDirectoryStruct } from "../models/tauri/CheckPathStruct";
import { invoke } from "@tauri-apps/api";
import { NoDataOrWithDataStructModel } from "../models/tauri/CommandResult";
import { ParsedDeploymentDirStruct } from "../models/tauri/ParsedDeploymentDirStruct";
import GridDeploy from "../containers/GridDeploy";
import Toast, { ToastListModel, ToastSeverityEnum } from "../containers/Toast";
import { StartProjectStruct } from "../models/tauri/StartProjectStruct";

const RunPage = () => {
  const [deploymentPath, setDeploymentPath] = useState("");
  const [projectList, setProjectList] = useState(
    [] as ParsedDeploymentDirStruct[]
  );
  const [gridDeployedProjectList, setGridDeployedProjectList] = useState(
    [] as ParsedDeploymentDirStruct[]
  );
  const [gridDeployedSelectedProjectList, setGridDeployedSelectedProjectList] =
    useState([] as ParsedDeploymentDirStruct[]);
  const actionState = useSelector(
    (state: RootState) => state.actionState.value
  );

  const [toastList, setToastList] = useState([] as ToastListModel[]);

  const [currentButtonActionType, setCurrentButtonActionType] = useState(
    ButtonActionTypeEnum.Start
  );

  const [isActionButtonDisabled, setIsActionButtonDisabled] = useState(false);

  const enum ButtonActionTypeEnum {
    "Start",
    "StopAll",
  }

  useEffect(() => {
    if (
      gridDeployedSelectedProjectList == null ||
      gridDeployedSelectedProjectList.length === 0
    ) {
      setIsActionButtonDisabled(true);
    } else {
      setIsActionButtonDisabled(false);
    }
  }, [gridDeployedSelectedProjectList]);

  const dispatch = useDispatch();
  const resetResultBox = () => {
    dispatch(
      setResult({
        type: ResultTypeEnum.EMPTY,
        message: null,
      })
    );
  };

  const handleSubmitClick = async () => {
    resetResultBox();
    dispatch(setActionFalse());
    const sendData = {
      deploy_path: deploymentPath,
    } as GetDeploymentDirectoryStruct;
    const retval = (await invoke("load_deployment_dir", {
      data: sendData,
    })) as NoDataOrWithDataStructModel<ParsedDeploymentDirStruct[]>;
    console.log(retval);

    dispatch(setActionTrue());

    setProjectList([...[]]);
    setGridDeployedProjectList([...[]]);
    setGridDeployedSelectedProjectList([...[]]);

    if (retval.WithData != null) {
      setToastList((currVal) => [
        ...currVal,
        {
          id: Math.random() * ToastSeverityEnum.SUCCESS,
          message: retval.WithData?.command_message,
          severity: ToastSeverityEnum.SUCCESS,
        } as ToastListModel,
      ]);

      setProjectList([...(retval.WithData?.command_data ?? [])]);
      setGridDeployedProjectList([...(retval.WithData?.command_data ?? [])]);
    } else if (retval.NoData != null) {
      if (retval.NoData.command_result === false) {
        setToastList((currVal) => [
          ...currVal,
          {
            id: Math.random() * ToastSeverityEnum.WARN,
            message: retval.NoData?.command_message,
            severity: ToastSeverityEnum.WARN,
          } as ToastListModel,
        ]);
      }
    }
  };

  const gridDeployedProjectListChange = (
    state: ParsedDeploymentDirStruct[]
  ) => {
    setGridDeployedProjectList(state);
  };

  const gridDeployedSelectedProjectListChange = (
    state: ParsedDeploymentDirStruct[]
  ) => {
    setGridDeployedSelectedProjectList(state);
  };

  const handleActionClick = async () => {
    if (currentButtonActionType === ButtonActionTypeEnum.Start) {
      const sendData = {
        projects: gridDeployedSelectedProjectList,
      } as StartProjectStruct;
      console.log(sendData);
      const result = await invoke("start_selected_projects", {
        data: sendData,
      });
    }
  };

  return (
    <>
      <div className="flex flex-col flex-1 w-full gap-2 overflow-y-auto h-full max-h-full">
        <div className="flex flex-row gap-2 w-full items-end">
          <label className="flex grow form-control w-full">
            <div className="label">
              <span className="label-text">
                Backend deployment directory path (no whitespace in directory
                location)
              </span>
            </div>
            <input
              type="text"
              value={deploymentPath}
              onChange={(e) => setDeploymentPath(e.target.value)}
              placeholder="Path to your deployment directory (leave empty to disable auto-deploy)"
              className="input input-bordered w-full"
              disabled={!actionState}
            />
          </label>
          <button
            className="btn btn-accent"
            onClick={handleSubmitClick}
            disabled={!actionState}
          >
            Submit
          </button>
        </div>
        <div className="flex flex-row grow w-full max-h-full gap-2 overflow-y-auto gap-x-2">
          <div className="flex flex-col w-2/3 min-h-full max-h-full overflow-y-auto divide-y divide-double divide-black">
            <p className="text-lg bg-indigo-600">Project List</p>
            <GridDeploy
              projectList={projectList}
              showMultiSelect={true}
              showFilter={true}
              onGridLocalProjectListChange={gridDeployedProjectListChange}
              onGridSelectedProjectListChange={
                gridDeployedSelectedProjectListChange
              }
              localProjectList={gridDeployedProjectList}
              selectedGridItems={gridDeployedSelectedProjectList}
            />
          </div>
          <div className="h-full w-1/3 bg-red-400 flex flex-col justify-center items-center">
            <button
              className="btn btn-accent w-1/3"
              disabled={isActionButtonDisabled || !actionState}
              onClick={handleActionClick}
            >
              {currentButtonActionType === ButtonActionTypeEnum.Start
                ? "Start"
                : currentButtonActionType === ButtonActionTypeEnum.StopAll
                ? "Stop All"
                : null}
            </button>
          </div>
        </div>
      </div>
      <Toast toastList={toastList}></Toast>
    </>
  );
};

export default RunPage;
