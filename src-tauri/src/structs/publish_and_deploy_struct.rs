use super::parsed_solution_struct::ParsedSolutionStruct;

#[derive(serde::Deserialize)]
pub struct PublishAndDeployStruct {
    pub sln_path: String,
    pub deployment_path: String,
    pub project_list: Vec<ParsedSolutionStruct>,
}

#[derive(serde::Serialize)]
pub struct PublishAndDeployResultStruct {
    pub succeeded_projects: Vec<String>,
    pub failed_projects: Vec<String>,
}

impl PublishAndDeployResultStruct {
    pub fn new(
        _succeeded_projects: Vec<String>,
        _failed_projects: Vec<String>,
    ) -> PublishAndDeployResultStruct {
        return PublishAndDeployResultStruct {
            succeeded_projects: _succeeded_projects,
            failed_projects: _failed_projects,
        };
    }
}
