const inputEmail = document.getElementById('inputEmail');
const inputPassword = document.getElementById('inputPassword');
const login = document.getElementById('buttonLogin');
const invalidLogin = document.getElementById('invalidLogin');

function redirectToRegister(){
    window.location.href = 'register.html'
}

function redirectToCalculator(){
    window.location.href = 'calculator.html'
}

inputEmail.addEventListener('click', ()=>{
    inputEmail.style.borderBottomColor = 'green';
    inputEmail.style.color = 'black';
    inputPassword.style.borderBottomColor = 'green';
    inputPassword.style.color = 'black';
    invalidLogin.style.display = 'none'
})
    
inputPassword.addEventListener('click', ()=>{
    inputPassword.style.borderBottomColor = 'green';
    inputPassword.style.color = 'black';
    inputEmail.style.borderBottomColor = 'green';
    inputEmail.style.color = 'black';
    invalidLogin.style.display = 'none'
})

function statusLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    return isLoggedIn === 'true'; // Convertendo a string 'true' para um valor booleano
}

function logout() {
    localStorage.setItem('isLoggedIn', 'false');
}

function startLogoutTimer() {
    setTimeout(() => {
        logout();
    }, 50000); 
}

login.addEventListener('click', ()=>{
    const email = inputEmail.value;
    const password = inputPassword.value;

    if (!email || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    userData = {
        email: email,
        password: password
    }
    
    fetch('http://localhost:3001/user/login',{
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then((response) => {
        if (!response.ok) {
           throw new Error('Login não encontrado')
        }

        return response.json();
    })
    .then(data => {
        alert('Logado com sucesso!');
        localStorage.setItem('isLoggedIn', 'true');
        if (statusLogin()) {
            localStorage.setItem('email', email);
            redirectToCalculator();
        }
    })
    .catch(error => {
        inputEmail.style.borderBottomColor = 'red';
        inputEmail.style.color = 'red';
        inputPassword.style.borderBottomColor = 'red';
        inputPassword.style.color = 'red';
        invalidLogin.style.display = 'block'
    });
})
