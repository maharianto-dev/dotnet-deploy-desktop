import { ProjectModel } from "../ProjectModel";

export interface PublishAndDeployStruct {
  sln_path: string;
  deployment_path: string;
  project_list: ProjectModel[];
}
