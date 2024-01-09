import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export const enum ResultTypeEnum {
  EMPTY,
  SUCCESS,
  ERROR,
  INFO,
}

export interface PublishResultState {
  type: ResultTypeEnum;
  message: string | null | Array<string>;
}

const initialPublishResultState: PublishResultState = {
  type: ResultTypeEnum.EMPTY,
  message: null,
};

export const resultSlice = createSlice({
  name: "publishResult",
  initialState: initialPublishResultState,
  reducers: {
    setResult: (state, action: PayloadAction<PublishResultState>) => {
      state.type = action.payload.type;
      state.message = action.payload.message;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setResult } = resultSlice.actions;

export default resultSlice.reducer;
