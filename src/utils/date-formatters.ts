const getDateParts = (date: Date) => ({
  day: `${date.getDate()}`.padStart(2, '0'),
  month: `${date.getMonth() + 1}`.padStart(2, '0'),
  year: `${date.getFullYear()}`,
});

/**
 * Преобразует полученный объект Date в строку формата 'MM/YYYY'
 */
const toUserFormat = (date: Date) => {
  console.log('date', date);

  console.log('date.getDate()', date.getDate());

  const { month, year } = getDateParts(date);
  console.log('month', month);
  return `${month}/${year}`;
};

export { toUserFormat };
