import DateInput from "./DateInput";
import NumberInput from "./NumberInput";

const FormContainer = () => {
  return (
    <div className="flex flex-row items-center gap-2 mb-3 w-100px">
      <DateInput />
      <NumberInput />
    </div>
  );
};
export default FormContainer;
