export const formatNumberWithCommas = (num: number | string): string => {
  if (typeof num === "string") num = parseFloat(num);
  if (isNaN(num)) return "Invalid number";

  const negative = num < 0 ? "-" : "";
  num = Math.abs(num);
  const [integerPart, decimalPart] = num.toString().split(".");

  return (
    negative +
    (decimalPart
      ? `${integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${decimalPart}`
      : integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ","))
  );
};
