import { useContext } from "react";
import { Context } from "../contexts/Context";

const NumberInput = () => {
  const { leaveEntitlement, updateLeaveEntitlement } = useContext(Context);

  return (
    <div className="basis-1/4">
      <input
        type="number"
        name="leave-entitlement"
        id="leave-entitlement"
        placeholder="30"
        max="112"
        className="py-2 px-4 rounded-xl border-2 border-emerald-400 w-full text-center"
        value={leaveEntitlement}
        onChange={(e) => updateLeaveEntitlement(e.target.value)}
      />
    </div>
  );
};
export default NumberInput;
