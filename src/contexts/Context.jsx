import { addBusinessDays, format, parseISO, sub } from "date-fns";
import { createContext, useEffect, useState } from "react";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  // ! LEAVE COMMENCMENT DATE
  const [startDate, setStartDate] = useState(format(new Date(), `yyyy-MM-dd`));

  // ! LEAVE END DATE PLACE HOLDER TO SET THE RESUMPTION DATE
  const [endDate, setEndDate] = useState(format(new Date(), `yyyy-MM-dd`));

  // ! LEAVE EXPIRATION DATE
  const [expirationDate, setExpirationDate] = useState(
    format(new Date(), `do MMMM, yyyy`)
  );

  // ! LEAVE RESUMPTION DATE
  const [resumptionDate, setResumptionDate] = useState({
    date: `${format(parseISO(endDate), `do`)}`,
    day: `${format(parseISO(endDate), `eeee`)}`,
    month: `${format(parseISO(endDate), `MMMM`)}`,
    year: `${format(parseISO(endDate), `yyyy`)}`,
  });

  // ! LEAVE ENTITLEMENTS
  const [leaveEntitlement, setLeaveEntitlement] = useState(10);

  // * Update the leave entitlement with inputs
  // ! LEAVE ENTITLEMENTS
  const updateLeaveEntitlement = (value) => {
    setLeaveEntitlement(parseInt(value));
  };

  // * Update the leave entitlement with the date picker
  // ! LEAVE ENTITLEMENTS
  const updateStartDate = (value) => {
    setStartDate(format(parseISO(value), `yyyy-MM-dd`));
  };

  const formatDate = (date) => {
    return format(date, `do MMMM, yyyy`);
  };

  const calculate = (date, amount) => {
    let commencementDate = sub(parseISO(date), { days: 1 });

    let expDate = addBusinessDays(commencementDate, amount);

    setEndDate(format(addBusinessDays(expDate, 1), `yyyy-MM-dd`));

    setExpirationDate(format(expDate, `do MMMM yyyy`));

    setResumptionDate({
      date: `${format(parseISO(endDate), `do`)}`,
      day: `${format(parseISO(endDate), `eeee`)}`,
      month: `${format(parseISO(endDate), `MMMM`)}`,
      year: `${format(parseISO(endDate), `yyyy`)}`,
    });
  };

  useEffect(() => {
    // console.log(new Date(expirationDate));
    calculate(startDate, leaveEntitlement);
  }, [startDate, leaveEntitlement]);

  return (
    <Context.Provider
      value={{
        calculate,
        expirationDate,
        formatDate,
        leaveEntitlement,
        resumptionDate,
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
