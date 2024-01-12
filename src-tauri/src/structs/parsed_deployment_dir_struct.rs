#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct ParsedDeploymentDirStruct {
    pub project_name: String,
    pub project_path: String,
}

impl ParsedDeploymentDirStruct {
    pub fn new(_project_name: String, _project_path: String) -> ParsedDeploymentDirStruct {
        return ParsedDeploymentDirStruct {
            project_name: _project_name,
            project_path: _project_path,
        };
    }
}
