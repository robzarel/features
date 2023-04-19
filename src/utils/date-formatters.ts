const getDateParts = (date: Date) => ({
  day: `${date.getDate()}`.padStart(2, '0'),
  month: `${date.getMonth() + 1}`.padStart(2, '0'),
  year: `${date.getFullYear()}`,
});

/**
 * Преобразует полученный объект Date в строку формата 'MM/YYYY'
 */
const toUserFormat = (date: Date) => {
  const { month, year } = getDateParts(date);
  return `${month}/${year}`;
};

export { toUserFormat };
