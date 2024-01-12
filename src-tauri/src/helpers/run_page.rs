use std::{error::Error, fs};

use log::error;

use crate::structs::parsed_deployment_dir_struct::ParsedDeploymentDirStruct;

pub fn get_project_list(deploy_dir: &str) -> Result<Vec<ParsedDeploymentDirStruct>, Box<dyn Error>> {
    let mut parsed_deploy_dir = Vec::<ParsedDeploymentDirStruct>::new();
    let contents = fs::read_dir(deploy_dir);
    match contents {
        Ok(content_list) => {
            for content in content_list {
                match content {
                    Ok(content_value) => {
                        match content_value.file_type() {
                            Ok(file_type) => {
                                if file_type.is_dir() {
                                    let project = ParsedDeploymentDirStruct::new(
                                        content_value.file_name().to_str().unwrap().to_string(),
                                        content_value.path().as_os_str().to_str().unwrap().to_string(),
                                    );
                                    parsed_deploy_dir.push(project);
                                }
                            }
                            Err(_err) => {
                                error!("Error reading file type in deployment directory entry!");
                                return Err(
                                    "Error reading file type in deployment directory entry!".into(),
                                );
                            }
                        }
                        continue;
                    }
                    Err(_err) => {
                        error!("Error reading deployment directory entry!");
                        return Err("Error reading deployment directory entry!".into());
                    }
                }
            }
        }
        Err(_err) => {
            error!("Error walking through the deployment directory!");
            return Err("Error walking through the deployment directory!".into());
        }
    }
    Ok(parsed_deploy_dir)
}
