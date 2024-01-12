import { useState } from "react";
import Grid from "../containers/Grid";
import { invoke } from "@tauri-apps/api";
import { ProjectModel } from "../models/ProjectModel";
import { NoDataOrWithDataStructModel } from "../models/tauri/CommandResult";
import GridOperator from "../containers/GridOperator";
import { GridOperatorTypeEnum } from "../models/GridOperatorModel";
import { filterArrayOfObjectByArrayOfObject } from "../helpers/ArrayHelper";
import { GetProjectCommandStruct } from "../models/tauri/CheckPathStruct";
import Toast, { ToastListModel, ToastSeverityEnum } from "../containers/Toast";
import {
  PublishAndDeployResultStruct,
  PublishAndDeployStruct,
} from "../models/tauri/PublishAndDeployStruct";
import { useDispatch, useSelector } from "react-redux";
import {
  PublishResultState,
  ResultTypeEnum,
  setResult,
} from "../redux/resultSlice";
import { setActionFalse, setActionTrue } from "../redux/actionStateSlice";
import { RootState } from "../redux/store";

const BuildPage = () => {
  const [slnPath, setSlnPath] = useState("");
  const [deploymentPath, setDeploymentPath] = useState("");
  const [projectList, setProjectList] = useState([] as ProjectModel[]);
  // initial / left grid
  const [gridInitialLocalProjectList, setGridInitialLocalProjectList] =
    useState([] as ProjectModel[]);
  const [gridInitialSelectedProjectList, setGridInitialSelectedProjectList] =
    useState([] as ProjectModel[]);

  // selection / right grid
  const [gridSelectionLocalProjectList, setGridSelectionLocalProjectList] =
    useState([] as ProjectModel[]);
  const [
    gridSelectionSelectedProjectList,
    setGridSelectionSelectedProjectList,
  ] = useState([] as ProjectModel[]);

  const [enableBuildAndDeployButton, setEnableBuildAndDeployButton] =
    useState(false);
  const [buildAndDeployButtonText, setBuildAndDeployButtonText] =
    useState("Publish");
  const [toastList, setToastList] = useState([] as ToastListModel[]);
  const [publishSummaryMessage, setPublishSummaryMessage] = useState('');

  const dispatch = useDispatch();
  const actionState = useSelector(
    (state: RootState) => state.actionState.value
  );

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
      path: slnPath,
      deploy_path: deploymentPath,
    } as GetProjectCommandStruct;
    const retval = (await invoke("get_projects", {
      data: sendData,
    })) as NoDataOrWithDataStructModel<ProjectModel[]>;
    setProjectList([...[]]);
    setGridInitialLocalProjectList([...[]]);
    setGridInitialSelectedProjectList([...[]]);
    setGridSelectionLocalProjectList([...[]]);
    setGridSelectionSelectedProjectList([...[]]);
    setEnableBuildAndDeployButton(false);

    dispatch(setActionTrue());
    if (retval.WithData != null) {
      if (retval.WithData.command_result === true) {
        setProjectList(retval.WithData.command_data);
        setEnableBuildAndDeployButton(true);
        if (deploymentPath != null && deploymentPath.trim() !== "") {
          setBuildAndDeployButtonText("Publish And Deploy");
          setPublishSummaryMessage(`Solution read from ${slnPath} and will deploy to ${deploymentPath}`);
        } else {
          setBuildAndDeployButtonText("Publish");
          setPublishSummaryMessage(`Solution read from ${slnPath}`);
        }
        setToastList((currval) => [
          ...currval,
          {
            id: Math.random() * ToastSeverityEnum.SUCCESS,
            message: "Solution file succesfully loaded",
            severity: ToastSeverityEnum.SUCCESS,
          } as ToastListModel,
        ]);



      } else {
        setToastList((currval) => [
          ...currval,
          {
            id: Math.random() * ToastSeverityEnum.WARN,
            message: retval.WithData?.command_message,
            severity: ToastSeverityEnum.WARN,
          } as ToastListModel,
        ]);
      }
    }

    if (retval.NoData != null) {
      setProjectList([]);
      if (retval.NoData.command_result === false) {
        setToastList((currval) => [
          ...currval,
          {
            id: Math.random() * ToastSeverityEnum.WARN,
            message: retval.NoData?.command_message,
            severity: ToastSeverityEnum.WARN,
          } as ToastListModel,
        ]);
      }
    }
  };

  const gridInitialLocalProjectListChange = (state: ProjectModel[]) => {
    setGridInitialLocalProjectList(state);
  };

  const gridInitialSelectedProjectListChange = (state: ProjectModel[]) => {
    setGridInitialSelectedProjectList(state);
  };

  const handleGridButtonEvent = (gridOperatorType: GridOperatorTypeEnum) => {
    switch (gridOperatorType) {
      case GridOperatorTypeEnum.MoveAllRight: {
        const notInSelection = filterArrayOfObjectByArrayOfObject(
          gridInitialLocalProjectList,
          gridSelectionLocalProjectList
        );
        const selected = [...gridSelectionLocalProjectList, ...notInSelection];
        selected.sort((row1, row2) => {
          const row1Name = row1.project_name;
          const row2Name = row2.project_name;
          if (row1Name < row2Name) return -1;
          if (row1Name > row2Name) return 1;
          return 0;
        });
        setGridSelectionLocalProjectList([...selected]);
        break;
      }
      case GridOperatorTypeEnum.MoveSelectedRight: {
        const notInSelection = filterArrayOfObjectByArrayOfObject(
          gridInitialSelectedProjectList,
          gridSelectionLocalProjectList
        );
        const selected = [...gridSelectionLocalProjectList, ...notInSelection];
        selected.sort((row1, row2) => {
          const row1Name = row1.project_name;
          const row2Name = row2.project_name;
          if (row1Name < row2Name) return -1;
          if (row1Name > row2Name) return 1;
          return 0;
        });
        setGridSelectionLocalProjectList([...selected]);
        break;
      }
      case GridOperatorTypeEnum.MoveSelectedLeft: {
        const notInSelection = filterArrayOfObjectByArrayOfObject(
          gridSelectionLocalProjectList,
          gridSelectionSelectedProjectList
        );
        setGridSelectionLocalProjectList([...notInSelection]);
        setGridSelectionSelectedProjectList([...[]]);
        break;
      }
      case GridOperatorTypeEnum.MoveAllLeft:
        setGridSelectionLocalProjectList([...[]]);
        setGridSelectionSelectedProjectList([...[]]);
        break;
      case GridOperatorTypeEnum.BuildAndDeploy:
        resetResultBox();
        doBuildAndDeploy();
        break;
      default:
        break;
    }
  };

  const doBuildAndDeploy = async () => {
    dispatch(setActionFalse());
    let sendData = {
      sln_path: slnPath,
      deployment_path: deploymentPath,
      project_list: [...gridSelectionLocalProjectList],
    } as PublishAndDeployStruct;
    let retval = (await invoke("publish_and_deploy", {
      data: sendData,
    })) as NoDataOrWithDataStructModel<PublishAndDeployResultStruct>;
    dispatch(setActionTrue());
    if (retval != null) {
      if (retval?.WithData?.command_result === true) {
        dispatch(
          setResult({
            type: ResultTypeEnum.INFO,
            message: `Done ${buildAndDeployButtonText}\nSucceeded Projects: ${retval?.WithData?.command_data.succeeded_projects.join(
              ", "
            )}\nFailed Projects: ${retval?.WithData?.command_data.failed_projects.join(
              ", "
            )}\nCheck the log at ${'"<home dir>/dotnet-desktop-deploy/log"'} for more detail`,
          } as PublishResultState)
        );
      } else {
        dispatch(
          setResult({
            type: ResultTypeEnum.ERROR,
            message: `Failed publishing and deploying project(s), please check the log at ${'"<home dir>/dotnet-desktop-deploy/log"'}\n${
              retval?.WithData?.command_message
            }`,
          })
        );
      }
    } else {
      dispatch(
        setResult({
          type: ResultTypeEnum.ERROR,
          message: `Failed publishing and deploying project(s), please check the log at ${'"<home dir>/dotnet-desktop-deploy/log"'}`,
        })
      );
      // <p>{`Error building and deploying angular app(s). Please check your log at ${'"<home dir>/angular-deploy-gui/log"'}`}</p>
    }
  };

  const gridSelectionLocalProjectListChange = (state: ProjectModel[]) => {
    setGridSelectionLocalProjectList(state);
  };

  const gridSelectionSelectedProjectListChange = (state: ProjectModel[]) => {
    setGridSelectionSelectedProjectList(state);
  };

  return (
    <>
      <div className="flex flex-col flex-1 w-full gap-2 overflow-y-auto h-full max-h-full">
        <div className="flex flex-row gap-2 w-full items-end">
          <label className="flex grow form-control w-full">
            <div className="label">
              <span className="label-text">Backend .sln file path</span>
            </div>
            <input
              type="text"
              value={slnPath}
              onChange={(e) => setSlnPath(e.target.value)}
              placeholder="Path to your .sln file"
              className="input input-bordered w-full"
              disabled={!actionState}
            />
          </label>
          <label className="flex grow form-control w-full">
            <div className="label">
              <span className="label-text">
                Backend deployment directory path (no whitespace in directory location)
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
        <p>{publishSummaryMessage}</p>
        <div className="flex flex-row grow w-full max-h-full gap-2 overflow-y-auto">
          <div className="flex flex-col w-5/12 min-h-full max-h-full overflow-y-auto divide-y divide-double divide-black">
            <p className="text-lg bg-indigo-600">Project List</p>
            <Grid
              projectList={projectList}
              showMultiSelect={true}
              showFilter={true}
              onGridLocalProjectListChange={gridInitialLocalProjectListChange}
              onGridSelectedProjectListChange={
                gridInitialSelectedProjectListChange
              }
              localProjectList={gridInitialLocalProjectList}
              selectedGridItems={gridInitialSelectedProjectList}
            />
          </div>
          <div className="w-2/12">
            <GridOperator
              onHandleGridButtonEvent={handleGridButtonEvent}
              enableBuildAndDeployButton={enableBuildAndDeployButton}
              buildAndDeployButtonText={buildAndDeployButtonText}
            />
          </div>
          <div className="flex flex-col w-5/12 min-h-full max-h-full overflow-y-auto divide-y divide-double divide-black">
            <p className="text-lg bg-indigo-600">List of Project To Build</p>
            <Grid
              projectList={null}
              showMultiSelect={true}
              showFilter={false}
              onGridLocalProjectListChange={gridSelectionLocalProjectListChange}
              onGridSelectedProjectListChange={
                gridSelectionSelectedProjectListChange
              }
              localProjectList={gridSelectionLocalProjectList}
              selectedGridItems={gridSelectionSelectedProjectList}
            ></Grid>
          </div>
        </div>
      </div>
      <Toast toastList={toastList}></Toast>
    </>
  );
};

export default BuildPage;
