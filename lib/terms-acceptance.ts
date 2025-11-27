const TERMS_ACCEPTED_KEY = "sokuresu_terms_accepted"
const TERMS_VERSION = "2025.01"

export function hasAcceptedTerms(): boolean {
  if (typeof window === "undefined") return false
  const accepted = localStorage.getItem(TERMS_ACCEPTED_KEY)
  return accepted === TERMS_VERSION
}

export function acceptTerms(): void {
  if (typeof window === "undefined") return
  localStorage.setItem(TERMS_ACCEPTED_KEY, TERMS_VERSION)
}

export function getTermsVersion(): string {
  return TERMS_VERSION
}
