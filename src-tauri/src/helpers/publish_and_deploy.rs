use std::{
    error::Error,
    path::PathBuf,
    process::{Command, Output, Stdio},
};

use log::{error, info};

use crate::structs::parsed_solution_struct::ParsedSolutionStruct;

pub async fn publish(sln_path: &str, project: &ParsedSolutionStruct) -> Result<(), Box<dyn Error>> {
    info!(
        "Start publishing selected project {} with release configuration",
        project.project_name
    );
    let mut sln_path_obj = PathBuf::from(sln_path);
    let sln_path_dir = sln_path_obj.pop();
    match sln_path_dir {
        true => {
            let full_project_path = sln_path_obj.join(&project.project_relative_path);
            match full_project_path.exists() {
                true => match run_publish_command(&full_project_path).await {
                    Ok(()) => {
                        info!("{:?} PUBLISHED", full_project_path);
                    }
                    Err(_err) => {
                        error!("Cannot publish {:?}", full_project_path);
                        return Err(format!("Cannot publish {:?}", full_project_path).into());
                    }
                },
                false => {
                    error!("{:?} not found!", &full_project_path);
                    return Err(format!("{:?} not found!", &full_project_path).into());
                }
            }
        }
        false => {
            error!("Wrong solution path dir!");
            return Err("Wrong solution path dir".into());
        }
    }
    info!(
        "Done publishing selected project {} with release configuration",
        project.project_name
    );
    Ok(())
}

async fn run_publish_command(full_project_path: &PathBuf) -> Result<(), Box<dyn Error>> {
    info!(
        "Start executing publish command for {:?}",
        full_project_path
    );
    let mut cmd;
    let mut full_project_dir = full_project_path.to_owned();
    let project_dir = full_project_dir.pop();
    match project_dir {
        true => {
            let my_command = format!(
                "dotnet publish {:?} --configuration Release",
                full_project_path
            );
            info!("Running command: {}", &my_command);
            if cfg!(target_os = "windows") {
                cmd = Command::new(format!("cmd"));
                let child = cmd
                    .args(vec!["/C", &my_command])
                    .current_dir(full_project_dir)
                    .stdout(Stdio::piped())
                    .stderr(Stdio::piped())
                    .spawn();
                match child {
                    Ok(child_process) => {
                        let output = child_process.wait_with_output();
                        match output {
                            Ok(process_output) => match handle_command_child(&process_output) {
                                true => {}
                                false => {
                                    error!(
                                        "One or more error(s) found when publishing {:?}",
                                        full_project_path
                                    );
                                    return Err(format!(
                                        "One or more error(s) found when publishing {:?}",
                                        full_project_path
                                    )
                                    .into());
                                }
                            },
                            Err(_err) => {
                                error!(
                                    "Failed executing process to publish {:?}",
                                    full_project_path
                                );
                                return Err(format!(
                                    "Failed executing process to publish {:?}",
                                    full_project_path
                                )
                                .into());
                            }
                        }
                    }
                    Err(_err) => {
                        error!("Failed spawning process to publish {:?}", full_project_path);
                        return Err(format!(
                            "Failed spawning process to publish {:?}",
                            full_project_path
                        )
                        .into());
                    }
                }
                // println!("{:?}", &output.stdout);
                // println!("{:?}", &output.stderr);
            } else {
                cmd = Command::new(format!("sh"));
                let child = cmd
                    .args(vec!["-c", &my_command])
                    .current_dir(full_project_dir)
                    .stdout(Stdio::piped())
                    .stderr(Stdio::piped())
                    .spawn();
                match child {
                    Ok(child_process) => {
                        let output = child_process.wait_with_output();
                        match output {
                            Ok(process_output) => match handle_command_child(&process_output) {
                                true => {}
                                false => {
                                    error!(
                                        "One or more error(s) found when publishing {:?}",
                                        full_project_path
                                    );
                                    return Err(format!(
                                        "One or more error(s) found when publishing {:?}",
                                        full_project_path
                                    )
                                    .into());
                                }
                            },
                            Err(_err) => {
                                error!(
                                    "Failed executing process to publish {:?}",
                                    full_project_path
                                );
                                return Err(format!(
                                    "Failed executing process to publish {:?}",
                                    full_project_path
                                )
                                .into());
                            }
                        }
                    }
                    Err(_err) => {
                        error!("Failed spawning process to publish {:?}", full_project_path);
                        return Err(format!(
                            "Failed spawning process to publish {:?}",
                            full_project_path
                        )
                        .into());
                    }
                }
            };
        }
        false => {
            error!("Wrong project path dir!");
            return Err("Wrong project path dir".into());
        }
    }
    info!("Done executing publish command for {:?}", full_project_path);
    Ok(())
}

fn handle_command_child(process_output: &Output) -> bool {
    info!("{}", process_output.status);
    println!("{}", process_output.status);
    if process_output.status.success() {
        let normal_stdout = std::str::from_utf8(&process_output.stdout).unwrap();
        let split_stdout: Vec<&str> = normal_stdout.split("\\n").collect();

        for ii in 0..split_stdout.len() {
            info!("{}", split_stdout[ii]);
        }
        true
    } else {
        match process_output.status.code() {
            Some(code) => {
                if code == 1 {
                    let normal_stdout = std::str::from_utf8(&process_output.stdout).unwrap();
                    let split_stdout: Vec<&str> = normal_stdout.split("\\n").collect();

                    for ii in 0..split_stdout.len() {
                        info!("{}", split_stdout[ii]);
                    }
                }
                false
            }
            None => {
                error!(
                    "No status code after spawning child process! Process terminated by a signal!"
                );
                false
            }
        }
    }
}
