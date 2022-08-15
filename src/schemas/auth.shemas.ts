import { bool, boolean, object, string } from "yup";

export const validateEmailPhone = (value: string) => {
  const emailRegex =
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  const phoneRegex = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
  let isValidEmail = emailRegex.test(value);
  let isValidPhone = phoneRegex.test(value);

  if (!isValidEmail && !isValidPhone) {
    return false;
  }
  if (isValidEmail) {
    return "email";
  }
  if (isValidPhone) return "phone";
};
export const logoutSchema = object({
  params: object({
    all: string().required(),
  }),
});
export const authSchema = object({
  body: object({
    password: string().required("Name is required"),
    id: string()
      .required("Email/Phone Number is required")
      .test("test-name", "Enter Valid Phone/Email", function (value) {
        let isValidEmail = validateEmailPhone(value);
        let isValidPhone = validateEmailPhone(value);
        if (!isValidEmail && !isValidPhone) {
          return false;
        }
        return true;
      }),
  }),
});

