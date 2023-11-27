use std::path::Path;

use crate::structs::check_path_struct::CheckPathStruct;

pub fn check_solution_path(path: &str) -> CheckPathStruct {
    let mut retval = false;
    let mut my_path = String::from(path);
    if my_path.starts_with("\"") {
        my_path = my_path.replacen("\"", "", 1);
    } else if my_path.starts_with("\'") {
        my_path = my_path.replacen("\'", "", 1);
    }

    if my_path.ends_with("\"") || my_path.ends_with("\'") {
        my_path.pop();
    }

    let my_path_obj = Path::new(&my_path);
    if !my_path_obj.exists() {
        return CheckPathStruct::new(false, "path not found".to_string());
    }

    if my_path_obj.is_dir() {
        return CheckPathStruct::new(false, "path is directory".to_string());
    }

    if let Some(my_path_extension) = my_path_obj.extension() {
        if let Some(my_path_extension_str) = my_path_extension.to_str() {
            if my_path_extension_str != "sln" {
                return CheckPathStruct::new(false, "path is not .sln file".to_string());
            }
        } else {
            return CheckPathStruct::new(false, "path is not .sln file".to_string());
        }
    } else {
        return CheckPathStruct::new(false, "path is not .sln file".to_string());
    }

    return CheckPathStruct::new(true, my_path);
}
