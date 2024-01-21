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

const email = localStorage.getItem('email');

buttonAccount.addEventListener('click', async ()=>{
    if (registrationData.style.display === 'none') {
        registrationData.style.display = 'block';
    }else{
        registrationData.style.display = 'none';
    }

    dataLogin = {
        email: email 
    }

    try {
        const response = await fetch('http://localhost:3001/user/accountData', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataLogin)
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
    const oldName = fieldName.innerHTML;
    const newName = inputName.value;

    dataName = {
        name: newName,
        oldName: oldName
    }

    try {
        const response = await fetch('http://localhost:3001/user/name',{
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
    const oldCell = fieldCell.innerHTML;
    const newCell = inputCell.value;

    dataCell = {
        cell: newCell,
        oldCell: oldCell
    }

    try {
        const response = await fetch('http://localhost:3001/user/cell',{
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

startLogoutTimer();

buttonCalculate.disabled = true;
buttonCalculate.style = "background-color: gray;";

fees.addEventListener('input', validateFields);
temp.addEventListener('input', validateFields);
initial.addEventListener('input', validateFields);
monthly.addEventListener('input', validateFields);

buttonCalculate.addEventListener('click', ()=>{
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

    if (isNaN(valueInitial)){
        valueInitial = 0;
    }

    if (isNaN(valueMonthly)) {
        valueMonthly = 0;
    }

    if (localStorage.getItem('isLoggedIn') === 'false') {
        redirectToIndex();
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


