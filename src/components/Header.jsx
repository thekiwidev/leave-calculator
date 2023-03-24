// ! HEROICONS
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

const Header = () => {
  return (
    <div className="flex flex-row gap-x-4 items-center absolute top-8">
      <CalendarDaysIcon strokeWidth={2} color="#60D394" className="h-24 " />
      <h1 className="capitalize text-xl font-bold leading-5">
        leave <br /> calculator
      </h1>
    </div>
  );
};
export default Header;
