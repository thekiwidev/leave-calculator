import { addBusinessDays, format, parseISO, sub } from "date-fns";
import { createContext, useEffect, useState } from "react";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [startDate, setStartDate] = useState(format(new Date(), `yyyy-MM-dd`));
  const [expirationDate, setExpirationDate] = useState(
    format(new Date(), `do MMMM yyyy`)
  );
  const [resumptionDate, setResumptionDate] = useState(
    format(new Date(), `do EEEE`)
  );
  const [leaveEntitlement, setLeaveEntitlement] = useState(30);

  const updateLeaveEntitlement = (value) => {
    setLeaveEntitlement(parseInt(value));
  };

  const updateStartDate = (value) => {
    setStartDate(format(parseISO(value), `yyyy-MM-dd`));
    console.log(format(parseISO(value), `yyyy-MM-dd`));
  };

  const formatDate = (date) => {
    return format(date, `do MMMM, yyyy`);
  };

  // const resumptionDate = (date) => {
  //   return format(date, `do EEEE, `);
  // };

  const resumptionMonthYear = (date) => {
    return format(date, `MMMM, yyyy`);
  };

  const calculate = (date, amount) => {
    let commencementDate = sub(parseISO(date), { days: 1 });

    let expDate = addBusinessDays(commencementDate, amount);

    setExpirationDate(format(expDate, `do MMMM yyyy`));
    setResumptionDate(
      format(parseISO(addBusinessDays(expirationDate, 1)), `do EEEE`)
    );

    console.log(
      format(commencementDate, `do MMMM, yyyy`),
      expirationDate,
      resumptionDate
    );
  };

  // useEffect(() => {
  //   calculate(startDate, leaveEntitlement);
  // }, []);

  return (
    <Context.Provider
      value={{
        calculate,
        expirationDate,
        formatDate,
        leaveEntitlement,
        resumptionDate,
        resumptionMonthYear,
        startDate,
        updateLeaveEntitlement,
        updateStartDate,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
