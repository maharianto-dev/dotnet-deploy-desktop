#[derive(Debug)]
pub struct CheckPathStruct {
    pub is_valid: bool,
    pub result: String,
}

impl CheckPathStruct {
    pub fn new(_is_valid: bool, _result: String) -> Self {
        CheckPathStruct {
            is_valid: _is_valid,
            result: _result,
        }
    }
}

#[derive(serde::Deserialize)]
pub struct GetProjectCommandStruct<'a> {
    pub path: &'a str,
    pub deploy_path: &'a str,
}

#[derive(serde::Deserialize)]
pub struct GetDeploymentDirectoryStruct<'a> {
    pub deploy_path: &'a str,
}
