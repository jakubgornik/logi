export const ROUTES = {
  DASHBOARD: "/dashboard",
  SUPPLIER: "/supplier",
  SETTINGS: "/settings",
  SIGN_IN: "/signin",
  SIGN_UP: "/signup",
  CONTRACT: "/contract",
  INVENTORY: "/inventory",
  CUSTOMER: "/customer",
};

export const SUB_ROUTES = {
  SUPPLIER_CREATE: `${ROUTES.SUPPLIER}/create`,
  SUPPLIER_EDIT: (id: string) => `${ROUTES.SUPPLIER}/edit/${id}`,
  SETTINGS_UPDATE: `${ROUTES.SETTINGS}/update`,
  CONTRACT_CREATE: `${ROUTES.CONTRACT}/create`,
  INVENTORY_CREATE: `${ROUTES.INVENTORY}/create`,
  CUSTOMER_CREATE: `${ROUTES.CUSTOMER}/create`,
};

export const routeNames: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/supplier": "Suppliers",
  "/supplier/create": "Create Supplier",
  "/supplier/edit/[id]": "Edit Supplier",
  "/supplier/[id]": "Supplier Details",
  "/settings": "Settings",
  "/settings/update": "Update User",
  "/contract": "Contracts",
  "/contract/create": "Create Contract",
  "/inventory": "Inventory",
  "/inventory/create": "Add to Inventory",
  "/customer": "Customers",
  "/customer/create": "Create Customer",
};
