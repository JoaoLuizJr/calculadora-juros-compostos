const initial = document.getElementById('initialValue');
const monthly = document.getElementById('monthlyValue');
const fees = document.getElementById('interestRate');
const temp = document.getElementById('temp');
const selectTemp = document.getElementById('selectTemp');
const period = document.getElementById('period');
const buttonCalculate = document.getElementById('buttonCalculate');
const totalGainFees = document.getElementById('totalGainFees');
const totalOnlyInvest = document.getElementById('totalOnlyInvest');
const totalInvestFess = document.getElementById('totalInvestFees');
const sectionInput = document.getElementById('sectionInput');
const buttonLogin = document.getElementById('buttonLogin');
const optionMonthly = document.querySelector('#period option[value="months"]');
const optionYears = document.querySelector('#period option[value="years"]');   
const registrationData = document.getElementById('registrationData');
const buttonAccount = document.getElementById('buttonAccount');
const fieldName = document.getElementById('name');
const fieldEmail = document.getElementById('email');
const fieldCell = document.getElementById('cell');
const inputName = document.getElementById('inputName');
const inputCell = document.getElementById('inputCell');
const buttonEditName = document.getElementById('buttonEditName');
const buttonEditCell = document.getElementById('buttonEditCell');
const iconEditName = document.getElementById('iconEditName');
const iconEditCell = document.getElementById('iconEditCell');
const buttonConsult = document.getElementById('buttonConsultOperations');
const buttonPerfil = document.getElementById('buttonPerfil');
const buttonOperations = document.getElementById('buttonOperations');
const divOperations = document.getElementById('divOperations');
const divData = document.getElementById('divData')
const selectAccess = document.getElementById('accesses');

const email = localStorage.getItem('email');

document.addEventListener('DOMContentLoaded', ()=>{
     fetch('https://1wwt71fga3.execute-api.us-east-1.amazonaws.com/calculator-dev/operations/getAccesses?email=' + email,{
        method: 'GET',
            headers: {
            'Content-Type': 'application/json'
            },
     })
     .then(response => response.json())
        .then(accesses => {
            // Ordenar acessos em ordem decrescente com base na data
            accesses.sort((a, b) => new Date(b.date) - new Date(a.date));

            accesses.forEach(access => {
                const option = document.createElement('option');
                option.value = access._id;
                option.textContent = access.date;
                selectAccess.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao obter acessos:', error));
});

startLogoutTimer();

buttonAccount.addEventListener('click', async ()=>{
    if (localStorage.getItem('isLoggedIn') === 'false') {
        redirectToIndex();
    }

    buttonPerfil.classList.add('click');
        
    divOperations.style.display = 'none';

    if (registrationData.style.display === 'none') {
        registrationData.style.display = 'block';
    }else{
        registrationData.style.display = 'none';
    }

    try {
        const response = await fetch('https://1wwt71fga3.execute-api.us-east-1.amazonaws.com/calculator-dev/user/accountData?email=' + email, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json'
            },
        })

        if (response.ok) {
            const userData = await response.json();

            fieldName.innerHTML = userData.name;
            inputName.value = userData.name;
            fieldEmail.innerHTML = userData.email;
            fieldCell.innerHTML = userData.cell;
            inputCell.value = userData.cell;
        } else {
            console.error('Erro na requisição POST:', response.status);
        }
    } catch (error) {
        console.error('Erro durante a requisição POST:', error);
    }   
});

buttonEditName.addEventListener('click', ()=>{
    if (inputName.style.display === 'none') {
        iconEditName.style.color = 'red';
        inputName.style.display = 'block';
        fieldName.style.display = 'none';
    }else{
        inputName.style.display = 'none';
        fieldName.style.display = 'block';
        iconEditName.style = 'color: green';

    }
});

inputName.addEventListener('blur', async()=>{
    const newName = inputName.value;

    dataName = {
        newName: newName,
        email: email
    }

    try {
        const response = await fetch('https://1wwt71fga3.execute-api.us-east-1.amazonaws.com/calculator-dev/user/name',{
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataName)
        })
        if (response.ok) {
            fieldName.innerHTML = inputName.value;
        } else {
            console.log(dataName);
            console.error('Erro na requisição POST:', response.status);
        }
    } catch (error) {
        console.error('Erro durante a requisição POST:', error);
    }
});

inputCell.addEventListener('blur', async()=>{
    const newCell = inputCell.value;

    dataCell = {
        newCell: newCell,
        email: email
    }

    try {
        const response = await fetch('https://1wwt71fga3.execute-api.us-east-1.amazonaws.com/calculator-dev/user/cell',{
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataCell)
        })
        if (response.ok) {
            fieldCell.innerHTML = inputCell.value;
        } else { 
            console.error('Erro na requisição POST:', response.status);
        }
    } catch (error) {
        console.error('Erro durante a requisição POST:', error);
    }
});

