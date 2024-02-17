const buttonClose = document.getElementById('buttonClose');
const buttonEmail = document.getElementById('buttonEmail');
const resultsOnlyInvest = document.getElementById('resultsOnlyInvest');
const resultsGainFees = document.getElementById('resultsGainFees');
const resultsInvestFees = document.getElementById('resultsInvestFees');
const sectionResults = document.getElementById('sectionResults');
const responseEmail = document.getElementById('responseEmail');
const notOperations = document.getElementById('notOperations');

const storeEmail = localStorage.getItem('email');
const storedOperations = localStorage.getItem('operations');
const operations = JSON.parse(storedOperations);


function redirectToCalculator() {
    window.location.href = 'calculator.html';
}

document.addEventListener('DOMContentLoaded', ()=>{
    responseEmail.style.display = 'none';

    console.log(operations);
    if (operations.Count === 0) {
        notOperations.style.display = 'block';
        buttonEmail.disabled = true;
    } else {
        operations.Items.forEach(operation => {
            const newCard = document.createElement('sectionResults');
            newCard.innerHTML = `
                <div class="table">
                    <div class="classification">
                        <p class="event">Evento</p>
                        <p class="value-table">Valores</p>
                    </div>
    
                    <hr class="line-table">
    
                    <div class="results">
                        <p class="total">Valor inicial</p>
                        <p class="total-value">${operation.initial}</p>
                    </div>
    
                    <hr class="line-table">
    
                    <div class="results">
                        <p class="total">Valor mensal</p>
                        <p class="total-value">${operation.monthly}</p>
                    </div>
    
                    <hr class="line-table">
    
                    <div class="results">
                        <p class="total">Rendimento</p>
                        <p class="total-value">${operation.fees}</p>
                    </div>
    
                    <hr class="line-table">
    
                    <div class="results">
                        <p class="total">Duração</p>
                        <p class="total-value">${operation.temp}</p>
                    </div>
    
                    <hr class="line-table">
                    
                    <div class="results">
                        <p class="total">Total Investido</p>
                        <p class="total-value">${operation.totalInvest}</p>
                    </div>
    
                    <hr class="line-table">
    
                    <div class="results">
                        <p class="total">Total de ganhos em JUROS</p>
                        <p class="total-value">${operation.totalFees}</p>
                    </div>
    
                    <hr class="line-table">
    
                    <div class="results">
                        <p class="text-total">Total</p>
                        <p class="total-all">${operation.total}</p>
                    </div>
                </div>
            `;
    
            sectionResults.appendChild(newCard);
        });
    }
});

startLogoutTimer();

buttonClose.addEventListener('click', ()=>{
    if (localStorage.getItem('isLoggedIn') === 'false') {
        redirectToIndex();
    }else{
        redirectToCalculator();
    }
})

buttonEmail.addEventListener('click',()=>{
    if (localStorage.getItem('isLoggedIn') === 'false') {
        redirectToIndex();
    }else{
        buttonEmail.disabled = true;
        sendEmail();
    } 
});

function sendEmail() {
    dataLogin = {
        to: storeEmail,
        subject: 'Suas Operações:' ,
        body: operations.Items
    }

    fetch('https://1wwt71fga3.execute-api.us-east-1.amazonaws.com/calculator-dev/operations/send-email',{  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataLogin)
    })
    .then(response => response.json())
    .then(data => {
        // Aqui você pode lidar com a resposta da solicitação, se necessário
        responseEmail.style.display = 'block';
        responseEmail.innerHTML = data.message;
        responseEmail.classList.add('slide-in-left');
        setTimeout(() => {
            responseEmail.style.display = 'none';
            responseEmail.classList.remove('slide-in-left');
        }, 10000);
        buttonEmail.disabled = false;
    })
    .catch(error => {
        responseEmail.style.display = 'block';
        responseEmail.innerHTML = error;
        responseEmail.classList.add('slide-in-left');
        setTimeout(() => {
            responseEmail.style.display = 'none';
            responseEmail.classList.remove('slide-in-left');
        }, 10000);
    }); 
}