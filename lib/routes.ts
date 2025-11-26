export const ROUTES = {
  DASHBOARD: "/dashboard",
  SUPPLIER: "/supplier",
  SETTINGS: "/settings",
  SIGN_IN: "/signin",
  SIGN_UP: "/signup",
};

export const SUB_ROUTES = {
  SUPPLIER_CREATE: `${ROUTES.SUPPLIER}/create`,
  SUPPLIER_EDIT: (id: string) => `${ROUTES.SUPPLIER}/edit/${id}`,
};
