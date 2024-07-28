'use strict';

/////////////////////////////////////////////////////////
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: ['2019-11-01T13:15:33.035Z', '2019-11-30T09:48:16.867Z', '2019-12-25T06:04:23.907Z', '2020-01-25T14:18:46.235Z', '2020-02-05T16:33:06.386Z', '2020-04-10T14:43:26.374Z', '2024-07-20T18:49:59.371Z', '2024-07-23T12:01:20.894Z'],
  currency: 'USD',
  locale: 'en-US',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: ['2019-11-18T21:31:17.178Z', '2019-12-23T07:42:02.383Z', '2020-01-28T09:15:04.904Z', '2020-04-01T10:17:24.185Z', '2020-05-08T14:11:59.604Z', '2020-07-26T17:01:17.194Z', '2020-07-28T23:36:17.929Z', '2020-08-01T10:51:36.790Z'],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return `Today`;
  if (daysPassed === 1) return `Yesterday`;
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const currentBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `$${acc.balance.toFixed(2)}`;
};

const displayStatements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  // Sorting
  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach((amount, i) => {
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${amount > 0 ? 'deposit' : 'withdrawal'}">${i + 1} deposit</div>
            <div class="movements__date">${displayDate}</div>
            <div class="movements__value"> $${Math.abs(amount).toFixed(2)}</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const displayAmountSummery = function (amount) {
  const income = amount.filter(value => value > 0).reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = income.toFixed(2);

  const outcome = amount.filter(value => value < 0).reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = Math.abs(outcome).toFixed(2);

  const interest = amount
    .filter(value => value > 0)
    .map(value => (value * 1.2) / 100)
    .filter(int => int >= 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = Math.trunc(interest).toFixed(2);
};

const createUserName = function (accs) {
  accs.forEach(acc => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserName(accounts);

const updateUI = function (acc) {
  currentBalance(acc);
  displayStatements(acc);
  displayAmountSummery(acc.movements);

  // Update date
  const now = new Date();
  const option = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  labelDate.textContent = new Intl.DateTimeFormat(acc.locale, option).format(now);
};

const clearInputFields = function (p1, p2) {
  p1.value = p2.value = '';
  p1.blur();
  p2.blur();
};

// Event handlers
let currentUser;

// fake logged-in
currentUser = account1;
updateUI(currentUser);
containerApp.style.opacity = 100;

// Login functionality
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentUser = accounts.filter(acc => acc.userName === inputLoginUsername.value)[0];

  if (currentUser.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome ${currentUser.owner.split(' ')[0]}`;

    containerApp.style.opacity = 100;
    updateUI(currentUser);
  }

  clearInputFields(inputLoginUsername, inputLoginPin);
});

// Transfer money functionality
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.filter(acc => acc.userName === inputTransferTo.value)[0];
  const date = new Date().toISOString();

  if (amount > 0 && receiverAcc && currentUser.balance >= amount && receiverAcc?.userName !== currentUser.userName) {
    receiverAcc.movements.push(amount);
    receiverAcc.movementsDates.push(date);
    currentUser.movements.push(-amount);
    currentUser.movementsDates.push(date);

    updateUI(currentUser);
    clearInputFields(inputTransferTo, inputTransferAmount);
  }
});

// Request loan functionality
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  const date = new Date().toISOString();

  if (amount > 0 && amount <= 5000) {
    currentUser.movements.push(amount);
    currentUser.movementsDates.push(date);
    updateUI(currentUser);
  }
});

// Delete account functionality
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (inputCloseUsername.value === currentUser.userName && Number(inputClosePin.value) === currentUser.pin) {
    const index = accounts.findIndex(acc => inputCloseUsername.value === currentUser.userName);

    // delete account
    accounts.splice(index, 1);

    // hide UI
    containerApp.style.opacity = 0;
  }
  clearInputFields(inputCloseUsername, inputClosePin);
});

// Sorting functionality
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayStatements(currentUser, !sorted);
  sorted = !sorted;
});
