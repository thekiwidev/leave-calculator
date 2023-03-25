import { useContext } from "react";
import { Context } from "../contexts/Context";

const DateInput = () => {
  const { startDate, updateStartDate } = useContext(Context);

  return (
    <div className="basis-3/4 ">
      <input
        type="date"
        name="start-date"
        id="start-date"
        className="py-2 px-4 rounded-xl border-2 border-emerald-400 w-full"
        value={startDate}
        onChange={(e) => updateStartDate(`${e.target.value}`)}
      />
    </div>
  );
};
export default DateInput;
