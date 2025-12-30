import {
  isDisposableEmail,
  isDisposableEmailDomain
} from "disposable-email-domains-js";

// Allowed providers (real email services only)
export const allowedDomains = [
  // mainstream providers
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "outlook.in",
  "outlook.co.in",
  "msn.com",
  "live.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "mail.com",
  "aol.com",

  // protonmail family
  "protonmail.com",
  "proton.me",
  "pm.me",
  "protonmail.ch",

  // tuta/tutanota family
  "tutanota.com",
  "tuta.com",
  "tutanota.de",
  "tutamail.com",
  "tutanota.org",
  "tuta.io",

  // other privacy providers
  "posteo.de",
  "mailbox.org",
  "runbox.com",
  "runbox.no",
  "startmail.com",
  "kolabnow.com",
  "countermail.com",
  "disroot.org",

  // zoho & gmx (not privacy mail but legit)
  "zoho.com",
  "zohomail.com",
  "gmx.com",
  "gmx.de",

  // yandex (Has privacy issues but still legit)
  "yandex.com",
  "yandex.ru",

  // India specific legit
  "rediffmail.com",
  "rediff.com"
];


// Extract domain from email
export function extractDomain(email) {
  if (!email || typeof email !== "string") return null;
  const parts = email.split("@");
  if (parts.length !== 2) return null;
  return parts[1].toLowerCase();
}

// Check if domain is allowed (your custom rule)
export function isAllowedDomain(email) {
  const domain = extractDomain(email);
  if (!domain) return false;
  return allowedDomains.includes(domain);
}

// Check if email is disposable (temp mail)
export function isDisposable(email) {
  const domain = extractDomain(email);
  if (!domain) return false;

  // Check full email (more accurate)
  if (isDisposableEmail(email)) return true;

  // Check domain only
  return isDisposableEmailDomain(domain);
}
