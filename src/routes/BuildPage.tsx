import { useState } from "react";
import Grid from "../containers/Grid";
import { invoke } from "@tauri-apps/api";
import { ProjectModel } from "../models/ProjectModel";
import { NoDataOrWithDataStructModel } from "../models/tauri/CommandResult";
import GridOperator from "../containers/GridOperator";
import { GridOperatorTypeEnum } from "../models/GridOperatorModel";
import { filterArrayOfObjectByArrayOfObject } from "../helpers/ArrayHelper";

const BuildPage = () => {
  const [slnPath, setSlnPath] = useState("");
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

  const handleSubmitClick = async () => {
    let retval = (await invoke("get_projects", {
      path: slnPath,
    })) as NoDataOrWithDataStructModel<ProjectModel[]>;
    if (retval.WithData != null) {
      setProjectList(retval.WithData.command_data);
    }

    if (retval.NoData != null) {
      setProjectList([]);
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
      default:
        break;
    }
  };

  const gridSelectionLocalProjectListChange = (state: ProjectModel[]) => {
    setGridSelectionLocalProjectList(state);
  };

  const gridSelectionSelectedProjectListChange = (state: ProjectModel[]) => {
    setGridSelectionSelectedProjectList(state);
  };

  return (
    <div className="flex flex-col flex-1 w-full gap-2 overflow-y-auto h-full max-h-full">
      <div className="">
        <label className="label">
          <span className="label-text">Backend .sln file path</span>
        </label>
        <div className="flex flex-row gap-2">
          <input
            type="text"
            value={slnPath}
            onChange={(e) => setSlnPath(e.target.value)}
            placeholder="Path to your .sln file"
            className="input input-bordered w-full"
          />
          <button className="btn btn-accent" onClick={handleSubmitClick}>
            Submit
          </button>
        </div>
      </div>
      <div className="flex flex-row grow w-full max-h-full gap-2 overflow-y-auto">
        <div className="flex flex-col w-5/12 min-h-full max-h-full overflow-y-auto">
          <p className="text-lg">Project List</p>
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
          <GridOperator onHandleGridButtonEvent={handleGridButtonEvent} />
        </div>
        <div className="flex flex-col w-5/12 min-h-full max-h-full overflow-y-auto">
          <p className="text-lg">Selected Project</p>
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
  );
};

export default BuildPage;
