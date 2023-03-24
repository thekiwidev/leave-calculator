import { format } from "date-fns";
import { createContext, useState } from "react";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [leaveEntitlement, setLeaveEntitlement] = useState(30);

  const formatDate = (date) => {
    return format(date, `do MMMM, yyyy`);
  };

  const resumptionDate = (date) => {
    return format(date, `do EEEE, `);
  };

  const resumptionMonthYear = (date) => {
    return format(date, `MMMM, yyyy`);
  };

  const calculate = (date) => {
    console.log(date);
  };

  return (
    <Context.Provider
      value={{
        calculate,
        leaveEntitlement,
        setLeaveEntitlement,
        startDate,
        setStartDate,
        formatDate,
        resumptionDate,
        resumptionMonthYear,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