buttonEditCell.addEventListener('click', ()=>{
    if (inputCell.style.display === 'none') {
        inputCell.style.display = 'block';
        iconEditCell.style = 'color: red';
        fieldCell.style.display = 'none';
    }else{
        inputCell.style.display = 'none';
        iconEditCell.style = 'color: green';
        fieldCell.style.display = 'block';
    }
});

buttonPerfil.addEventListener('click', ()=>{
    if (buttonPerfil.classList.contains('click')) {
        buttonPerfil.classList.remove('click');
        buttonOperations.classList.add('click');
        divOperations.style.display = 'block';
        divData.style.display = 'none';
    }else{
        buttonPerfil.classList.add('click');
        buttonOperations.classList.remove('click');
        divOperations.style.display = 'none';
        divData.style.display = 'block';
    }
})

buttonOperations.addEventListener('click', ()=>{
    buttonPerfil.classList.remove('click');

    if (!buttonOperations.classList.contains('click')) {
        buttonOperations.classList.add('click');
        buttonPerfil.classList.remove('click');
        divOperations.style.display = 'block';
        divData.style.display = 'none';
    }else{
        buttonOperations.classList.remove('click');
        buttonPerfil.classList.add('click');
        divOperations.style.display = 'none';
        divData.style.display = 'block';
    }
})

buttonConsult.addEventListener('click', async()=>{
    if (localStorage.getItem('isLoggedIn') === 'false') {
        redirectToIndex();
    }
    
    const valueSelect = selectAccess.value;

    try {
        const response = await fetch('https://1wwt71fga3.execute-api.us-east-1.amazonaws.com/calculator-dev/operations/consultOperations?accessId=' + valueSelect,{
        method: 'GET',
        headers:{
            'Content-Type': 'application/json'
        },
    })

    if (response.ok) {
        const dataOperation = await response.json();
        let operationString = JSON.stringify(dataOperation);
        localStorage.setItem('operations', operationString);
        redirectToOperations();
    } else {
        console.error('Erro na requisição POST:', response.status);
    }

    } catch (error) {
        console.error('Erro durante a requisição POST:', error);
    }
})

selectTemp.addEventListener('change', function() {
    if (selectTemp.value === 'yearly') {
        optionMonthly.style.display = 'none';
        period.value === 'years'
    } else {
        optionMonthly.style.display = 'block';
    }
    if (selectTemp.value === 'yearly' && optionMonthly.selected) {
        optionYears.selected = true;
    }
});

if (selectTemp.value === 'yearly') {
    optionMonthly.style.display = 'none';
}

buttonCalculate.disabled = true;
buttonCalculate.style = "background-color: gray;";

fees.addEventListener('input', validateFields);
temp.addEventListener('input', validateFields);
initial.addEventListener('input', validateFields);
monthly.addEventListener('input', validateFields);

