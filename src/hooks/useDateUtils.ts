import dayjs from "dayjs";

const useDateUtils = () => {
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1900 + 1 }, (_, index) =>
      (1900 + index).toString(),
    );
  };

  const generateMonths = () => [
    { month: "January", number: "01" },
    { month: "February", number: "02" },
    { month: "March", number: "03" },
    { month: "April", number: "04" },
    { month: "May", number: "05" },
    { month: "June", number: "06" },
    { month: "July", number: "07" },
    { month: "August", number: "08" },
    { month: "September", number: "09" },
    { month: "October", number: "10" },
    { month: "November", number: "11" },
    { month: "December", number: "12" },
  ];

  const generateDays = (year: string | null, month: string | null) => {
    if (!year || !month) {
      return Array.from({ length: 31 }, (_, index) => (index + 1).toString());
    }

    const daysInMonth = new Date(
      Number.parseInt(year, 10),
      Number.parseInt(month, 10),
      0,
    ).getDate();

    return Array.from({ length: daysInMonth }, (_, index) =>
      (index + 1).toString(),
    );
  };

  const formatDateByLocale = (
    date: string | undefined,
    formatType?: number,
  ): string => {
    if (!date || !dayjs(date).isValid()) return "-";

    const formatToUse = formatType === 1 ? "MMM DD, YYYY" : "YYYY/MM/DD";
    return dayjs(date, "YYYY-MM-DD").format(formatToUse);
  };

  const convertToGregorian = (date: string): string => {
    if (!date) return "";
    return dayjs(date, "YYYY-MM-DD").format("YYYY-MM-DD");
  };

  return {
    generateYears,
    generateMonths,
    generateDays,
    formatDateByLocale,
    convertToGregorian,
  };
};

export default useDateUtils;
