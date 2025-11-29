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
  SETTINGS_UPDATE: `${ROUTES.SETTINGS}/update`,
};

export const routeNames: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/supplier": "Suppliers",
  "/supplier/create": "Create Supplier",
  "/supplier/edit/[id]": "Edit Supplier",
  "/supplier/[id]": "Supplier Details",
  "/settings": "User settings",
  "/settings/update": "Update User",
};
