export default {
  // Common
  error: 'Error',
  success: 'Success',
  cancel: 'Cancel',
  ok: 'OK',
  save: 'Save',
  delete: 'Delete',
  loading: 'Loading...',

  // Auth - Login
  appName: 'YardLedger',
  appTagline: 'Scrap Metal Management',
  email: 'Email',
  password: 'Password',
  signIn: 'Sign In',
  signingIn: 'Signing In...',
  fillAllFields: 'Please fill in all fields',
  loginFailed: 'Login Failed',
  noAccountRegister: "Don't have an account? Register",

  // Auth - Register
  createAccount: 'Create Account',
  confirmPassword: 'Confirm Password',
  register: 'Register',
  creatingAccount: 'Creating Account...',
  passwordsMismatch: 'Passwords do not match',
  accountCreated: 'Account created! Check your email for verification.',
  registrationFailed: 'Registration Failed',
  alreadyHaveAccount: 'Already have an account? Sign In',

  // Auth - Pending
  accountPending: 'Account Pending',
  pendingMessage:
    "Your account is waiting for admin approval. You'll be able to access YardLedger once an administrator activates your account.",
  checkStatus: 'Check Status',
  signOut: 'Sign Out',

  // Transactions
  customerInfo: 'Customer Info',
  customerName: 'Customer Name',
  phoneNumber: 'Phone Number',
  addMetals: 'Add Metals',
  weightLbs: 'Weight (lbs)',
  add: '+ Add',
  lineItems: 'Line Items',
  tapPriceToOverride: 'Tap price to override',
  override: 'OVERRIDE',
  pricePerLb: '$/lb:',
  receiptTotal: 'Receipt Total:',
  saveReceipt: 'Save Receipt',
  enterValidWeight: 'Enter a valid weight',
  enterValidPrice: 'Enter a valid price',
  enterCustomerName: 'Please enter a customer name',
  addAtLeastOneItem: 'Add at least one line item',
  receiptSaved: 'Receipt saved!',
  noTransactions: 'No transactions yet',
  tapToRecordBuy: 'Tap the button below to record a buy',
  newBuy: '+ New Buy',

  // Inventory
  noInventory: 'No inventory yet',
  inventoryAutoUpdate: 'Buy transactions will automatically update inventory',

  // Sales
  noSales: 'No sales yet',
  recordSalesProfit: 'Record outgoing sales and track profit margins',

  // Admin
  pendingApproval: 'Pending Approval',
  noUsersFound: 'No users found',
  approve: 'Approve',
  admin: 'Admin',
  deactivate: 'Deactivate',
  deactivateUser: 'Deactivate User',
  areYouSure: 'Are you sure?',
  promoteToAdmin: 'Promote to Admin',
  promoteAdminMessage: 'This user will have full admin access.',
  promote: 'Promote',

  // Admin Pin Modal
  adminAuthorization: 'Admin Authorization',
  priceOverrideRequiresAdmin: 'Price override requires admin approval',
  adminEmail: 'Admin Email',
  adminPassword: 'Admin Password',
  authorize: 'Authorize',
  verifying: 'Verifying...',
  enterAdminCredentials: 'Enter admin credentials',
  invalidCredentials: 'Invalid credentials',
  verificationFailed: 'Verification failed',

  // Navigation
  tabBuy: 'Buy',
  tabInventory: 'Inventory',
  tabSales: 'Sales',
  tabUsers: 'Users',
  transactions: 'Transactions',
} as const;
