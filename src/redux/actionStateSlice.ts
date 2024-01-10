import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface ActionState {
  value: boolean;
}

const initialState: ActionState = {
  value: true,
};

export const actionStateSlice = createSlice({
  name: "actionState",
  initialState: initialState,
  reducers: {
    setActionTrue: (state) => {
      state.value = true;
    },
    setActionFalse: (state) => {
      state.value = false;
    },
    setActionState: (state, action: PayloadAction<ActionState>) => {
      state.value = action.payload.value;
    },
  },
});

export const { setActionTrue, setActionFalse, setActionState } = actionStateSlice.actions;

export default actionStateSlice.reducer;