buttonCalculate.addEventListener('click', async()=>{
    let valueInitial = parseFloat(initial.value);
    let valueMonthly = parseFloat(monthly.value);
    let valueFees = parseFloat(fees.value);
    let valueTemp = parseFloat(temp.value);
    
    let total = 0;
    let totalInvest = 0;
    let totalFess = 0
    let depositMonthly = 0;
    let onlyFeesInitial = 0;
    let onlyFeesMonthly = 0;
    let onlyValueMonthly = valueMonthly;
    let percentageFees = ''
    let resultsTemp = ''

    if (selectTemp.value === 'yearly') {
        percentageFees = valueFees + '% ' + 'ao ano';
    } else {
        percentageFees = valueFees + '% ' + 'ao mês';
    }

    if (valueTemp > 1) {
        if (period.value === 'years') {
            resultsTemp = valueTemp + ' anos';
        } else{
            resultsTemp = valueTemp + ' meses';
        }   
    } else{
        if (period.value === 'years') {
            resultsTemp = valueTemp + ' ano';
        } else {
            resultsTemp = valueTemp + ' mês';
        }
    }

    const resultsInitial = 'R$ '+ valueInitial;
    const resultsMonthly = 'R$ '+ valueMonthly;
    
    if (isNaN(valueInitial)){
        valueInitial = 0;
    }

    if (isNaN(valueMonthly)) {
        valueMonthly = 0;
    }

    if (sectionInput.style.display === 'none') {
        sectionInput.style.display = 'block';
    }

    if (selectTemp.value === 'monthly') {
        if (period.value === 'years') {
            valueTemp = valueTemp * 12;
            depositMonthly = valueMonthly * valueTemp;
            totalInvest = valueInitial + depositMonthly;
    
            for(let cont = 0; cont < valueTemp; cont++) {
                onlyFeesInitial = valueInitial * (valueFees/100);
                valueInitial = valueInitial + onlyFeesInitial;
    
                if (cont > 0) {
                    onlyFeesMonthly = valueMonthly * (valueFees/100);
                    valueMonthly = onlyFeesMonthly + onlyValueMonthly + valueMonthly;   
                }
    
                if (isNaN(valueMonthly)) {
                    valueMonthly = 0;
                }
            }   
            
            total = valueMonthly + valueInitial;
            totalFess = total - totalInvest;
        }else{
            depositMonthly = valueMonthly * valueTemp;
            totalInvest = valueInitial + depositMonthly;

            for(let cont = 0; cont < valueTemp; cont++) {
                onlyFeesInitial = valueInitial * (valueFees/100);
                valueInitial = valueInitial + onlyFeesInitial;

                if (cont > 0) {
                    onlyFeesMonthly = valueMonthly * (valueFees/100);
                    valueMonthly = onlyFeesMonthly + onlyValueMonthly + valueMonthly;     
                }

                if (isNaN(valueMonthly)) {
                    valueMonthly = 0;
                }
            }
        }

        total = valueMonthly + valueInitial;
        totalFess = total - totalInvest;

    }else{
        valueTemp = valueTemp * 12;
        depositMonthly = valueMonthly * valueTemp;
        totalInvest = valueInitial + depositMonthly;
    
        for(let cont = 1; cont <= valueTemp; cont++) {
            cont = cont + 11;
            
            onlyFeesInitial = valueInitial * (valueFees/100);
            onlyFeesMonthly = depositMonthly * (valueFees/100);
            valueInitial = valueInitial + onlyFeesInitial;
            depositMonthly = depositMonthly + onlyFeesMonthly;
        }
        total = valueInitial + depositMonthly;     
        totalFess = total - totalInvest; 
    }

    totalGainFees.textContent =  'R$ '+ totalFess.toFixed(2);
    totalOnlyInvest.textContent = 'R$ '+ totalInvest.toFixed(2);
    totalInvestFess.textContent = 'R$ '+ total.toFixed(2);

    const resultsFees = 'R$ ' + totalFess.toFixed(2);
    const resultsInvest = 'R$ ' + totalInvest.toFixed(2);
    const resultsInvestFees = 'R$ ' + total.toFixed(2);

    userOperations = {
        resultsInitial: resultsInitial,
        resultsMonthly: resultsMonthly,
        percentageFees: percentageFees,
        resultsTemp: resultsTemp,
        resultsInvest: resultsInvest,
        resultsFees: resultsFees,
        resultsInvestFees: resultsInvestFees,
        email: email  
    }

    if (localStorage.getItem('isLoggedIn') === 'false') {
        redirectToIndex();
    }else{
            fetch('https://1wwt71fga3.execute-api.us-east-1.amazonaws.com/calculator-dev/operations/calculate',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userOperations)
            })
            .then(response => response.json())
            .then(data => {
            })
            .catch(error => console.error('Erro ao calcular:', error));
        }
});

initial.addEventListener('input', function() {
    if (this.value < 0) {
        this.value = ''; 
    }
});

monthly.addEventListener('input', function() {
    if (this.value < 0) {
        this.value = ''; // Define o valor como vazio se for um número negativo
    }
});

temp.addEventListener('input', function() {
    if (this.value < 0) {
        this.value = ''; // Define o valor como vazio se for um número negativo
    }
});

function validateFields() {
    if (fees.value !== '' && temp.value > 0) {
        if (initial.value !== '' || monthly.value !== '') {
            buttonCalculate.style = "background-color: green;"
            buttonCalculate.disabled = false;
        }else{
            buttonCalculate.style = "background-color: gray;"
            buttonCalculate.disabled = true;
        }
    }else if(fees.value === '' || temp.value <= 0){
        buttonCalculate.style = "background-color: gray;"
        buttonCalculate.disabled = true;
    }
}

function redirectToIndex() {
    window.location.href = '/';
}

function redirectToOperations() {
    window.location.href = 'operations.html';
}


