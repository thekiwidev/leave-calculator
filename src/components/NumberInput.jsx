const NumberInput = () => {
  return (
    <div className="basis-1/4">
      <input
        type="number"
        name="leave-entitlement"
        id="leave-entitlement"
        placeholder="30"
        max="112"
        className="py-2 px-4 rounded-xl border-2 border-emerald-400 w-full"
      />
    </div>
  );
};
export default NumberInput;
