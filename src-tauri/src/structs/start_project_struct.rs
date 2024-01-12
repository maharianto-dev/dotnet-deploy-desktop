use super::parsed_deployment_dir_struct::ParsedDeploymentDirStruct;

#[derive(Debug, serde::Deserialize)]
pub struct StartProjectStruct {
    pub projects: Vec<ParsedDeploymentDirStruct>,
}
