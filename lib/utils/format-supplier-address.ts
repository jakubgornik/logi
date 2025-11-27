export const formatSupplierAddress = (
  street?: string,
  city?: string,
  postalCode?: string,
  country?: string
): string => {
  const parts = [street, city, postalCode, country].filter(Boolean);
  return parts.join(", ");
};
