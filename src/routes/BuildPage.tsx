import { useState } from "react";
import Grid from "../containers/Grid";
import { invoke } from "@tauri-apps/api";
import { ProjectModel } from "../models/ProjectModel";
import { NoDataOrWithDataStructModel } from "../models/tauri/CommandResult";
import GridOperator from "../containers/GridOperator";

const BuildPage = () => {
  const [slnPath, setSlnPath] = useState("");
  const [projectList, setProjectList] = useState([] as ProjectModel[]);

  const handleSubmitClick = async () => {
    let retval = (await invoke("get_projects", {
      path: slnPath,
    })) as NoDataOrWithDataStructModel<ProjectModel[]>;
    if (retval.WithData != null) {
      setProjectList(retval.WithData.command_data);
    }

    if (retval.NoData != null) {
      console.log(retval.NoData.command_message);
      setProjectList([]);
    }
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
        <div className="w-5/12 overflow-y-auto">
          <Grid projectList={projectList} showMultiSelect={true} />
        </div>
        <div className="w-2/12">
          <GridOperator />
        </div>
        <div className="w-5/12 bg-red-300"></div>
      </div>
    </div>
  );
};

export default BuildPage;
