export const errorTranslateMap = new Map<string, string>([
    ["auth/invalid-email", "Die eingegebene E-Mail-Adresse ist leider nicht gültig"],
    ['auth/too-many-requests', "Zu viele Anfragen. Bitte versuche es später erneut."],
    ["auth/wrong-password", "Die eingegebene E-Mail-Adresse oder das Passwort ist leider falsch"],
    ['auth/user-not-found', "Die eingegebene E-Mail-Adresse oder das Passwort ist leider falsch"],
    ["auth/popup-blocked", "Das Popup-Fenster wurde blockiert. Bitte erlauben Sie Popups für diese Seite."],
    ["auth/account-exists-with-different-credential", "SSO nicht eingerichtet. Loggen Sie sich bitte mit Ihrer E-Mail-Adresse ein und verknüpfen Sie Ihr Konto."],  
    ["auth/weak-password", "Das Passwort ist zu schwach, es sollte mindestens 6 Zeichen haben."],
    ["auth/email-already-in-use", "Für diese E-Mail-Adresse existiert bereits ein Konto."],
]);