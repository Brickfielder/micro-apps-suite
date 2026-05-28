const EN_STRINGS = {
  "screen": {
    "title": "Brightwave Mobile Banking Simulator",
    "appAria": "Brightwave Bank mobile app"
  },
  "hero": {
    "title": "Brightwave Mobile Banking Simulator",
    "description": "Practise real-time mobile banking: balances, transfers, bills, card controls, and statement exports."
  },
  "header": {
    "brand": "Brightwave"
  },
  "instructions": {
    "summaryTitle": "How to use this simulator",
    "summaryBody1": "Practise routine online banking tasks inside a touch-style interface.",
    "summaryBody2": "Select the mobile or tablet frame, then explore the tabs to manage balances, transfers, bills, cards, and security. If a step is missed, the prompt bar will explain what to do next so you can self-correct."
  },
  "toolbar": {
    "controlBarAria": "View options and status",
    "viewToggleAria": "Switch device frame",
    "phone": "📱 Phone",
    "tablet": "💻 Tablet",
    "lastSync": "Balances refresh instantly — last sync {time}"
  },
  "status": {
    "cardUnlocked": "Card unlocked",
    "cardLocked": "Card locked"
  },
  "navigation": {
    "aria": "Primary banking sections",
    "accounts": {
      "label": "Accounts",
      "hint": "Balances & history"
    },
    "payments": {
      "label": "Payments",
      "hint": "Transfers & bills"
    },
    "security": {
      "label": "Cards & PIN",
      "hint": "Security tools"
    }
  },
  "panels": {
    "accounts": "Accounts and transactions",
    "payments": "Payments and standing orders",
    "security": "Card and PIN tools"
  },
  "accounts": {
    "filterLabel": "View transactions for",
    "refresh": "🔄 Refresh now",
    "pendingHint": "Pending items show in amber.",
    "exportCsv": "⬇️ Export CSV",
    "exportPdf": "⬇️ Export PDF",
    "current": {
      "name": "Current Account",
      "type": "Current"
    },
    "savings": {
      "name": "Easy Saver",
      "type": "Savings"
    },
    "travel": {
      "name": "Travel Wallet (EUR)",
      "type": "Linked (EUR)"
    }
  },
  "forms": {
    "transfer": {
      "title": "Transfer between your accounts",
      "from": "From",
      "to": "To",
      "amount": "Amount",
      "submit": "Transfer now"
    },
    "bill": {
      "title": "Pay a bill / schedule recurring",
      "payFrom": "Pay from",
      "payee": "Payee",
      "amount": "Amount",
      "frequency": "Frequency",
      "submit": "Confirm payment",
      "options": {
        "default": "-- Choose payee --",
        "energy": "Bright Energy (Utilities)",
        "water": "City Water Board",
        "rent": "Evergreen Rentals",
        "card": "Momentum Credit Card"
      },
      "frequencyOptions": {
        "once": "One-off payment",
        "monthly": "Monthly recurring",
        "quarterly": "Quarterly recurring"
      }
    },
    "send": {
      "title": "Send money to someone",
      "from": "From account",
      "recipient": "Recipient",
      "recipientPlaceholder": "Name or company",
      "amount": "Amount",
      "method": "Delivery method",
      "reference": "Reference (optional)",
      "referencePlaceholder": "e.g. Birthday gift",
      "submit": "Send payment",
      "methodOptions": {
        "faster": "Faster Payments (UK)",
        "bacs": "BACS (2-3 days)",
        "chaps": "CHAPS (same-day high value)",
        "sepa": "SEPA (EU)",
        "instant": "Instant within Brightwave"
      }
    },
    "debit": {
      "title": "Set up a new direct debit / standing order",
      "type": "Type",
      "typeDirectDebit": "Direct debit",
      "typeStandingOrder": "Standing order",
      "name": "Name",
      "namePlaceholder": "Organisation",
      "amount": "Amount",
      "schedule": "Schedule",
      "schedulePlaceholder": "e.g. 15th of each month",
      "submit": "Add instruction"
    }
  },
  "mandates": {
    "directDebits": {
      "title": "Direct debits",
      "empty": "No direct debits yet.",
      "energy": {
        "name": "Bright Energy",
        "schedule": "15th monthly"
      },
      "water": {
        "name": "City Water Board",
        "schedule": "28th monthly"
      },
      "card": {
        "name": "Momentum Credit Card",
        "schedule": "Due on statement date"
      }
    },
    "standingOrders": {
      "title": "Standing orders",
      "empty": "No standing orders yet.",
      "sweep": {
        "name": "Savings sweep",
        "schedule": "Every Friday"
      },
      "rent": {
        "name": "Rent to Evergreen Rentals",
        "schedule": "1st monthly"
      }
    },
    "frequency": {
      "monthly": "Monthly",
      "quarterly": "Quarterly"
    },
    "actions": {
      "cancel": "Cancel",
      "restore": "Reinstate",
      "pause": "Pause",
      "resume": "Resume"
    }
  },
  "card": {
    "preview": {
      "name": "Brightwave Debit",
      "badgeActive": "Active",
      "badgeLocked": "Locked",
      "holder": "Account holder",
      "expires": "Expires"
    },
    "controls": {
      "title": "Card controls",
      "lock": "🔐 Lock card",
      "unlock": "🔓 Unlock card"
    },
    "request": {
      "title": "Request a new card",
      "reason": "Reason",
      "delivery": "Delivery notes (optional)",
      "deliveryPlaceholder": "e.g. Use secure weekday delivery",
      "submit": "Submit request",
      "optionDefault": "-- Select a reason --",
      "optionDamaged": "Damaged",
      "optionLost": "Lost",
      "optionExpired": "Expired soon",
      "optionAdditional": "Additional cardholder"
    }
  },
  "limits": {
    "title": "Set spending limits",
    "helper": "Adjust how much can be spent on the card before a manual review is needed.",
    "daily": "Daily card limit",
    "contactless": "Contactless tap limit",
    "submit": "Update limits",
    "summary": "Daily limit {daily} · Contactless {contactless}"
  },
  "pin": {
    "title": "Change your PIN",
    "new": "New PIN",
    "confirm": "Confirm PIN",
    "submit": "Update PIN"
  },
  "tasks": {
    "aria": "Practice task checklist",
    "title": "Today's practice",
    "helper": "Work through each activity inside the simulator. Items tick themselves when you complete the matching action.",
    "reset": "Reset checklist",
    "progress": "{completed} of {total} tasks completed",
    "items": {
      "checkBalances": {
        "title": "Check balances",
        "helper": "Refresh the Accounts tab to confirm your current, savings, and linked totals."
      },
      "recurringPayment": {
        "title": "Set up a recurring payment",
        "helper": "Use bill payments or mandates to schedule an automatic outgoing payment."
      },
      "sendExternal": {
        "title": "Send money to other people or accounts",
        "helper": "Complete the send money form with a recipient and delivery method."
      },
      "transferOwn": {
        "title": "Transfer money between your own accounts",
        "helper": "Move funds internally using the transfer form."
      },
      "changePin": {
        "title": "Change your PIN",
        "helper": "Submit matching four-digit PIN entries in the security tab."
      },
      "setLimits": {
        "title": "Set spending limits",
        "helper": "Adjust the daily and contactless card limits in the security tools."
      }
    }
  },
  "sidebar": {
    "aria": "Prompts and notes"
  },
  "session": {
    "title": "Session tracker",
    "download": "⬇️ Download session CSV",
    "clear": "Clear tracker"
  },
  "clinician": {
    "title": "Clinician comments",
    "helper": "Use this space to record observations, cueing strategies, or follow-up goals after the session.",
    "placeholder": "Enter any notes relevant to this session..."
  },
  "spending": {
    "title": "Spending by category (30 days)",
    "empty": "No outgoing payments recorded yet."
  },
  "prompts": {
    "prefix": {
      "error": "⚠️ Check & retry:",
      "success": "✅ Done:",
      "info": "ℹ️ Info:"
    },
    "next": "Next: {step}",
    "ready": "Ready when you are. Choose a task to begin.",
    "account": {
      "switched": {
        "message": "Switched to {account}.",
        "next": "Scroll down to review the latest transactions."
      }
    },
    "tasks": {
      "reset": {
        "message": "Task checklist reset.",
        "next": "Work back through each activity inside the simulator."
      }
    },
    "directDebit": {
      "reinstate": {
        "message": "{name} is active again.",
        "next": "Monitor the next collection date in the direct debits list."
      },
      "cancel": {
        "message": "{name} will no longer collect.",
        "next": "Confirm with the provider if an alternative payment is needed."
      }
    },
    "standingOrder": {
      "resume": {
        "message": "{name} will run as scheduled.",
        "next": "Check your calendar reminder to avoid duplicates."
      },
      "pause": {
        "message": "{name} is paused.",
        "next": "Set a manual reminder if you still need to pay this manually."
      }
    }
  },
  "notifications": {
    "limits": {
      "updated": "Spending limits updated.",
      "updatedNext": "Changes apply straight away to in-store and contactless transactions."
    },
    "refresh": {
      "success": "Balances refreshed. Everything is up to date.",
      "next": "Continue with your next task."
    },
    "transfer": {
      "success": "Transfer complete.",
      "next": "Review the transaction history to confirm both entries."
    },
    "bill": {
      "submitted": "Bill payment submitted.",
      "onceNext": "Check the transactions list to see it marked as paid.",
      "recurringNext": "Review the mandates panel to confirm the new recurring payment."
    },
    "send": {
      "success": "Payment sent.",
      "next": {
        "bacs": "Expect the funds to clear in 2–3 working days.",
        "chaps": "Stay available for the confirmation call before the cut-off time.",
        "standard": "Share the confirmation with the recipient if needed."
      }
    },
    "mandate": {
      "directDebitCreated": "Direct debit created.",
      "standingCreated": "Standing order created.",
      "manageNext": "You can manage it from the list to pause or cancel later."
    },
    "view": {
      "switched": "Switched to the {mode} view.",
      "next": "Continue practising tasks inside the simulated device."
    },
    "tab": {
      "opened": "Opened the {tab} workspace.",
      "accountsNext": "Review balances or export a statement.",
      "paymentsNext": "Choose a form to set up transfers or bill payments.",
      "securityNext": "Lock cards or manage security options."
    },
    "pin": {
      "updated": "PIN updated securely.",
      "updatedNext": "Remember to memorise it and destroy any written notes."
    },
    "card": {
      "locked": "Card locked instantly.",
      "lockedNext": "If the card is found later, return to unlock it before use.",
      "unlocked": "Card unlocked instantly.",
      "unlockedNext": "You can continue using the card immediately.",
      "requested": "Replacement card request submitted.",
      "requestedNext": "Watch your messages for confirmation of the delivery date."
    },
    "export": {
      "sessionCsv": "Session CSV downloaded.",
      "sessionCsvNext": "Share the log or keep it for your records.",
      "csv": "CSV statement downloaded.",
      "csvNext": "Open it in Excel or your spreadsheet tool for review.",
      "pdf": "PDF statement downloaded.",
      "pdfNext": "Open it to review or share as needed."
    },
    "timeline": {
      "cleared": "Session tracker cleared.",
      "clearedNext": "Continue practising and new actions will appear here."
    },
    "transactions": {
      "updated": "Transaction view updated.",
      "updatedNext": "Scroll to see the selected account history."
    }
  },
  "errors": {
    "limits": {
      "dailyRange": "Set a daily limit between £100 and £5,000.",
      "dailyRangeNext": "Adjust the daily amount, then press \"Update limits\".",
      "contactlessRange": "Contactless limit must be between £10 and £500.",
      "contactlessRangeNext": "Amend the contactless amount before saving.",
      "order": "Contactless limit cannot be higher than the daily limit.",
      "orderNext": "Lower the contactless limit or raise the daily cap first."
    },
    "transfer": {
      "missingAccounts": "Choose both a source and destination account.",
      "missingAccountsNext": "Select different accounts from the dropdowns.",
      "sameAccount": "You selected the same account for both fields.",
      "sameAccountNext": "Change one of the dropdowns so the money has somewhere to go.",
      "amount": "Enter a transfer amount greater than zero.",
      "amountNext": "Type the amount you want to move, then press \"Transfer now\".",
      "balance": "Insufficient funds in the selected source account.",
      "balanceNext": "Reduce the amount or pick an account with enough balance."
    },
    "bill": {
      "incomplete": "Complete all bill payment fields first.",
      "incompleteNext": "Pick an account, payee, and amount before confirming.",
      "balance": "The account does not have enough funds for this bill.",
      "balanceNext": "Adjust the amount or transfer funds in before paying."
    },
    "send": {
      "incomplete": "Fill in the account, recipient, and amount fields.",
      "incompleteNext": "Complete the missing fields, then try sending again.",
      "balance": "Insufficient funds for this payment.",
      "balanceNext": "Transfer money in or lower the amount before resubmitting."
    },
    "mandate": {
      "incomplete": "All fields are required to set up an instruction.",
      "incompleteNext": "Enter the organisation, amount, and schedule before saving."
    },
    "pin": {
      "format": "PIN must be exactly four digits.",
      "formatNext": "Enter four numbers (0-9) with no spaces.",
      "match": "The PIN entries do not match.",
      "matchNext": "Re-enter the same digits in both boxes."
    },
    "card": {
      "reason": "Select a reason for the replacement card.",
      "reasonNext": "Use the dropdown to explain why you need the new card."
    },
    "export": {
      "account": "Select an account before exporting.",
      "accountNext": "Tap a balance card, then try exporting again."
    }
  },
  "timeline": {
    "empty": "No actions yet.",
    "accountSwitched": "Switched to {account}.",
    "directDebit": {
      "reinstate": "Reinstated direct debit: {name}",
      "cancel": "Cancelled direct debit: {name}",
      "created": "Added direct debit: {name}"
    },
    "standingOrder": {
      "resume": "Reactivated standing order: {name}",
      "pause": "Paused standing order: {name}",
      "created": "Added standing order: {name}"
    },
    "tasks": {
      "completed": "Checklist: completed task — {task}",
      "checked": "Checklist: completed task — {task}",
      "reopened": "Checklist: reopened task — {task}",
      "reset": "Checklist reset for another run-through"
    },
    "limits": {
      "updated": "Updated spending limits to {daily} daily / {contactless} contactless"
    },
    "refresh": "Manual refresh of balances",
    "transfer": "Transferred {amount} from {from} to {to}",
    "bill": "Paid {payee} ({frequency}) from {account}",
    "send": "Sent {amount} to {recipient} via {method}",
    "card": {
      "locked": "Locked debit card",
      "unlocked": "Unlocked debit card",
      "requested": "Requested new card ({reason})"
    },
    "pin": {
      "changed": "Changed debit card PIN"
    },
    "export": {
      "session": "Exported session progress CSV",
      "csv": "Exported CSV statement for {account}",
      "pdf": "Exported PDF statement for {account}"
    }
  },
  "transactions": {
    "empty": "No transactions yet — create one via transfers or payments.",
    "categories": {
      "income": "Income",
      "utilities": "Utilities",
      "foodDrink": "Food & drink",
      "transferOut": "Transfer out",
      "interest": "Interest",
      "travel": "Travel",
      "transferIn": "Transfer in",
      "paymentsOut": "Payments to others"
    },
    "methods": {
      "bacs": "BACS",
      "directDebit": "Direct debit",
      "debitCard": "Debit card",
      "standingOrder": "Standing order",
      "monthlyInterest": "Monthly interest",
      "sepa": "SEPA",
      "currencyWallet": "Currency wallet",
      "transfer": "Transfer",
      "bankTransfer": "Bank transfer"
    },
    "status": {
      "pending": "Pending",
      "cleared": "Cleared"
    },
    "seed": {
      "payroll": "Payroll",
      "pendingElectric": "Pending — Electric bill",
      "groceries": "Groceries — {merchant}",
      "autoTransfer": "Auto transfer to current",
      "interest": "Interest credit",
      "hotel": "Hotel booking — {city}",
      "topUp": "Top up from current"
    },
    "merchants": {
      "marketSquare": "Market Square"
    },
    "destinations": {
      "porto": "Porto"
    },
    "new": {
      "transferOut": "Transfer to {account}",
      "transferIn": "Transfer from {account}",
      "billPayment": "Bill payment to {payee}",
      "send": "To {recipient}{reference}"
    }
  },
  "exports": {
    "session": {
      "generated": "Export generated",
      "timelineTitle": "Timeline",
      "timeHeader": "Time",
      "eventHeader": "Event",
      "none": "No actions recorded",
      "tasksTitle": "Practice tasks",
      "taskHeader": "Task",
      "statusHeader": "Status",
      "completed": "Completed",
      "inProgress": "In progress"
    },
    "statement": {
      "date": "Date",
      "description": "Description",
      "amount": "Amount",
      "category": "Category",
      "method": "Method",
      "status": "Status"
    },
    "pdf": {
      "title": "Statement for {account}",
      "generated": "Generated {time}",
      "balance": "Balance: {balance}",
      "headers": "Date — Description — Amount (Method)"
    }
  },
  "terms": {
    "pin": "PIN",
    "sortCode": "Sort code",
    "accountNumber": "Account number",
    "iban": "IBAN",
    "bic": "BIC/SWIFT",
    "directDebit": "Direct Debit",
    "standingOrder": "Standing order",
    "bankTransfer": "Bank transfer",
    "cardPayment": "Card payment",
    "balance": "Balance",
    "availableBalance": "Available balance",
    "statement": "Statement",
    "overdraft": "Overdraft"
  }
};

