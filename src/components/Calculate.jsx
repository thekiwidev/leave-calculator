import { CalculatorIcon } from "@heroicons/react/24/outline";
import { Context } from "../contexts/Context";
import { useContext } from "react";

const Calculate = () => {
  const { calculate, startDate, leaveEntitlement } = useContext(Context);

  return (
    <div className="">
      <button
        className="group flex flex-row items-center w-full justify-center capitalize gap-1 bg-emerald-500 hover:bg-slate-900 border-none outline-none"
        onClick={() => calculate(startDate, leaveEntitlement)}
      >
        calculate
        <CalculatorIcon className="h-6 text-gray-100 group-hover:text-emerald-400 " />
      </button>
    </div>
  );
};
export default Calculate;
