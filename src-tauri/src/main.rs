// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use enums::NoDataOrWithDataStruct;
use helpers::check_path::check_deploy_path;
use structs::start_project_struct::StartProjectStruct;
use std::{error::Error, fs::read_to_string, path::Path};
use structs::check_path_struct::{GetDeploymentDirectoryStruct, GetProjectCommandStruct};
use structs::parsed_deployment_dir_struct::ParsedDeploymentDirStruct;
use structs::publish_and_deploy_struct::{PublishAndDeployResultStruct, PublishAndDeployStruct};

use structs::returns_struct::CommandResultStruct;

use chrono::Local;

use crate::{
    helpers::check_path::check_solution_path, structs::parsed_solution_struct::ParsedSolutionStruct,
};
use log::{error, info, LevelFilter};
use log4rs::append::file::FileAppender;
use log4rs::config::{Appender, Config, Root};
use log4rs::encode::pattern::PatternEncoder;
mod enums;
mod helpers;
mod structs;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_projects(
    data: GetProjectCommandStruct,
) -> NoDataOrWithDataStruct<Vec<ParsedSolutionStruct>> {
    info!("Start getting projects list");
    let path_valid = check_solution_path(data.path);
    let deploy_path_valid = check_deploy_path(data.deploy_path);
    if path_valid.is_valid == false {
        error!("Solution path is not valid");
        let retval = CommandResultStruct::new(false, &path_valid.result);
        return NoDataOrWithDataStruct::NoData(retval);
    }
    if deploy_path_valid.is_valid == false {
        error!("Deployment path is not valid");
        let retval = CommandResultStruct::new(false, &deploy_path_valid.result);
        return NoDataOrWithDataStruct::NoData(retval);
    }
    let new_path = path_valid.result;
    let result_get_projects_in_solution = get_projects_in_solution(&new_path);
    match result_get_projects_in_solution {
        Ok(data) => {
            info!("Done getting projects list");
            let retval = CommandResultStruct::new_with_generic(true, "Solution parsed", data);
            return NoDataOrWithDataStruct::WithData(retval);
        }
        Err(err) => {
            error!("{:?}", err);
            let retval = CommandResultStruct::new(false, "Error parsing solution");
            return NoDataOrWithDataStruct::NoData(retval);
        }
    }
}

fn get_projects_in_solution(path: &str) -> Result<Vec<ParsedSolutionStruct>, Box<dyn Error>> {
    info!("Start getting projects in provided solution");
    let mut project_list = Vec::new();
    let solution_content = read_to_string(path)?;
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
    info!("Done getting projects in provided solution");
    Ok(project_list)
}

#[tauri::command]
async fn publish_and_deploy(
    data: PublishAndDeployStruct,
) -> NoDataOrWithDataStruct<PublishAndDeployResultStruct> {
    info!("Start executing publish and deploy command asynchronously");
    let mut success_vec: Vec<String> = Vec::<String>::new();
    let mut failed_vec: Vec<String> = Vec::<String>::new();
    let clean_sln_path = helpers::check_path::clean_path(&data.sln_path);
    let clean_deployment_path = helpers::check_path::clean_path(&data.deployment_path);
    println!("{}", &clean_deployment_path);
    for datum in data.project_list {
        match helpers::publish_and_deploy::publish(&clean_sln_path, &clean_deployment_path, &datum)
            .await
        {
            Ok(()) => {
                success_vec.push(datum.project_name.to_owned());
                info!("Successfully published {}", &datum.project_name);
            }
            Err(_err) => {
                failed_vec.push(datum.project_name.to_owned());
                error!("Fail to publish {}", &datum.project_name);
            }
        }
    }
    let result_vec = PublishAndDeployResultStruct::new(success_vec, failed_vec);
    let retval = CommandResultStruct::new_with_generic(
        true,
        "Done executing publish and deploy command asynchronously",
        result_vec,
    );
    info!("Done executing publish and deploy command asynchronously");
    return NoDataOrWithDataStruct::WithData(retval);
}

#[tauri::command]
fn load_deployment_dir(
    data: GetDeploymentDirectoryStruct,
) -> NoDataOrWithDataStruct<Vec<ParsedDeploymentDirStruct>> {
    info!("Start loading deployment dir");
    let deploy_path_valid = check_deploy_path(data.deploy_path);

    if deploy_path_valid.is_valid == false {
        error!("Deployment path is not valid");
        let retval = CommandResultStruct::new(false, &deploy_path_valid.result);
        return NoDataOrWithDataStruct::NoData(retval);
    }

    match get_projects_in_deployment_dir(&deploy_path_valid.result) {
        Ok(projects_in_deployment_dir) => {
            let retval = CommandResultStruct::new_with_generic(
                true,
                "Deployment dir content loaded",
                projects_in_deployment_dir,
            );
            return NoDataOrWithDataStruct::WithData(retval);
        }
        Err(_err) => {
            let retval = CommandResultStruct::new(false, "Error loading deployment dir content");
            return NoDataOrWithDataStruct::NoData(retval);
        }
    }
}

fn get_projects_in_deployment_dir(
    deployment_dir_path: &str,
) -> Result<Vec<ParsedDeploymentDirStruct>, Box<dyn Error>> {
    info!("Start getting projects in deployment dir");
    match helpers::run_page::get_project_list(deployment_dir_path) {
        Ok(project_list) => {
            info!("Done getting projects in deployment dir");
            Ok(project_list)
        }
        Err(_err) => {
            error!("Failed getting projects in deployment dir");
            return Err("Failed getting projects in deployment dir".into());
        }
    }
}

#[tauri::command]
fn start_selected_projects(data: StartProjectStruct) {
  println!("{:?}", data)
}

fn main() {
    let dirs_home_dir = dirs::home_dir();
    if let Some(home_path) = dirs_home_dir {
        // Current local time
        let now = Local::now();

        // Current local date
        let today = now.date_naive();

        let file_path = format!("log/dotnet-deploy-desktop-{}.log", today.format("%Y-%m-%d"));
        let my_home_path = Path::new(&home_path);
        let home_log_file_path = &my_home_path
            .join("Documents")
            .join("dotnet-deploy-desktop")
            .join(file_path);
        // Logging to log file.
        let logfile = FileAppender::builder()
            // Pattern: https://docs.rs/log4rs/*/log4rs/encode/pattern/index.html
            .encoder(Box::new(PatternEncoder::new(
                "[{d(%Y-%m-%d %H:%M:%S)} - {l} - {M}] {m}\n",
            )))
            .build(home_log_file_path)
            .unwrap();

        // Log Trace level output to file where trace is the default level
        // and the programmatically specified level to stderr.
        let config = Config::builder()
            .appender(Appender::builder().build("logfile", Box::new(logfile)))
            // .appender(
            //     Appender::builder()
            //         .filter(Box::new(ThresholdFilter::new(level)))
            //         .build("stderr", Box::new(stderr)),
            // )
            .build(
                Root::builder()
                    .appender("logfile")
                    // .appender("stderr")
                    .build(LevelFilter::Trace),
            )
            .unwrap();

        // Use this to change log levels at runtime.
        // This means you can change the default log level to trace
        // if you are trying to debug an issue and need more logs on then turn it off
        // once you are done.
        let _handle = log4rs::init_config(config).unwrap();
    }

    info!("App Started!");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            get_projects,
            publish_and_deploy,
            load_deployment_dir,
            start_selected_projects
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
