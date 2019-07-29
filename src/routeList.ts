// NOTE: don't use 'const' so that values are useable in both .js and .ts files
export enum routeList {
  Landing = 'Landing',
  Entropy = 'Entropy',
  RegistrationProgress = 'RegistrationProgress',
  Loading = 'Loading',
  SeedPhrase = 'SeedPhrase',

  Home = 'Home',
  Claims = 'Claims',
  Documents = 'Documents',
  Records = 'Records',
  Settings = 'Settings',
  QRCodeScanner = 'QRCodeScanner',

  CredentialDialog = 'CredentialDialog',
  Consent = 'Consent',
  PaymentConsent = 'PaymentConsent',
  AuthenticationConsent = 'AuthenticationConsent',
  ClaimDetails = 'ClaimDetails',
  DocumentDetails = 'DocumentDetails',

  Exception = 'Exception',
}
