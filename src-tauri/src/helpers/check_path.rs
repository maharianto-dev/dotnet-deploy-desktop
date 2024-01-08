use std::path::Path;

use log::{info, error};

use crate::structs::check_path_struct::CheckPathStruct;

pub fn check_solution_path(path: &str) -> CheckPathStruct {
    info!("Start checking solution path");
    let my_path = clean_path(path);

    let my_path_obj = Path::new(&my_path);
    if !my_path_obj.exists() {
        error!("Solution path not found");
        return CheckPathStruct::new(false, "Solution path not found".to_string());
    }

    if my_path_obj.is_dir() {
        error!("Solution path is directory");
        return CheckPathStruct::new(false, "Solution path is directory".to_string());
    }

    if let Some(my_path_extension) = my_path_obj.extension() {
        if let Some(my_path_extension_str) = my_path_extension.to_str() {
            if my_path_extension_str != "sln" {
                error!("Solution path is not .sln file");
                return CheckPathStruct::new(false, "Solution path is not .sln file".to_string());
            }
        } else {
            error!("Solution path is not .sln file");
            return CheckPathStruct::new(false, "Solution path is not .sln file".to_string());
        }
    } else {
        error!("Solution path is not .sln file");
        return CheckPathStruct::new(false, "Solution path is not .sln file".to_string());
    }
    info!("done checking solution path");
    return CheckPathStruct::new(true, my_path);
}

pub fn check_deploy_path(path: &str) -> CheckPathStruct {
    info!("Start checking deployment path");
    if path.trim() == "" {
        info!("Deployment path is not provided, skipping auto-deploy");
        return CheckPathStruct::new(true, "Deployment path is not provided, skipping auto-deploy".to_string());
    }

    let my_path = clean_path(path);

    let my_path_obj = Path::new(&my_path);
    if !my_path_obj.exists() {
        error!("Deployment path not found");
        return CheckPathStruct::new(false, "Deployment path not found".to_string());
    }

    if my_path_obj.is_dir() {
        info!("Done checking deployment path");
        return CheckPathStruct::new(true, my_path);
    } else {
        error!("Deployment path is not directory");
        return CheckPathStruct::new(false, "Deployment path is not directory".to_string());
    }
}

pub fn clean_path(path: &str) -> String {
    info!("Start cleaning path");
    let mut my_path = String::from(path);
    if my_path.starts_with("\"") {
        my_path = my_path.replacen("\"", "", 1);
    } else if my_path.starts_with("\'") {
        my_path = my_path.replacen("\'", "", 1);
    }

    if my_path.ends_with("\"") || my_path.ends_with("\'") {
        my_path.pop();
    }
    info!("Done cleaning path");
    my_path
}