function lookupI18n(path) {
  return String(path || '').split('.').reduce((value, key) => {
    if (value && Object.prototype.hasOwnProperty.call(value, key)) return value[key];
    return undefined;
  }, EN_STRINGS);
}

function interpolateI18n(template, vars = {}) {
  return String(template ?? '').replace(/\{([\w-]+)\}/g, (_, key) => vars[key] ?? '');
}

function translateI18n(key, vars = {}) {
  const value = lookupI18n(key);
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return value;
  return interpolateI18n(value ?? key, vars);
}

function applyI18n(root = document) {
  const scope = root || document;
  const nodes = scope.matches?.('[data-i18n]') ? [scope] : [];
  nodes.push(...scope.querySelectorAll?.('[data-i18n]') ?? []);
  nodes.forEach((node) => {
    const key = node.getAttribute('data-i18n');
    const vars = {};
    for (const attr of Array.from(node.attributes)) {
      if (attr.name.startsWith('data-i18n-') && attr.name !== 'data-i18n' && attr.name !== 'data-i18n-attr') {
        vars[attr.name.slice('data-i18n-'.length)] = attr.value;
      }
    }
    const value = translateI18n(key, vars);
    const attrName = node.getAttribute('data-i18n-attr');
    if (attrName) {
      node.setAttribute(attrName, value);
    } else {
      node.textContent = value;
    }
  });
}

