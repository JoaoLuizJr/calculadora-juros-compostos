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

document.addEventListener('DOMContentLoaded', ()=> {
    const selectTemp = document.getElementById('selectTemp');
    const optionMonthly = document.querySelector('#period option[value="months"]');
    const optionYears = document.querySelector('#period option[value="years"]');   
    
    if (selectTemp.value === 'yearly') {
        optionMonthly.style.display = 'none';
    }
    
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
});

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
        redirectToLogin();
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

function redirectToLogin() {
    window.location.href = '/';
}


