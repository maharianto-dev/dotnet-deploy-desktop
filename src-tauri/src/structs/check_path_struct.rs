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
