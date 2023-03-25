import { useContext } from "react";
import { Context } from "../contexts/Context";

const Output = () => {
  const { expirationDate, resumptionDate, resumptionMonthYear } =
    useContext(Context);
  return (
    <div className="mb-16">
      <p className="text-sm text-gray-400 mb-3">
        Leave expires on :
        <b className="text-emerald-500">
          <code> {expirationDate}</code>
        </b>
      </p>
      <p className="text-3xl font-bold mb-1">{`${resumptionDate.date} ${resumptionDate.day},`}</p>
      <p className="text-2xl font-bold">{`${resumptionDate.month}, ${resumptionDate.year}.`}</p>
    </div>
  );
};
export default Output;
