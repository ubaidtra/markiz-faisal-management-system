export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'GMD 0';
  return `GMD ${Number(amount).toLocaleString('en-GM', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatCurrencyShort = (amount) => {
  if (amount === null || amount === undefined) return 'GMD 0';
  return `GMD ${Number(amount).toLocaleString('en-GM')}`;
};

