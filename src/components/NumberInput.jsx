import { useContext } from "react";
import { Context } from "../contexts/Context";

const NumberInput = () => {
  const { leaveEntitlement, setLeaveEntitlement } = useContext(Context);

  return (
    <div className="basis-1/4">
      <input
        type="number"
        name="leave-entitlement"
        id="leave-entitlement"
        placeholder="30"
        max="112"
        className="py-2 px-4 rounded-xl border-2 border-emerald-400 w-full"
        value={leaveEntitlement}
        onChange={(e) => setLeaveEntitlement(e)}
      />
    </div>
  );
};
export default NumberInput;
