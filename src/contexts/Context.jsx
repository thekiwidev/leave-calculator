import { addBusinessDays, format, isExists, parseISO, sub } from "date-fns";
import { createContext, useEffect, useState } from "react";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  // ! LEAVE COMMENCMENT DATE
  const [publicHolidays, setPublicHolidays] = useState([
    // format(parseISO("2023-04-07"), `yyy M d`),
    // format(parseISO("2023-04-10"), `yyy M d`),
    // format(parseISO("2023-04-21"), `yyy M d`),
    {
      date: `2023-04-07`,
      day: format(parseISO(`2023-04-07`), `d`),
      month: format(parseISO(`2023-04-07`), `M`),
      year: format(parseISO(`2023-04-07`), `yyyy`),
    },
  ]);

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
    setLeaveEntitlement(value);
    console.log(value);
  };

  // * Update the leave entitlement with the date picker
  // ! LEAVE START DATE
  const updateStartDate = (value) => {
    setStartDate(format(parseISO(value), `yyyy-MM-dd`));
  };

  // * calculate the leave based on the start date and the leave entitlement
  // ! CALCULATE LEAVE
  const calculate = (date, amount) => {
    if (amount >= 1) {
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

      //! the part to skip Public Holidays
      publicHolidays.map((ph) => {
        console.log(
          isExists(parseInt(ph.year), parseInt(ph.month), parseInt(ph.day))
        );
        console.log(ph);
      });
    }
  };

  // * calculate the leave on load and changed value of the start date and the leave entitlement
  // ! USE-EFFECT
  useEffect(() => {
    // console.log(new Date(expirationDate));
    calculate(startDate, leaveEntitlement);
  }, [startDate, leaveEntitlement]);

  return (
    <Context.Provider
      value={{
        calculate,
        expirationDate,
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
