#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct ParsedSolutionStruct {
    pub project_name: String,
    pub project_relative_path: String,
    pub project_id: String,
}

impl ParsedSolutionStruct {
    pub fn init_from_sln_project_line_str(sln_project_line: &str) -> ParsedSolutionStruct {
        let splitted_project_metadata = sln_project_line.split(", ").collect::<Vec<&str>>();
        let project_name = splitted_project_metadata[0]
            .trim_start_matches("\"")
            .trim_end_matches("\"");
        let project_relative_path = splitted_project_metadata[1]
            .trim_start_matches("\"")
            .trim_end_matches("\"");
        let project_id = splitted_project_metadata[2]
            .trim_start_matches("\"{")
            .trim_end_matches("}\"");
        return ParsedSolutionStruct {
            project_name: project_name.to_string(),
            project_relative_path: project_relative_path.to_string(),
            project_id: project_id.to_string(),
        };
    }
}