window.I18N = {
  lang: 'en',
  dict: EN_STRINGS,
  t: translateI18n,
  apply: applyI18n,
  ready: new Promise((resolve) => {
    const finish = () => {
      applyI18n(document);
      resolve();
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', finish, { once: true });
    } else {
      finish();
    }
  }),
};

window.addEventListener('DOMContentLoaded', () => {
  const whenI18N = window.I18N?.ready || Promise.resolve();
  whenI18N.then(() => {
    const { I18N } = window;
    const t = (key, vars = {}) => I18N.t(key, vars);

    const heroTitleEl = document.querySelector('.hero-title');
    const heroLeadEl = document.querySelector('.hero-lead');
    const defaultHeroTitle = heroTitleEl ? heroTitleEl.textContent : '';
    const defaultHeroDesc = heroLeadEl ? heroLeadEl.textContent : '';

    const renderHero = () => {
      if (!window.I18N) return;
      const titleEl = document.querySelector('.hero-title');
      if (titleEl) {
        const heroTitleText = I18N.t('hero.title');
        const fallbackTitle = I18N.t('screen.title');
        const resolvedTitle = heroTitleText !== 'hero.title'
          ? heroTitleText
          : (fallbackTitle !== 'screen.title' ? fallbackTitle : defaultHeroTitle);
        if (resolvedTitle) titleEl.textContent = resolvedTitle;
      }
      const descEl = document.querySelector('.hero-lead');
      if (descEl) {
        const heroDesc = I18N.t('hero.description');
        const resolvedDesc = heroDesc !== 'hero.description' ? heroDesc : defaultHeroDesc;
        if (resolvedDesc) descEl.textContent = resolvedDesc;
      }
    };

    renderHero();
    window.addEventListener('i18n:applied', renderHero);

    const localeByLang = { en: 'en-GB', it: 'it-IT', es: 'es-ES' };
    const euroLocaleByLang = { en: 'en-IE', it: 'it-IT', es: 'es-ES' };

    const BILL_PAYEES = [
      { value: '', labelKey: 'forms.bill.options.default' },
      { value: 'energy', labelKey: 'forms.bill.options.energy' },
      { value: 'water', labelKey: 'forms.bill.options.water' },
      { value: 'rent', labelKey: 'forms.bill.options.rent' },
      { value: 'card', labelKey: 'forms.bill.options.card' },
    ];

    const BILL_FREQUENCIES = [
      { value: 'once', labelKey: 'forms.bill.frequency.once', scheduleKey: null },
      { value: 'monthly', labelKey: 'forms.bill.frequency.monthly', scheduleKey: 'mandates.frequency.monthly' },
      { value: 'quarterly', labelKey: 'forms.bill.frequency.quarterly', scheduleKey: 'mandates.frequency.quarterly' },
    ];

    const SEND_METHODS = {
      faster: 'forms.send.method.faster',
      bacs: 'forms.send.method.bacs',
      chaps: 'forms.send.method.chaps',
      sepa: 'forms.send.method.sepa',
      instant: 'forms.send.method.instant',
    };

    const CARD_REASONS = [
      { value: '', labelKey: 'card.request.optionDefault' },
      { value: 'damaged', labelKey: 'card.request.optionDamaged' },
      { value: 'lost', labelKey: 'card.request.optionLost' },
      { value: 'expired', labelKey: 'card.request.optionExpired' },
      { value: 'additional', labelKey: 'card.request.optionAdditional' },
    ];

    const ACCOUNT_NAME_KEYS = {
      'current': 'accounts.current.name',
      'savings': 'accounts.savings.name',
      'travel': 'accounts.travel.name',
    };

    const ACCOUNT_TYPE_KEYS = {
      'current': 'accounts.current.type',
      'savings': 'accounts.savings.type',
      'travel': 'accounts.travel.type',
    };

    const TRANSACTION_DESCRIPTION_KEYS = {
      'tx-01': { key: 'transactions.seed.payroll' },
      'tx-02': { key: 'transactions.seed.pendingElectric', vars: { provider: 'forms.bill.options.energy' } },
      'tx-03': { key: 'transactions.seed.groceries', vars: { merchant: 'transactions.merchants.marketSquare' } },
      'tx-04': { key: 'transactions.seed.autoTransfer' },
      'tx-05': { key: 'transactions.seed.interest' },
      'tx-06': { key: 'transactions.seed.hotel', vars: { city: 'transactions.destinations.porto' } },
      'tx-07': { key: 'transactions.seed.topUp' },
    };

    const TRANSACTION_CATEGORY_KEYS = {
      'Income': 'transactions.categories.income',
      'Utilities': 'transactions.categories.utilities',
      'Food & drink': 'transactions.categories.foodDrink',
      'Transfer out': 'transactions.categories.transferOut',
      'Interest': 'transactions.categories.interest',
      'Travel': 'transactions.categories.travel',
      'Transfer in': 'transactions.categories.transferIn',
      'Payments to others': 'transactions.categories.paymentsOut',
    };

    const TRANSACTION_METHOD_KEYS = {
      'BACS': 'transactions.methods.bacs',
      'Direct debit': 'transactions.methods.directDebit',
      'Debit card': 'transactions.methods.debitCard',
      'Standing order': 'transactions.methods.standingOrder',
      'Monthly interest': 'transactions.methods.monthlyInterest',
      'SEPA': 'transactions.methods.sepa',
      'Currency wallet': 'transactions.methods.currencyWallet',
      'Transfer': 'transactions.methods.transfer',
      'Bank transfer': 'transactions.methods.bankTransfer',
    };

    const state = {
      viewMode: 'phone',
      activeTab: 'accounts',
      selectedAccount: 'current',
      cardLocked: false,
      pinLastChanged: '2024-05-11',
      spendingLimits: {
        daily: 1500,
        contactless: 100,
      },
      lastSync: new Date(),
      currentPrompt: { message: 'prompt.ready', type: 'info', next: '', vars: {} },
      accounts: [
        {
          id: 'current',
          balance: 2150.42,
          iban: 'GB33 BWVB 2294 1123 45',
          currency: 'GBP',
        },
        {
          id: 'savings',
          balance: 6200.15,
          iban: 'GB33 BWVB 7719 7642 11',
          currency: 'GBP',
        },
        {
          id: 'travel',
          balance: 830.5,
          iban: 'DE12 3704 0044 0532 0130 00',
          currency: 'EUR',
        },
      ],
      transactions: [
        { id: 'tx-01', account: 'current', amount: 1850.0, category: 'Income', method: 'BACS', date: '2024-07-24', pending: false },
        { id: 'tx-02', account: 'current', amount: -84.65, category: 'Utilities', method: 'Direct debit', date: '2024-07-27', pending: true },
        { id: 'tx-03', account: 'current', amount: -62.14, category: 'Food & drink', method: 'Debit card', date: '2024-07-23', pending: false },
        { id: 'tx-04', account: 'savings', amount: -200.0, category: 'Transfer out', method: 'Standing order', date: '2024-07-20', pending: false },
        { id: 'tx-05', account: 'savings', amount: 6.12, category: 'Interest', method: 'Monthly interest', date: '2024-07-01', pending: false },
        { id: 'tx-06', account: 'travel', amount: -215.0, category: 'Travel', method: 'SEPA', date: '2024-07-18', pending: false },
        { id: 'tx-07', account: 'travel', amount: 250.0, category: 'Transfer in', method: 'Currency wallet', date: '2024-07-15', pending: false },
      ],
      directDebits: [
        { id: 'dd-1', nameKey: 'mandates.directDebits.energy.name', amount: 84.65, scheduleKey: 'mandates.directDebits.energy.schedule', active: true },
        { id: 'dd-2', nameKey: 'mandates.directDebits.water.name', amount: 42.1, scheduleKey: 'mandates.directDebits.water.schedule', active: true },
        { id: 'dd-3', nameKey: 'mandates.directDebits.card.name', amount: 120.0, scheduleKey: 'mandates.directDebits.card.schedule', active: true },
      ],
      standingOrders: [
        { id: 'so-1', nameKey: 'mandates.standingOrders.sweep.name', amount: 200.0, scheduleKey: 'mandates.standingOrders.sweep.schedule', active: true },
        { id: 'so-2', nameKey: 'mandates.standingOrders.rent.name', amount: 950.0, scheduleKey: 'mandates.standingOrders.rent.schedule', active: true },
      ],
      practiceTasks: [
        { id: 'check-balances', titleKey: 'tasks.items.checkBalances.title', helperKey: 'tasks.items.checkBalances.helper', completed: false },
        { id: 'recurring-payment', titleKey: 'tasks.items.recurringPayment.title', helperKey: 'tasks.items.recurringPayment.helper', completed: false },
        { id: 'send-external', titleKey: 'tasks.items.sendExternal.title', helperKey: 'tasks.items.sendExternal.helper', completed: false },
        { id: 'transfer-own', titleKey: 'tasks.items.transferOwn.title', helperKey: 'tasks.items.transferOwn.helper', completed: false },
        { id: 'change-pin', titleKey: 'tasks.items.changePin.title', helperKey: 'tasks.items.changePin.helper', completed: false },
        { id: 'set-limits', titleKey: 'tasks.items.setLimits.title', helperKey: 'tasks.items.setLimits.helper', completed: false },
      ],
      timeline: [],
    };

    const promptArea = document.getElementById('promptArea');
    const accountsGrid = document.getElementById('accountsGrid');
    const accountFilter = document.getElementById('accountFilter');
    const transactionList = document.getElementById('transactionList');
    const spendingSummary = document.getElementById('spendingSummary');
    const directDebitItems = document.getElementById('directDebitItems');
    const standingOrderItems = document.getElementById('standingOrderItems');
    const sessionTimeline = document.getElementById('sessionTimeline');
    const practiceTasksList = document.getElementById('practiceTasksList');
    const taskProgress = document.getElementById('taskProgress');
    const limitSummary = document.getElementById('limitSummary');
    const availabilityStatus = document.getElementById('availabilityStatus');
    const cardStatusLabel = document.getElementById('cardStatusLabel');
    const cardLockBadge = document.getElementById('cardLockBadge');

    function localeForCurrency(currency = 'GBP') {
      const lang = I18N.lang || 'en';
      if (currency === 'EUR') {
        return euroLocaleByLang[lang] || 'en-IE';
      }
      return localeByLang[lang] || 'en-GB';
    }

    function formatCurrency(value, currency = 'GBP') {
      try {
        return new Intl.NumberFormat(localeForCurrency(currency), { style: 'currency', currency }).format(value);
      } catch (err) {
        return `${currency} ${Number(value).toFixed(2)}`;
      }
    }

    function renderQuickStatus() {
      const timeText = new Intl.DateTimeFormat(localeByLang[I18N.lang] || 'en-GB', {
        hour: '2-digit', minute: '2-digit'
      }).format(state.lastSync);
      availabilityStatus.setAttribute('data-i18n', 'toolbar.lastSync');
      availabilityStatus.setAttribute('data-i18n-time', timeText);
      I18N.apply(availabilityStatus);
    }

    function renderPrompt() {
      const { message, type, next, vars } = state.currentPrompt;
      if (!promptArea) return;
      promptArea.textContent = '';
      promptArea.classList.remove('error', 'success');
      if (type === 'error') {
        promptArea.classList.add('error');
      } else if (type === 'success') {
        promptArea.classList.add('success');
      }

      const prefixKey = type === 'error' ? 'prompts.prefix.error' : type === 'success' ? 'prompts.prefix.success' : 'prompts.prefix.info';
      const strong = document.createElement('strong');
      strong.setAttribute('data-i18n', prefixKey);
      strong.textContent = t(prefixKey);
      promptArea.appendChild(strong);

      const messageSpan = document.createElement('span');
      messageSpan.setAttribute('data-i18n', message);
      Object.entries(vars || {}).forEach(([key, value]) => {
        messageSpan.setAttribute(`data-i18n-${key}`, value);
      });
      messageSpan.textContent = t(message, vars);
      promptArea.appendChild(document.createTextNode(' '));
      promptArea.appendChild(messageSpan);

      if (next) {
        const span = document.createElement('span');
        span.className = 'next-step';
        span.setAttribute('data-i18n', 'prompts.next');
        span.setAttribute('data-i18n-step', t(next, vars));
        span.textContent = t('prompts.next', { step: t(next, vars) });
        promptArea.appendChild(span);
      }
    }

    function showPrompt(messageKey, type = 'info', nextKey = '', vars = {}) {
      state.currentPrompt = { message: messageKey, type, next: nextKey, vars };
      renderPrompt();
    }

    function recordTimeline(entryKey, vars = {}) {
      const now = new Date();
      state.timeline.unshift({ timestamp: now.toISOString(), key: entryKey, vars });
      if (state.timeline.length > 12) state.timeline.length = 12;
      renderTimeline();
    }

    function renderTimeline() {
      if (!sessionTimeline) return;
      if (!state.timeline.length) {
        sessionTimeline.innerHTML = `<li class="empty" data-i18n="timeline.empty">${t('timeline.empty')}</li>`;
        I18N.apply(sessionTimeline);
        return;
      }
      sessionTimeline.innerHTML = state.timeline.map(entry => {
        const label = new Date(entry.timestamp).toLocaleTimeString(localeByLang[I18N.lang] || 'en-GB', { hour: '2-digit', minute: '2-digit' });
        const text = t(entry.key, entry.vars);
        return `<li><time datetime="${entry.timestamp}">${label}</time><span>${text}</span></li>`;
      }).join('');
    }

    function getAccountMeta(accountId) {
      const nameKey = ACCOUNT_NAME_KEYS[accountId];
      const typeKey = ACCOUNT_TYPE_KEYS[accountId];
      return {
        name: t(nameKey),
        type: t(typeKey),
      };
    }

    function renderAccounts() {
      if (!accountsGrid) return;
      accountsGrid.innerHTML = state.accounts.map(acc => {
        const meta = getAccountMeta(acc.id);
        const isActive = state.selectedAccount === acc.id;
        return `
          <article class="account-card ${isActive ? 'active' : ''}" data-account="${acc.id}" tabindex="0" role="button" aria-pressed="${isActive}">
            <h3>${meta.name}</h3>
            <div class="balance">${formatCurrency(acc.balance, acc.currency)}</div>
            <div class="meta"><span>${meta.type}</span><span>${acc.iban}</span></div>
          </article>
        `;
      }).join('');

      accountsGrid.querySelectorAll('.account-card').forEach(card => {
        card.addEventListener('click', () => {
          state.selectedAccount = card.dataset.account;
          renderAccounts();
          renderTransactions();
          renderSpendingSummary();
          if (accountFilter) accountFilter.value = state.selectedAccount;
          const meta = getAccountMeta(state.selectedAccount);
          showPrompt('prompts.account.switched.message', 'info', 'prompts.account.switched.next');
          recordTimeline('timeline.accountSwitched', { account: meta.name });
        });
        card.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            card.click();
          }
        });
      });
    }

    function renderAccountFilter() {
      if (!accountFilter) return;
      accountFilter.innerHTML = state.accounts.map(acc => {
        const meta = getAccountMeta(acc.id);
        return `<option value="${acc.id}">${meta.name}</option>`;
      }).join('');
      accountFilter.value = state.selectedAccount;
    }

    function formatTransactionDescription(tx) {
      const info = TRANSACTION_DESCRIPTION_KEYS[tx.id];
      if (!info) return '';
      const vars = {};
      Object.entries(info.vars || {}).forEach(([key, value]) => {
        vars[key] = value.startsWith('forms.') || value.startsWith('transactions.') ? t(value) : value;
      });
      return t(info.key, vars);
    }

    function translateCategory(category) {
      const key = TRANSACTION_CATEGORY_KEYS[category] || category;
      return key.includes('.') ? t(key) : category;
    }

    function translateMethod(method) {
      const key = TRANSACTION_METHOD_KEYS[method] || method;
      return key.includes('.') ? t(key) : method;
    }

    function renderTransactions() {
      if (!transactionList) return;
      const selected = state.selectedAccount;
      const items = state.transactions.filter(tx => tx.account === selected).sort((a, b) => new Date(b.date) - new Date(a.date));
      if (!items.length) {
        transactionList.innerHTML = `<p class="helper" data-i18n="transactions.empty">${t('transactions.empty')}</p>`;
        I18N.apply(transactionList);
        return;
      }
      transactionList.innerHTML = items.map(tx => {
        const currency = state.accounts.find(acc => acc.id === tx.account)?.currency || 'GBP';
        const isDebit = tx.amount < 0;
        const amount = formatCurrency(Math.abs(tx.amount), currency);
        const description = formatTransactionDescription(tx);
        const category = translateCategory(tx.category);
        const method = translateMethod(tx.method);
        const statusKey = tx.pending ? 'transactions.status.pending' : 'transactions.status.cleared';
        return `
          <article class="transaction-item ${tx.pending ? 'pending' : ''}">
            <div>
              <div style="font-weight:600;">${description}</div>
              <div class="category">${category}</div>
            </div>
            <div class="amount ${isDebit ? 'debit' : 'credit'}">${isDebit ? '-' : '+'}${amount}</div>
            <div class="details">
              <span>${new Date(tx.date).toLocaleDateString(localeByLang[I18N.lang] || 'en-GB')}</span>
              <span>${method}</span>
              <span${tx.pending ? ' style="color:#b45309;"' : ''}>${t(statusKey)}</span>
            </div>
          </article>
        `;
      }).join('');
    }

    function renderSpendingSummary() {
      if (!spendingSummary) return;
      const selected = state.selectedAccount;
      const last30 = state.transactions.filter(tx => tx.account === selected && tx.amount < 0 && (Date.now() - new Date(tx.date).getTime()) <= (1000 * 60 * 60 * 24 * 32));
      if (!last30.length) {
        spendingSummary.innerHTML = `
          <h4 data-i18n="spending.title">${t('spending.title')}</h4>
          <p class="helper" data-i18n="spending.empty">${t('spending.empty')}</p>
        `;
        I18N.apply(spendingSummary);
        return;
      }
      const totals = {};
      last30.forEach(tx => {
        const key = TRANSACTION_CATEGORY_KEYS[tx.category] || tx.category;
        totals[key] = (totals[key] || 0) + Math.abs(tx.amount);
      });
      const currency = state.accounts.find(acc => acc.id === selected)?.currency || 'GBP';
      spendingSummary.innerHTML = `
        <h4 data-i18n="spending.title">${t('spending.title')}</h4>
        <ul>
          ${Object.entries(totals).map(([catKey, total]) => `<li>${t(catKey)}: ${formatCurrency(total, currency)}</li>`).join('')}
        </ul>
      `;
    }

    function renderMandates() {
      if (directDebitItems) {
        const content = state.directDebits.map(item => {
          return `
            <div class="list-item" data-id="${item.id}">
              <div>
                <div style="font-weight:600;">${t(item.nameKey)}</div>
                <span class="meta">${formatCurrency(item.amount)} · ${t(item.scheduleKey)}</span>
              </div>
              <button type="button" class="button ${item.active ? '' : 'secondary'}" data-action="${item.active ? 'cancel' : 'restore'}" data-i18n="${item.active ? 'mandates.actions.cancel' : 'mandates.actions.restore'}">${t(item.active ? 'mandates.actions.cancel' : 'mandates.actions.restore')}</button>
            </div>
          `;
        }).join('');
        directDebitItems.innerHTML = content || `<p class="helper" data-i18n="mandates.directDebits.empty">${t('mandates.directDebits.empty')}</p>`;
      }

      if (standingOrderItems) {
        const content = state.standingOrders.map(item => {
          return `
            <div class="list-item" data-id="${item.id}">
              <div>
                <div style="font-weight:600;">${t(item.nameKey)}</div>
                <span class="meta">${formatCurrency(item.amount)} · ${t(item.scheduleKey)}</span>
              </div>
              <button type="button" class="button ${item.active ? '' : 'secondary'}" data-action="${item.active ? 'cancel' : 'restore'}" data-i18n="${item.active ? 'mandates.actions.pause' : 'mandates.actions.resume'}">${t(item.active ? 'mandates.actions.pause' : 'mandates.actions.resume')}</button>
            </div>
          `;
        }).join('');
        standingOrderItems.innerHTML = content || `<p class="helper" data-i18n="mandates.standingOrders.empty">${t('mandates.standingOrders.empty')}</p>`;
      }

      directDebitItems?.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.closest('.list-item').dataset.id;
          const item = state.directDebits.find(dd => dd.id === id);
          if (!item) return;
          item.active = !item.active;
          renderMandates();
          recordTimeline(item.active ? 'timeline.directDebit.reinstate' : 'timeline.directDebit.cancel', { name: t(item.nameKey) });
          showPrompt(item.active ? 'prompts.directDebit.reinstate.message' : 'prompts.directDebit.cancel.message', 'success', item.active ? 'prompts.directDebit.reinstate.next' : 'prompts.directDebit.cancel.next', { name: t(item.nameKey) });
        });
      });

      standingOrderItems?.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.closest('.list-item').dataset.id;
          const item = state.standingOrders.find(dd => dd.id === id);
          if (!item) return;
          item.active = !item.active;
          renderMandates();
          recordTimeline(item.active ? 'timeline.standingOrder.resume' : 'timeline.standingOrder.pause', { name: t(item.nameKey) });
          showPrompt(item.active ? 'prompts.standingOrder.resume.message' : 'prompts.standingOrder.pause.message', 'success', item.active ? 'prompts.standingOrder.resume.next' : 'prompts.standingOrder.pause.next', { name: t(item.nameKey) });
        });
      });
    }

    function updateTaskProgress() {
      if (!taskProgress) return;
      const total = state.practiceTasks.length;
      const completed = state.practiceTasks.filter(task => task.completed).length;
      taskProgress.setAttribute('data-i18n', 'tasks.progress');
      taskProgress.setAttribute('data-i18n-completed', completed);
      taskProgress.setAttribute('data-i18n-total', total);
      taskProgress.textContent = t('tasks.progress', { completed, total });
    }

    function renderTasks() {
      if (!practiceTasksList) return;
      practiceTasksList.innerHTML = state.practiceTasks.map(task => `
        <li class="${task.completed ? 'complete' : ''}">
          <label class="task-item">
            <input type="checkbox" data-task="${task.id}" ${task.completed ? 'checked' : ''} />
            <span>
              <strong data-i18n="${task.titleKey}">${t(task.titleKey)}</strong>
              <small data-i18n="${task.helperKey}">${t(task.helperKey)}</small>
            </span>
          </label>
        </li>
      `).join('');
      updateTaskProgress();
      I18N.apply(practiceTasksList);
    }

    function completeTask(id) {
      const task = state.practiceTasks.find(item => item.id === id);
      if (!task || task.completed) return;
      task.completed = true;
      const checkbox = practiceTasksList?.querySelector(`input[data-task="${id}"]`);
      if (checkbox) {
        checkbox.checked = true;
        checkbox.closest('li')?.classList.add('complete');
      }
      updateTaskProgress();
      recordTimeline('timeline.tasks.completed', { task: t(task.titleKey) });
    }

    function resetPracticeTasks(manual = false) {
      state.practiceTasks.forEach(task => {
        task.completed = false;
      });
      practiceTasksList?.querySelectorAll('input[type="checkbox"]').forEach(input => {
        input.checked = false;
        input.closest('li')?.classList.remove('complete');
      });
      updateTaskProgress();
      if (manual) {
        showPrompt('prompts.tasks.reset.message', 'info', 'prompts.tasks.reset.next');
        recordTimeline('timeline.tasks.reset');
      }
    }

    function renderLimitSummary() {
      if (!limitSummary) return;
      const { daily, contactless } = state.spendingLimits;
      limitSummary.setAttribute('data-i18n', 'limits.summary');
      limitSummary.setAttribute('data-i18n-daily', formatCurrency(daily));
      limitSummary.setAttribute('data-i18n-contactless', formatCurrency(contactless));
      limitSummary.textContent = t('limits.summary', { daily: formatCurrency(daily), contactless: formatCurrency(contactless) });
    }

    function initLimitForm() {
      const dailyInput = document.getElementById('limitDaily');
      const contactlessInput = document.getElementById('limitContactless');
      if (dailyInput) dailyInput.value = state.spendingLimits.daily;
      if (contactlessInput) contactlessInput.value = state.spendingLimits.contactless;
      renderLimitSummary();
    }

    function handleLimitUpdate(event) {
      event.preventDefault();
      const dailyInput = document.getElementById('limitDaily');
      const contactlessInput = document.getElementById('limitContactless');
      const daily = parseFloat(dailyInput.value);
      const contactless = parseFloat(contactlessInput.value);

      if (!Number.isFinite(daily) || daily < 100 || daily > 5000) {
        showPrompt('errors.limits.dailyRange', 'error', 'errors.limits.dailyRangeNext');
        dailyInput.focus();
        return;
      }
      if (!Number.isFinite(contactless) || contactless < 10 || contactless > 500) {
        showPrompt('errors.limits.contactlessRange', 'error', 'errors.limits.contactlessRangeNext');
        contactlessInput.focus();
        return;
      }
      if (contactless > daily) {
        showPrompt('errors.limits.order', 'error', 'errors.limits.orderNext');
        contactlessInput.focus();
        return;
      }

      state.spendingLimits.daily = Math.round(daily);
      state.spendingLimits.contactless = Math.round(contactless);
      renderLimitSummary();
      dailyInput.value = state.spendingLimits.daily;
      contactlessInput.value = state.spendingLimits.contactless;
      showPrompt('notifications.limits.updated', 'success', 'notifications.limits.updatedNext');
      recordTimeline('timeline.limits.updated', {
        daily: formatCurrency(state.spendingLimits.daily),
        contactless: formatCurrency(state.spendingLimits.contactless),
      });
      completeTask('set-limits');
    }

    function handleTaskToggle(event) {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || target.type !== 'checkbox') return;
      const task = state.practiceTasks.find(item => item.id === target.dataset.task);
      if (!task) return;
      task.completed = target.checked;
      target.closest('li')?.classList.toggle('complete', task.completed);
      updateTaskProgress();
      recordTimeline(task.completed ? 'timeline.tasks.checked' : 'timeline.tasks.reopened', { task: t(task.titleKey) });
    }

    function refreshBalances() {
      state.lastSync = new Date();
      renderQuickStatus();
      showPrompt('notifications.refresh.success', 'success', 'notifications.refresh.next');
      recordTimeline('timeline.refresh');
      completeTask('check-balances');
    }

    function updateBalances(accountId, delta) {
      const account = state.accounts.find(acc => acc.id === accountId);
      if (account) {
        account.balance = Math.round((account.balance + delta) * 100) / 100;
      }
      renderAccounts();
    }

    function addTransaction(accountId, data) {
      const entry = {
        id: `tx-${Date.now()}`,
        account: accountId,
        date: new Date().toISOString().slice(0, 10),
        pending: false,
        category: 'Payments to others',
        method: 'Bank transfer',
        descriptionKey: data.descriptionKey || null,
        descriptionFallback: data.description || '',
        ...data,
      };
      state.transactions.unshift(entry);
      renderTransactions();
      renderSpendingSummary();
    }

    function buildAccountSelect(select, excludeId) {
      select.innerHTML = state.accounts.filter(acc => acc.id !== excludeId).map(acc => {
        const meta = getAccountMeta(acc.id);
        return `<option value="${acc.id}">${meta.name}</option>`;
      }).join('');
    }

    function handleTransfer(event) {
      event.preventDefault();
      const from = document.getElementById('transferFrom').value;
      const to = document.getElementById('transferTo').value;
      const amount = parseFloat(document.getElementById('transferAmount').value);
      if (!from || !to) {
        showPrompt('errors.transfer.missingAccounts', 'error', 'errors.transfer.missingAccountsNext');
        return;
      }
      if (from === to) {
        showPrompt('errors.transfer.sameAccount', 'error', 'errors.transfer.sameAccountNext');
        return;
      }
      if (!Number.isFinite(amount) || amount <= 0) {
        showPrompt('errors.transfer.amount', 'error', 'errors.transfer.amountNext');
        return;
      }
      const source = state.accounts.find(acc => acc.id === from);
      if (source.balance < amount) {
        showPrompt('errors.transfer.balance', 'error', 'errors.transfer.balanceNext');
        return;
      }

      updateBalances(from, -amount);
      updateBalances(to, amount);
      addTransaction(from, {
        amount: -amount,
        category: 'Transfer out',
        method: 'Standing order',
        description: t('transactions.new.transferOut', { account: t(ACCOUNT_NAME_KEYS[to]) }),
      });
      addTransaction(to, {
        amount,
        category: 'Transfer in',
        method: 'Transfer',
        description: t('transactions.new.transferIn', { account: t(ACCOUNT_NAME_KEYS[from]) }),
      });
      showPrompt('notifications.transfer.success', 'success', 'notifications.transfer.next');
      recordTimeline('timeline.transfer', {
        amount: formatCurrency(amount, source.currency),
        from: t(ACCOUNT_NAME_KEYS[from]),
        to: t(ACCOUNT_NAME_KEYS[to]),
      });
      completeTask('transfer-own');
      event.target.reset();
      buildAccountSelect(document.getElementById('transferTo'), document.getElementById('transferFrom').value);
    }

    function handleBill(event) {
      event.preventDefault();
      const accountId = document.getElementById('billAccount').value;
      const payee = document.getElementById('billPayee').value;
      const amount = parseFloat(document.getElementById('billAmount').value);
      const frequency = document.getElementById('billFrequency').value;
      if (!accountId || !payee || !Number.isFinite(amount) || amount <= 0) {
        showPrompt('errors.bill.incomplete', 'error', 'errors.bill.incompleteNext');
        return;
      }
      const account = state.accounts.find(acc => acc.id === accountId);
      if (account.balance < amount) {
        showPrompt('errors.bill.balance', 'error', 'errors.bill.balanceNext');
        return;
      }

      updateBalances(accountId, -amount);
      addTransaction(accountId, {
        amount: -amount,
        category: 'Payments to others',
        method: 'Direct debit',
        description: t('transactions.new.billPayment', { payee: t(BILL_PAYEES.find(p => p.value === payee)?.labelKey) }),
      });

      if (frequency !== 'once') {
        const frequencyConfig = BILL_FREQUENCIES.find(item => item.value === frequency);
        const targetList = frequency === 'monthly' ? state.directDebits : state.standingOrders;
        targetList.push({
          id: `${frequency}-${Date.now()}`,
          nameKey: BILL_PAYEES.find(p => p.value === payee)?.labelKey || null,
          name: t(BILL_PAYEES.find(p => p.value === payee)?.labelKey),
          amount,
          scheduleKey: frequencyConfig?.scheduleKey,
          active: true,
        });
        renderMandates();
        completeTask('recurring-payment');
      }

      showPrompt('notifications.bill.submitted', 'success', frequency === 'once' ? 'notifications.bill.onceNext' : 'notifications.bill.recurringNext');
      recordTimeline('timeline.bill', {
        payee: t(BILL_PAYEES.find(p => p.value === payee)?.labelKey),
        frequency: t(BILL_FREQUENCIES.find(f => f.value === frequency)?.labelKey),
        account: t(ACCOUNT_NAME_KEYS[accountId]),
      });
      event.target.reset();
    }

    function handleSendMoney(event) {
      event.preventDefault();
      const from = document.getElementById('sendFrom').value;
      const recipient = document.getElementById('sendRecipient').value.trim();
      const amount = parseFloat(document.getElementById('sendAmount').value);
      const method = document.getElementById('sendMethod').value;
      const reference = document.getElementById('sendReference').value.trim();

      if (!from || !recipient || !Number.isFinite(amount) || amount <= 0) {
        showPrompt('errors.send.incomplete', 'error', 'errors.send.incompleteNext');
        return;
      }
      const account = state.accounts.find(acc => acc.id === from);
      if (account.balance < amount) {
        showPrompt('errors.send.balance', 'error', 'errors.send.balanceNext');
        return;
      }

      updateBalances(from, -amount);
      const methodKey = SEND_METHODS[method] || SEND_METHODS.faster;
      const referenceLabel = reference ? ` — ${reference}` : '';
      addTransaction(from, {
        amount: -amount,
        category: 'Payments to others',
        method: t(methodKey),
        description: t('transactions.new.send', { recipient, reference: referenceLabel }),
        pending: method === 'bacs',
      });

      const nextKey = method === 'bacs'
        ? 'notifications.send.next.bacs'
        : method === 'chaps'
          ? 'notifications.send.next.chaps'
          : 'notifications.send.next.standard';

      showPrompt('notifications.send.success', 'success', nextKey, { method: t(methodKey) });
      recordTimeline('timeline.send', {
        amount: formatCurrency(amount, account.currency),
        recipient,
        method: t(methodKey),
      });
      completeTask('send-external');
      event.target.reset();
    }

    function handleNewDebit(event) {
      event.preventDefault();
      const type = document.getElementById('debitType').value;
      const name = document.getElementById('debitName').value.trim();
      const amount = parseFloat(document.getElementById('debitAmount').value);
      const schedule = document.getElementById('debitSchedule').value.trim();

      if (!name || !Number.isFinite(amount) || !schedule) {
        showPrompt('errors.mandate.incomplete', 'error', 'errors.mandate.incompleteNext');
        return;
      }
      const targetList = type === 'directDebit' ? state.directDebits : state.standingOrders;
      targetList.push({ id: `${type}-${Date.now()}`, name, nameKey: null, amount, schedule, scheduleKey: null, active: true });
      renderMandates();
      showPrompt(type === 'directDebit' ? 'notifications.mandate.directDebitCreated' : 'notifications.mandate.standingCreated', 'success', 'notifications.mandate.manageNext');
      recordTimeline(type === 'directDebit' ? 'timeline.directDebit.created' : 'timeline.standingOrder.created', { name });
      completeTask('recurring-payment');
      event.target.reset();
    }

    function renderViewToggle() {
      document.querySelectorAll('.view-toggle button').forEach(btn => {
        const active = btn.dataset.view === state.viewMode;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', active);
      });
    }

    function toggleViewMode(mode) {
      state.viewMode = mode;
      const shell = document.getElementById('deviceShell');
      shell.classList.toggle('phone', mode === 'phone');
      shell.classList.toggle('tablet', mode === 'tablet');
      renderViewToggle();
      showPrompt('notifications.view.switched', 'info', 'notifications.view.next', { mode: t(mode === 'phone' ? 'toolbar.phone' : 'toolbar.tablet') });
    }

    function switchTab(tab) {
      state.activeTab = tab;
      document.querySelectorAll('.tab-nav button').forEach(btn => {
        const active = btn.dataset.tab === tab;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', active);
      });
      document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === `tab-${tab}`);
      });
      const nextKey = tab === 'accounts' ? 'notifications.tab.accountsNext' : tab === 'payments' ? 'notifications.tab.paymentsNext' : 'notifications.tab.securityNext';
      showPrompt('notifications.tab.opened', 'info', nextKey, { tab: t(`navigation.${tab}.label`) });
    }

    function renderCardStatus() {
      cardStatusLabel.setAttribute('data-i18n', state.cardLocked ? 'status.cardLocked' : 'status.cardUnlocked');
      cardLockBadge.setAttribute('data-i18n', state.cardLocked ? 'card.preview.badgeLocked' : 'card.preview.badgeActive');
      cardStatusLabel.textContent = t(state.cardLocked ? 'status.cardLocked' : 'status.cardUnlocked');
      cardLockBadge.textContent = t(state.cardLocked ? 'card.preview.badgeLocked' : 'card.preview.badgeActive');
    }

    function handleCardLock(lock) {
      state.cardLocked = lock;
      renderCardStatus();
      document.getElementById('lockCardBtn').disabled = lock;
      document.getElementById('unlockCardBtn').disabled = !lock;
      showPrompt(lock ? 'notifications.card.locked' : 'notifications.card.unlocked', 'success', lock ? 'notifications.card.lockedNext' : 'notifications.card.unlockedNext');
      recordTimeline(lock ? 'timeline.card.locked' : 'timeline.card.unlocked');
    }

    function handlePinChange(event) {
      event.preventDefault();
      const pin = document.getElementById('pinNew').value;
      const confirm = document.getElementById('pinConfirm').value;
      if (!/^[0-9]{4}$/.test(pin)) {
        showPrompt('errors.pin.format', 'error', 'errors.pin.formatNext');
        return;
      }
      if (pin !== confirm) {
        showPrompt('errors.pin.match', 'error', 'errors.pin.matchNext');
        return;
      }
      state.pinLastChanged = new Date().toISOString().slice(0, 10);
      showPrompt('notifications.pin.updated', 'success', 'notifications.pin.updatedNext');
      recordTimeline('timeline.pin.changed');
      completeTask('change-pin');
      event.target.reset();
    }

    function handleCardRequest(event) {
      event.preventDefault();
      const reason = document.getElementById('cardReason').value;
      if (!reason) {
        showPrompt('errors.card.reason', 'error', 'errors.card.reasonNext');
        return;
      }
      showPrompt('notifications.card.requested', 'success', 'notifications.card.requestedNext');
      recordTimeline('timeline.card.requested', { reason: t(CARD_REASONS.find(r => r.value === reason)?.labelKey) });
      event.target.reset();
    }

    function exportSessionCsv() {
      const now = new Date();
      const rows = [
        [t('exports.session.generated'), now.toLocaleString(localeByLang[I18N.lang] || 'en-GB')],
        [],
        [t('exports.session.timelineTitle')],
        [t('exports.session.timeHeader'), t('exports.session.eventHeader')],
      ];

      if (state.timeline.length) {
        [...state.timeline].reverse().forEach(entry => {
          const label = new Date(entry.timestamp).toLocaleTimeString(localeByLang[I18N.lang] || 'en-GB', { hour: '2-digit', minute: '2-digit' });
          rows.push([label, t(entry.key, entry.vars)]);
        });
      } else {
        rows.push(['-', t('exports.session.none')]);
      }

      rows.push([]);
      rows.push([t('exports.session.tasksTitle')]);
      rows.push([t('exports.session.taskHeader'), t('exports.session.statusHeader')]);
      state.practiceTasks.forEach(task => {
        rows.push([t(task.titleKey), task.completed ? t('exports.session.completed') : t('exports.session.inProgress')]);
      });

      const csv = rows
        .map(row => row.map(value => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))
        .join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `brightwave-session-${now.toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      showPrompt('notifications.export.sessionCsv', 'success', 'notifications.export.sessionCsvNext');
      recordTimeline('timeline.export.session');
    }

    function exportCsv() {
      const account = state.accounts.find(acc => acc.id === state.selectedAccount);
      if (!account) {
        showPrompt('errors.export.account', 'error', 'errors.export.accountNext');
        return;
      }
      const rows = [
        [t('exports.statement.date'), t('exports.statement.description'), t('exports.statement.amount'), t('exports.statement.category'), t('exports.statement.method'), t('exports.statement.status')]
      ];
      state.transactions.filter(tx => tx.account === account.id).forEach(tx => {
        rows.push([
          tx.date,
          formatTransactionDescription(tx) || tx.descriptionFallback || '',
          tx.amount.toFixed(2),
          translateCategory(tx.category),
          translateMethod(tx.method),
          t(tx.pending ? 'transactions.status.pending' : 'transactions.status.cleared')
        ]);
      });
      const csv = rows.map(r => r.map(value => `"${value}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${account.id}-statement.csv`;
      link.click();
      URL.revokeObjectURL(url);
      showPrompt('notifications.export.csv', 'success', 'notifications.export.csvNext');
      recordTimeline('timeline.export.csv', { account: t(ACCOUNT_NAME_KEYS[account.id]) });
    }

    function generatePdfLines() {
      const account = state.accounts.find(acc => acc.id === state.selectedAccount);
      if (!account) return [];
      return [
        t('exports.pdf.title', { account: t(ACCOUNT_NAME_KEYS[account.id]) }),
        t('exports.pdf.generated', { time: new Date().toLocaleString(localeByLang[I18N.lang] || 'en-GB') }),
        t('exports.pdf.balance', { balance: formatCurrency(account.balance, account.currency || 'GBP') }),
        ' ',
        t('exports.pdf.headers'),
        ...state.transactions
          .filter(tx => tx.account === account.id)
          .map(tx => `${tx.date} — ${formatTransactionDescription(tx) || tx.descriptionFallback || ''} — ${formatCurrency(tx.amount, account.currency || 'GBP')} (${translateMethod(tx.method)})`)
      ];
    }

    function escapePdfText(text) {
      return text.replace(/[\\()]/g, match => ({ '\\': '\\\\', '(': '\\(', ')': '\\)' }[match]));
    }

    function pad(num) {
      return String(num).padStart(10, '0');
    }

    function buildPdfContent(lines) {
      const content = lines.map(line => `${escapePdfText(line)}\n`).join('');
      const fontSize = 12;
      const leading = fontSize + 4;
      let y = 792 - 72;
      const parts = [`BT /F1 ${fontSize} Tf 72 ${y} Td`];
      lines.forEach((line, index) => {
        if (index > 0) {
          y -= leading;
          parts.push(`T*`);
        }
        parts.push(`(${escapePdfText(line)}) Tj`);
      });
      parts.push('ET');
      return parts.join('\n');
    }

    function exportPdf() {
      const account = state.accounts.find(acc => acc.id === state.selectedAccount);
      if (!account) {
        showPrompt('errors.export.account', 'error', 'errors.export.accountNext');
        return;
      }
      const lines = generatePdfLines();
      const contentStream = buildPdfContent(lines);
      const objects = [];
      const offsets = [];
      const addObject = (obj) => {
        offsets.push(objects.join('').length + '%PDF-1.4\n'.length);
        objects.push(obj);
      };

      addObject('1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj\n');
      addObject('2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj\n');
      addObject('3 0 obj<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>endobj\n');
      addObject('4 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj\n');
      addObject(`5 0 obj<< /Length ${contentStream.length} >>stream\n${contentStream}\nendstream\nendobj\n`);

      const body = objects.join('');
      const header = '%PDF-1.4\n';
      const xrefStart = header.length + body.length;
      const xref = ['xref\n0 6\n0000000000 65535 f \n'];
      offsets.forEach(off => {
        xref.push(`${pad(off)} 00000 n \n`);
      });
      const trailer = `trailer<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
      const pdf = header + body + xref.join('') + trailer;
      const blob = new Blob([pdf], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${account.id}-statement.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      showPrompt('notifications.export.pdf', 'success', 'notifications.export.pdfNext');
      recordTimeline('timeline.export.pdf', { account: t(ACCOUNT_NAME_KEYS[account.id]) });
    }

    function initTime() {
      const statusTime = document.getElementById('statusTime');
      const updateTime = () => {
        statusTime.textContent = new Date().toLocaleTimeString(localeByLang[I18N.lang] || 'en-GB', { hour: '2-digit', minute: '2-digit' });
      };
      updateTime();
      setInterval(updateTime, 60000);
    }

    document.querySelectorAll('.view-toggle button').forEach(btn => {
      btn.addEventListener('click', () => toggleViewMode(btn.dataset.view));
    });

    document.querySelectorAll('.tab-nav button').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    document.getElementById('refreshBtn').addEventListener('click', refreshBalances);
    document.getElementById('clearTimelineBtn').addEventListener('click', () => {
      state.timeline = [];
      renderTimeline();
      showPrompt('notifications.timeline.cleared', 'info', 'notifications.timeline.clearedNext');
    });

    document.getElementById('exportSessionCsvBtn').addEventListener('click', exportSessionCsv);

    accountFilter.addEventListener('change', (event) => {
      state.selectedAccount = event.target.value;
      renderAccounts();
      renderTransactions();
      renderSpendingSummary();
      showPrompt('notifications.transactions.updated', 'info', 'notifications.transactions.updatedNext');
    });

    document.getElementById('transferForm').addEventListener('submit', handleTransfer);
    document.getElementById('billForm').addEventListener('submit', handleBill);
    document.getElementById('sendMoneyForm').addEventListener('submit', handleSendMoney);
    document.getElementById('newDebitForm').addEventListener('submit', handleNewDebit);
    document.getElementById('lockCardBtn').addEventListener('click', () => handleCardLock(true));
    document.getElementById('unlockCardBtn').addEventListener('click', () => handleCardLock(false));
    document.getElementById('limitForm').addEventListener('submit', handleLimitUpdate);
    document.getElementById('pinForm').addEventListener('submit', handlePinChange);
    document.getElementById('cardRequestForm').addEventListener('submit', handleCardRequest);
    document.getElementById('exportCsvBtn').addEventListener('click', exportCsv);
    document.getElementById('exportPdfBtn').addEventListener('click', exportPdf);
    document.getElementById('resetTasksBtn').addEventListener('click', () => resetPracticeTasks(true));
    if (practiceTasksList) {
      practiceTasksList.addEventListener('change', handleTaskToggle);
    }

    function initForms() {
      const fromSelect = document.getElementById('transferFrom');
      const toSelect = document.getElementById('transferTo');
      fromSelect.innerHTML = state.accounts.map(acc => `<option value="${acc.id}">${t(ACCOUNT_NAME_KEYS[acc.id])}</option>`).join('');
      fromSelect.value = 'current';
      buildAccountSelect(toSelect, fromSelect.value);
      fromSelect.addEventListener('change', () => buildAccountSelect(toSelect, fromSelect.value));

      document.getElementById('billAccount').innerHTML = state.accounts.map(acc => `<option value="${acc.id}">${t(ACCOUNT_NAME_KEYS[acc.id])}</option>`).join('');
      document.getElementById('billPayee').innerHTML = BILL_PAYEES.map(item => `<option value="${item.value}">${t(item.labelKey)}</option>`).join('');
      document.getElementById('billFrequency').innerHTML = BILL_FREQUENCIES.map(item => `<option value="${item.value}">${t(item.labelKey)}</option>`).join('');
      document.getElementById('sendFrom').innerHTML = state.accounts.map(acc => `<option value="${acc.id}">${t(ACCOUNT_NAME_KEYS[acc.id])}</option>`).join('');
      document.getElementById('sendMethod').innerHTML = Object.entries(SEND_METHODS).map(([value, labelKey]) => `<option value="${value}">${t(labelKey)}</option>`).join('');
      document.getElementById('cardReason').innerHTML = CARD_REASONS.map(item => `<option value="${item.value}">${t(item.labelKey)}</option>`).join('');
    }

    function rerenderAfterLanguageChange() {
      renderQuickStatus();
      renderPrompt();
      renderAccounts();
      renderAccountFilter();
      renderTransactions();
      renderSpendingSummary();
      renderMandates();
      renderTasks();
      renderTimeline();
      renderLimitSummary();
      renderCardStatus();
      updateTaskProgress();
    }

    function init() {
      initForms();
      renderQuickStatus();
      renderPrompt();
      renderAccounts();
      renderAccountFilter();
      renderTransactions();
      renderSpendingSummary();
      renderMandates();
      renderTasks();
      renderTimeline();
      renderLimitSummary();
      renderCardStatus();
      renderViewToggle();
      initLimitForm();
      initTime();
    }

    init();

    const originalApply = I18N.apply.bind(I18N);
    let rerendering = false;
    I18N.apply = (root = document) => {
      originalApply(root);
      const shouldRerender = !rerendering && (!root || root === document);
      if (shouldRerender) {
        rerendering = true;
        try {
          rerenderAfterLanguageChange();
        } finally {
          rerendering = false;
        }
      }
    };
  });
});
