import * as yup from "yup";

const schema = yup.object({
  email: yup
    .string()
    .email("Bitte geben Sie eine gültige E-Mail-Adresse ein")
    .required("Bitte geben Sie eine E-Mail-Adresse ein"),
  password: yup.string().required("Bitte geben Sie ein Passwort ein").min(6, "Das Passwort muss mindestens 6 Zeichen lang sein"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], "Die Passwörter stimmen nicht überein")
    .nullable()
    .required("Bitte bestätigen Sie Ihr Passwort"),
        //update user
        emailUpdate: yup
        .string()
        .email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
        nameUpdate: yup
        .string()
        .min(5, "Der Namen muss mindestens 5 Zeichen lang sein")
        .max(150, "Der Namen darf maximal 150 Zeichen lang sein"),
  name: yup
    .string()
    .min(5, "Der Namen muss mindestens 5 Zeichen lang sein")
    .max(150, "Der Namen darf maximal 150 Zeichen lang sein")
    .required("Bitte geben Sie einen Namen ein"),
});

export default schema;
