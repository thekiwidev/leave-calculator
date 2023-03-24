import { useContext } from "react";
import { Context } from "../contexts/Context";

const Output = () => {
  const { formatDate, resumptionDate, resumptionMonthYear } =
    useContext(Context);
  return (
    <div className="mb-16">
      <p className="text-sm text-gray-400 mb-3">
        Leave expires on :
        <b className="text-emerald-500">
          <code> {formatDate(new Date())}</code>
        </b>
      </p>
      <p className="text-4xl font-bold mb-1">{resumptionDate(new Date())}</p>
      <p className="text-2xl font-bold">{resumptionMonthYear(new Date())}</p>
    </div>
  );
};
export default Output;
