export interface BankFieldDef {
  key: string
  label: string
  required: boolean
  placeholder?: string
}

export interface CountryTaxConfig {
  code: string
  name: string
  currency: string
  baseTdsRate: number
  socialSecurityRate: number
  highEarnerThreshold: number
  highEarnerSurcharge: number
  contractorDiscount: number
  maxRate: number
  requiredKycDocs: string[]
  bankFields: BankFieldDef[]
}

export const COUNTRY_TAX_CONFIGS: Record<string, CountryTaxConfig> = {
  IN: {
    code: 'IN',
    name: 'India',
    currency: 'INR',
    baseTdsRate: 0.1,
    socialSecurityRate: 0,
    highEarnerThreshold: 100_000,
    highEarnerSurcharge: 0.02,
    contractorDiscount: 0.4,
    maxRate: 0.35,
    requiredKycDocs: ['pan_card', 'aadhaar'],
    bankFields: [
      { key: 'accountHolderName', label: 'Account Holder Name', required: true, placeholder: 'Full name as on bank account' },
      { key: 'accountNumber', label: 'Account Number', required: true, placeholder: 'e.g. 1234567890' },
      { key: 'ifscCode', label: 'IFSC Code', required: true, placeholder: 'e.g. SBIN0001234' },
      { key: 'bankName', label: 'Bank Name', required: true, placeholder: 'e.g. State Bank of India' },
      { key: 'branchName', label: 'Branch Name', required: false, placeholder: 'e.g. Mumbai Main Branch' },
    ],
  },
  US: {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    baseTdsRate: 0.22,
    socialSecurityRate: 0.0765,
    highEarnerThreshold: 100_000,
    highEarnerSurcharge: 0.02,
    contractorDiscount: 0.4,
    maxRate: 0.37,
    requiredKycDocs: ['ssn', 'driver_license'],
    bankFields: [
      { key: 'accountHolderName', label: 'Account Holder Name', required: true },
      { key: 'routingNumber', label: 'Routing Number', required: true, placeholder: '9-digit ABA routing number' },
      { key: 'accountNumber', label: 'Account Number', required: true },
      { key: 'accountType', label: 'Account Type', required: true, placeholder: 'checking / savings' },
    ],
  },
  AE: {
    code: 'AE',
    name: 'United Arab Emirates',
    currency: 'AED',
    baseTdsRate: 0,
    socialSecurityRate: 0,
    highEarnerThreshold: 0,
    highEarnerSurcharge: 0,
    contractorDiscount: 0,
    maxRate: 0,
    requiredKycDocs: ['emirates_id', 'passport'],
    bankFields: [
      { key: 'accountHolderName', label: 'Account Holder Name', required: true },
      { key: 'iban', label: 'IBAN', required: true, placeholder: 'AE...' },
      { key: 'bankName', label: 'Bank Name', required: true },
      { key: 'swiftCode', label: 'SWIFT/BIC Code', required: true },
    ],
  },
  SG: {
    code: 'SG',
    name: 'Singapore',
    currency: 'SGD',
    baseTdsRate: 0.15,
    socialSecurityRate: 0,
    highEarnerThreshold: 120_000,
    highEarnerSurcharge: 0.02,
    contractorDiscount: 0.3,
    maxRate: 0.22,
    requiredKycDocs: ['nric', 'passport'],
    bankFields: [
      { key: 'accountHolderName', label: 'Account Holder Name', required: true },
      { key: 'accountNumber', label: 'Account Number', required: true },
      { key: 'bankName', label: 'Bank Name', required: true },
      { key: 'bankCode', label: 'Bank Code', required: true },
      { key: 'branchCode', label: 'Branch Code', required: true },
    ],
  },
  GB: {
    code: 'GB',
    name: 'United Kingdom',
    currency: 'GBP',
    baseTdsRate: 0.2,
    socialSecurityRate: 0.12,
    highEarnerThreshold: 50_000,
    highEarnerSurcharge: 0.05,
    contractorDiscount: 0.4,
    maxRate: 0.45,
    requiredKycDocs: ['passport', 'national_id'],
    bankFields: [
      { key: 'accountHolderName', label: 'Account Holder Name', required: true },
      { key: 'accountNumber', label: 'Account Number', required: true, placeholder: '8-digit account number' },
      { key: 'sortCode', label: 'Sort Code', required: true, placeholder: 'XX-XX-XX' },
      { key: 'bankName', label: 'Bank Name', required: true },
    ],
  },
  PH: {
    code: 'PH',
    name: 'Philippines',
    currency: 'PHP',
    baseTdsRate: 0.15,
    socialSecurityRate: 0.04,
    highEarnerThreshold: 80_000,
    highEarnerSurcharge: 0.02,
    contractorDiscount: 0.4,
    maxRate: 0.35,
    requiredKycDocs: ['passport', 'national_id'],
    bankFields: [
      { key: 'accountHolderName', label: 'Account Holder Name', required: true },
      { key: 'accountNumber', label: 'Account Number', required: true },
      { key: 'bankName', label: 'Bank Name', required: true },
      { key: 'swiftCode', label: 'SWIFT/BIC Code', required: false },
    ],
  },
}

