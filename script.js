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

const currentBalance = function (acc) {
  const balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `$${balance}`;
};

const displayStatements = function (transaction) {
  containerMovements.innerHTML = '';

  transaction.forEach((amount, index) => {
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
  const income = amount.filter(value => value > 0).reduce((acc, cur) => acc + cur);
  labelSumIn.textContent = income;

  const outcome = amount.filter(value => value < 0).reduce((acc, cur) => acc + cur);
  labelSumOut.textContent = Math.abs(outcome);

  const interest = amount
    .filter(value => value > 0)
    .map(value => (value * 1.2) / 100)
    .filter(int => int >= 1)
    .reduce((acc, cur) => acc + cur);
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

let currentUser;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentUser = accounts.filter(acc => acc.userName === inputLoginUsername.value)[0];
  console.log(currentUser);

  labelWelcome.textContent = `Welcome ${currentUser.owner.split(' ')[0]}`;

  if (currentUser.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;

    currentBalance(currentUser);
    displayStatements(currentUser.movements);
    displayAmountSummery(currentUser.movements);
  }

  // Clear input fields
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginUsername.blur();
  inputLoginPin.blur();
});
