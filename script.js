'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
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

// Functions
const currentBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `$${acc.balance}`;
};

const displayStatements = function (transaction, sort = false) {
  containerMovements.innerHTML = '';

  // Sorting
  const movs = sort ? transaction.slice().sort((a, b) => a - b) : transaction;

  movs.forEach((amount, index) => {
    const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${amount > 0 ? 'deposit' : 'withdrawal'}">${index + 1} deposit</div>
            <div class="movements__date">3 days ago</div>
            <div class="movements__value"> $${Math.abs(amount)}</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const displayAmountSummery = function (amount) {
  const income = amount.filter(value => value > 0).reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = income;

  const outcome = amount.filter(value => value < 0).reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = Math.abs(outcome);

  const interest = amount
    .filter(value => value > 0)
    .map(value => (value * 1.2) / 100)
    .filter(int => int >= 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = Math.trunc(interest);
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
  displayStatements(acc.movements);
  displayAmountSummery(acc.movements);
};

const clearInputFields = function (p1, p2) {
  p1.value = p2.value = '';
  p1.blur();
  p2.blur();
};

// Event handlers
let currentUser;

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

  if (amount > 0 && receiverAcc && currentUser.balance >= amount && receiverAcc?.userName !== currentUser.userName) {
    receiverAcc.movements.push(amount);
    currentUser.movements.push(-amount);

    updateUI(currentUser);
    clearInputFields(inputTransferTo, inputTransferAmount);
  }
});

// Request loan functionality
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && amount <= 5000) {
    currentUser.movements.push(amount);
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

  displayStatements(currentUser.movements, !sorted);
  sorted = !sorted;
});