const FALLBACK_CONFIG: CountryTaxConfig = {
  code: 'OTHER',
  name: 'Other',
  currency: 'USD',
  baseTdsRate: 0.1,
  socialSecurityRate: 0,
  highEarnerThreshold: 100_000,
  highEarnerSurcharge: 0.02,
  contractorDiscount: 0.4,
  maxRate: 0.35,
  requiredKycDocs: ['passport'],
  bankFields: [
    { key: 'accountHolderName', label: 'Account Holder Name', required: true },
    { key: 'accountNumber', label: 'Account Number', required: true },
    { key: 'bankName', label: 'Bank Name', required: true },
    { key: 'swiftCode', label: 'SWIFT/BIC Code', required: false },
  ],
}

export function getCountryConfig(code?: string | null): CountryTaxConfig {
  if (!code) return FALLBACK_CONFIG
  return COUNTRY_TAX_CONFIGS[code.toUpperCase()] ?? FALLBACK_CONFIG
}

export interface TaxBreakdown {
  grossAmount: number
  tds: number
  socialSecurity: number
  surcharge: number
  totalTax: number
  netAmount: number
  effectiveRate: number
}

export function calculateTax(
  amountUsd: number,
  countryCode?: string | null,
  annualIncomeUsd?: number,
  employmentType?: string,
): TaxBreakdown {
  const cfg = getCountryConfig(countryCode)
  let rate = cfg.baseTdsRate

  if (employmentType === 'contractor') {
    rate *= 1 - cfg.contractorDiscount
  }

  let surchargeRate = 0
  if (cfg.highEarnerThreshold > 0 && annualIncomeUsd && annualIncomeUsd >= cfg.highEarnerThreshold) {
    surchargeRate = cfg.highEarnerSurcharge
  }

  const effectiveRate = Math.min(rate + surchargeRate + cfg.socialSecurityRate, cfg.maxRate)

  const tds = amountUsd * rate
  const socialSecurity = amountUsd * cfg.socialSecurityRate
  const surcharge = amountUsd * surchargeRate
  const totalTax = amountUsd * effectiveRate
  const netAmount = amountUsd - totalTax

  return {
    grossAmount: amountUsd,
    tds: Math.round(tds * 100) / 100,
    socialSecurity: Math.round(socialSecurity * 100) / 100,
    surcharge: Math.round(surcharge * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
    netAmount: Math.round(netAmount * 100) / 100,
    effectiveRate: Math.round(effectiveRate * 10000) / 10000,
  }
}

export function getRequiredKycDocs(countryCode?: string | null): string[] {
  return getCountryConfig(countryCode).requiredKycDocs
}

export function getBankFields(countryCode?: string | null): BankFieldDef[] {
  return getCountryConfig(countryCode).bankFields
}

export function getSupportedCountries() {
  return Object.values(COUNTRY_TAX_CONFIGS).map(c => ({ code: c.code, name: c.name }))
}
