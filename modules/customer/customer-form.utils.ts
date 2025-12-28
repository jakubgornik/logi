import { CustomerFormSchema } from "./customer-form.validation";

export const defaultFormValues: Partial<CustomerFormSchema> = {
  isAppUser: false,
  appUserId: undefined,
  customerName: "",
  addressCountry: "",
  addressCity: "",
  addressStreet: "",
  addressPostalCode: "",
};
