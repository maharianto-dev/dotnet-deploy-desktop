export interface NoDataOrWithDataStructModel<T> {
		NoData? : CommandResultStruct<T>,
    WithData? : CommandResultStruct<T>,
}

export interface CommandResultStruct<T> {
	command_result: boolean,
	command_message: string,
	command_data: T,
}