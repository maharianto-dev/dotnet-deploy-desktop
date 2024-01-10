import { useSelector } from "react-redux";
import { GridOperatorTypeEnum } from "../models/GridOperatorModel";
import { RootState } from "../redux/store";

function GridOperator({
  onHandleGridButtonEvent,
  enableBuildAndDeployButton = false,
  buildAndDeployButtonText = "Publish",
}: {
  onHandleGridButtonEvent: (gridOperatorType: GridOperatorTypeEnum) => void;
  enableBuildAndDeployButton?: boolean;
  buildAndDeployButtonText?: string;
}) {
  const actionState = useSelector((state: RootState) => state.actionState.value);
  return (
    <div className="flex flex-col justify-center bg-blue-600 min-h-full max-h-full gap-12">
      <div className="flex flex-row justify-center">
        <button
          className="btn btn-secondary aspect-auto w-5/6"
          onClick={() =>
            onHandleGridButtonEvent(GridOperatorTypeEnum.MoveAllRight)
          }
          disabled={!actionState}
        >
          Move All Right
        </button>
      </div>
      <div className="flex flex-row justify-center">
        <button
          className="btn btn-secondary aspect-auto w-5/6"
          onClick={() =>
            onHandleGridButtonEvent(GridOperatorTypeEnum.MoveSelectedRight)
          }
          disabled={!actionState}
        >
          Move Selected Right
        </button>
      </div>
      <div className="flex flex-row justify-center">
        <button
          className="btn btn-secondary aspect-auto w-5/6"
          onClick={() =>
            onHandleGridButtonEvent(GridOperatorTypeEnum.MoveSelectedLeft)
          }
          disabled={!actionState}
        >
          Move Selected Left
        </button>
      </div>
      <div className="flex flex-row justify-center">
        <button
          className="btn btn-secondary aspect-auto w-5/6"
          onClick={() =>
            onHandleGridButtonEvent(GridOperatorTypeEnum.MoveAllLeft)
          }
          disabled={!actionState}
        >
          Move All Left
        </button>
      </div>
      <div className="flex flex-row justify-center">
        <button
          disabled={!enableBuildAndDeployButton || !actionState}
          className="btn btn-success aspect-auto w-5/6"
          onClick={() =>
            onHandleGridButtonEvent(GridOperatorTypeEnum.BuildAndDeploy)
          }
        >
          {buildAndDeployButtonText}
        </button>
      </div>
    </div>
  );
}

export default GridOperator;
