use std::{
    error::Error,
    path::{Path, PathBuf},
    process::Command,
};

use log::{error, info};

use crate::structs::parsed_solution_struct::ParsedSolutionStruct;

pub async fn publish(sln_path: &str, project: &ParsedSolutionStruct) -> Result<(), Box<dyn Error>> {
    println!("{}", sln_path);
    println!("{:?}", project);
    let mut sln_path_obj = PathBuf::from(sln_path);
    println!("path buf of base dir {:?}", &sln_path_obj);
    let sln_path_dir = sln_path_obj.pop();
    match sln_path_dir {
        true => {
            println!("sln path dir {:?}", &sln_path_obj);
            let full_project_path = sln_path_obj.join(&project.project_relative_path);
            println!("full project path: {:?}", &full_project_path);
            match full_project_path.exists() {
                true => {
                    println!("path exists");
                    match run_publish_command(&full_project_path).await {
                        Ok(()) => {
                            info!("{:?} BUILT", full_project_path);
                        }
                        Err(err) => {
                            error!("Cannot build {:?}", full_project_path);
                            return Err("Cannot build".into());
                        }
                    }
                }
                false => {
                    error!("{:?} not found!", &full_project_path);
                    return Err(format!("{:?} not found!", &full_project_path).into());
                }
            }
            println!("{:?}", &full_project_path);
        }
        false => {
            error!("Wrong solution path dir!");
            return Err("Wrong solution path dir".into());
        }
    }
    println!("{:?}", &sln_path_obj);
    Ok(())
}

async fn run_publish_command(full_project_path: &PathBuf) -> Result<(), Box<dyn Error>> {
    let mut cmd;
    let mut full_project_dir = full_project_path.to_owned();
    let project_dir = full_project_dir.pop();
    match project_dir {
        true => {
            let my_command = format!("dotnet publish {:?} --configuration Release", full_project_path);
            println!("running command {}", &my_command);
            println!("on dir {:?}", full_project_dir);
            if cfg!(target_os = "windows") {
                cmd = Command::new(format!("cmd"));
                let output = cmd
                    .args(vec!["/C", &my_command])
                    .current_dir(full_project_dir)
                    .spawn()?;
                  // println!("{:?}", &output.stdout);
                  // println!("{:?}", &output.stderr);
            } else {
                cmd = Command::new(format!("sh"));
                let output = cmd
                    .args(vec!["-c", &my_command])
                    .current_dir(full_project_dir)
                    .spawn()?;
            };
        }
        false => {
            error!("Wrong project path dir!");
            return Err("Wrong project path dir".into());
        }
    }
    Ok(())
}
