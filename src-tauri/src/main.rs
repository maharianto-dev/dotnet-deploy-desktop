// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use enums::NoDataOrWithDataStruct;
use std::{error::Error, fs::read_to_string};

use structs::returns_struct::CommandResultStruct;

use crate::{
    helpers::check_path::check_solution_path, structs::parsed_solution_struct::ParsedSolutionStruct,
};

mod enums;
mod helpers;
mod structs;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_projects(path: &str) -> NoDataOrWithDataStruct<Vec<ParsedSolutionStruct>> {
    let path_valid = check_solution_path(path);
    if path_valid.is_valid == false {
        let retval = CommandResultStruct::new(false, &path_valid.result);
        return NoDataOrWithDataStruct::NoData(retval);
    }
    let new_path = path_valid.result;
    let result_get_projects_in_solution = get_projects_in_solution(&new_path);
    match result_get_projects_in_solution {
        Ok(data) => {
            let retval = CommandResultStruct::new_with_generic(true, "solution parsed", data);
            return NoDataOrWithDataStruct::WithData(retval);
        }
        Err(err) => {
            // error!("{:?}", err);
            let retval = CommandResultStruct::new(false, "Error parsing solution");
            return NoDataOrWithDataStruct::NoData(retval);
        }
    }
}

fn get_projects_in_solution(path: &str) -> Result<Vec<ParsedSolutionStruct>, Box<dyn Error>> {
    let mut project_list = Vec::new();
    println!("Reading solution file in {}", path);
    let solution_content = read_to_string(path)?;
    println!();
    println!("Contents:");
    let content_lines: Vec<_> = solution_content.lines().collect();
    for content_line in content_lines {
        if content_line.starts_with("Project") {
            let projects = content_line.split(" = ").collect::<Vec<&str>>();
            // check if project is a folder solution if yes then skip
            let mut project_type_id = projects[0].to_string();
            project_type_id = project_type_id
                .trim_start_matches("Project(\"{")
                .to_string();
            project_type_id = project_type_id.trim_end_matches("}\")").to_string();
            // only register if it is not type of solution folder
            if project_type_id != "2150E333-8FDC-42A3-9474-1A3956D46DE8" {
                project_list.push(ParsedSolutionStruct::init_from_sln_project_line_str(
                    &(projects[1].to_string()),
                ));
            }
        }
    }

    let project_count = &project_list.len();

    for proj in &project_list {
        println!("{:?}", proj);
    }
    println!("Found {} projects in solution", project_count);
    Ok(project_list)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, get_projects])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
