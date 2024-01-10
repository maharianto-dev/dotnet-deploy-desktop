import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { ResultTypeEnum } from "../redux/resultSlice";

function ResultBox() {
  const publishResult = useSelector((state: RootState) => state.publishResult);
  return (
    <div className="p-2 h-full w-full">
      <div className="border rounded-lg w-full h-full px-2 bg-slate-500 overflow-y-auto">
        <h1 className="text-lg font-bold">Result</h1>
        {publishResult.type !== ResultTypeEnum.EMPTY && (
          <p style={{ whiteSpace: "pre-wrap" }}>{publishResult.message}</p>
        )}
      </div>
    </div>
  );
}

export default ResultBox;
