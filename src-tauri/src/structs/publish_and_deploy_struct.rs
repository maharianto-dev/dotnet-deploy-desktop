use super::parsed_solution_struct::ParsedSolutionStruct;

pub struct PublishAndDeployStruct {
  pub sln_path: String,
  pub deployment_path: String,
  pub project_list: Vec<ParsedSolutionStruct>,
}