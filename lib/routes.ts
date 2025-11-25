export const ROUTES = {
  DASHBOARD: "/dashboard",
  SUPPLIER: "/supplier",
  SETTINGS: "/settings",
};

export const SUB_ROUTES = {
  SUPPLIER_CREATE: `${ROUTES.SUPPLIER}/create`,
  SUPPLIER_EDIT: (id: string) => `${ROUTES.SUPPLIER}/edit/${id}`,
};
