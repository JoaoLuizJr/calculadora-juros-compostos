const inputName = document.getElementById('inputName');
const inputCell = document.getElementById('inputCell');
const inputEmail = document.getElementById('inputEmail');
const inputPassword = document.getElementById('inputPassword');
const buttonRegister = document.getElementById('buttonRegister');
const inputRepeatPassword = document.getElementById('inputRepeatPassword');
const section = document.getElementById('section');
const invalidName = document.getElementById('invalidName');
const invalidCell = document.getElementById('invalidCell');
const invalidEmail = document.getElementById('invalidEmail');
const invalidPassword = document.getElementById('invalidPassword');
const invalidRepeatPassword = document.getElementById('invalidRepeatPassword');
const existEmail = document.getElementById('existEmail');
const existCell = document.getElementById('existCell');


function redirectToLogin(){
    window.location.href = '/'
}

document.addEventListener('DOMContentLoaded', ()=>{
    buttonRegister.disabled = true;
    buttonRegister.style = "background-color: gray;";
});

section.addEventListener('input', checkField);
section.addEventListener('click', checkField);

function checkField(){
  const name = inputName.value;
  const cell = inputCell.value;
  const email = inputEmail.value;
  const password = inputPassword.value;
  const repeatPassword = inputRepeatPassword.value;

  if (name !== '' && cell !== '' && email !== '' && password !== '' && repeatPassword === password) {
    if (invalidName.style.display === "none" && invalidCell.style.display === "none" && invalidEmail.style.display === "none" && invalidPassword.style.display === "none" && invalidRepeatPassword.style.display === "none") {
      buttonRegister.disabled = false;
      buttonRegister.style = "background-color: green";
    }else{
      buttonRegister.disabled = true;
      buttonRegister.style = "background-color: gray;";
    }
  }else{
    buttonRegister.disabled = true;
    buttonRegister.style = "background-color: gray;";
  }
}

function checkNumberName() {
  if (/\d/.test(inputName.value)) {
    inputName.style.borderBottomColor = "red";
    invalidName.style.display = "block"
  }else{
      inputName.style.borderBottomColor = "green";
      invalidName.style.display = "none";
    }  
}

function checkLetterCell() {
  const cell = inputCell.value;

  inputCell.style.borderBottomColor = 'green';
  existCell.style.display = 'none';

  if (/[a-zA-Z]/.test(inputCell.value) || /\s/.test(inputCell.value)){
    inputCell.style.borderBottomColor = "red";
    invalidCell.style.display = "block"
  }else{
    inputCell.style.borderBottomColor = "green";
    invalidCell.style.display = "none";
  }  

  fetch('https://1wwt71fga3.execute-api.us-east-1.amazonaws.com/calculator-dev/user/checkCell?cell=' + cell, {
  method: 'GET',
  headers:{
    'Content-Type': 'application/json'
  },
  })
  .then((response) =>{
    if (!response.ok) {
      throw new Error('Esse Celular já existe');
    }
    return response.json();
  })
  .then((data) => {
    // Você pode adicionar aqui qualquer lógica adicional que desejar para um email válido
  })
  .catch((error) => {
    console.error('Erro:', error.message);
    inputCell.style.borderBottomColor = 'red';
    existCell.style.display = 'block';
  });
}

async function checkEmail() {
  const email = inputEmail.value;

  inputEmail.style.borderBottomColor = 'green';
  existEmail.style.display = 'none';

  if (/^[^\s@]+@[^\s@]*$/.test(inputEmail.value) && /\.[a-zA-Z]/.test(inputEmail.value) && !/@\.com/.test(inputEmail.value) && !/\s/.test(inputEmail.value)) {
    inputEmail.style.borderBottomColor = "green";
    invalidEmail.style.display = "none";
  }else if (inputEmail.value === '') {
    inputEmail.style.borderBottomColor = "green";
    invalidEmail.style.display = "none";
  }else{
    inputEmail.style.borderBottomColor = "red";
    invalidEmail.style.display = "block"
  }

  fetch('https://1wwt71fga3.execute-api.us-east-1.amazonaws.com/calculator-dev/user/checkEmail?email=' + email, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('Esse email já existe');
    }
    return response.json();
  })
  .then((data) => {
    // Você pode adicionar aqui qualquer lógica adicional que desejar para um email válido
  })
  .catch((error) => {
    console.error('Erro:', error.message);
    inputEmail.style.borderBottomColor = 'red';
    existEmail.style.display = 'block';
  });
}

function checkPassword() {
  if (!/[sáàãâéèêíïóôõöúçñÁÀÃÂÉÈÊÍÏÓÔÕÖÚÇÑ]/.test(inputPassword.value)) {
    inputPassword.style.borderBottomColor = "green";
    invalidPassword.style.display = "none";
  }else{
    inputPassword.style.borderBottomColor = "red";
    invalidPassword.style.display = "block"
  }
} 

function checkRepeatPassword() {
  if (inputPassword.value === inputRepeatPassword.value) {
    invalidRepeatPassword.style.display = "none";
    inputRepeatPassword.style.borderBottomColor = "green";
  }else if (inputRepeatPassword.value === '') {
    inputRepeatPassword.style.borderBottomColor = "green";
    invalidRepeatPassword.style.display = "none";
  }else{
    inputRepeatPassword.style.borderBottomColor = "red";
    invalidRepeatPassword.style.display = "block"
  }
}

function registerUser() {
  const name = inputName.value;
  const cell = inputCell.value;
  const email = inputEmail.value;
  const password = inputPassword.value;

  let userData = {
    name: name,
    cell: cell,
    email: email,
    password: password
  }

  fetch('https://1wwt71fga3.execute-api.us-east-1.amazonaws.com/calculator-dev/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })
  .then(response => response.json())
  .then(data => {
      redirectToLogin();
  })
  .catch(error => {
    console.error('Erro ao criar usuário:', error);
    alert('Erro ao criar usuário. Consulte o console para obter mais informações.');
  });
}