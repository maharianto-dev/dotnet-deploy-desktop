import { GridOperatorTypeEnum } from "../models/GridOperatorModel";

function GridOperator({
  onHandleGridButtonEvent,
}: {
  onHandleGridButtonEvent: (gridOperatorType: GridOperatorTypeEnum) => void;
}) {
  return (
    <div className="flex flex-col justify-center bg-blue-600 min-h-full max-h-full gap-12">
      <div className="flex flex-row justify-center">
        <button
          className="btn btn-secondary aspect-auto w-5/6"
          onClick={() =>
            onHandleGridButtonEvent(GridOperatorTypeEnum.MoveAllRight)
          }
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
        >
          Move All Left
        </button>
      </div>
    </div>
  );
}

export default GridOperator;
