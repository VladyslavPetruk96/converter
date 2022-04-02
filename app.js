const store = function() {
    let currencyData = [];
    return {
        setData: newData => currencyData = newData,
        getData: () => currencyData
    }
}();

document.addEventListener("DOMContentLoaded", getDate);
function getDate() {
    let selectedDate = localStorage.getItem('selectedDate');
    if (!selectedDate) {
        document.getElementById('date').valueAsNumber = new Date();
        // console.log(document.getElementById('date').valueAsNumber);
        selectedDate = document.getElementById('date').value.replace(/-/g, "");
    }
    console.log(selectedDate);
    let year = selectedDate.slice(0, 4);
    let month = selectedDate.slice(4, 6);
    let day = selectedDate.slice(6);
    // console.log(year, month, day);
    document.getElementById('date').value = year + '-' + month + '-' + day;
    fetchCurrencyExchange(selectedDate);
}

document.getElementById('date').addEventListener('input', e => {
    let selectedInputDate = e.currentTarget.value.replace(/-/g, "");
    // console.log(selectedInputDate);
    localStorage.setItem('selectedDate', selectedInputDate);
    fetchCurrencyExchange(selectedInputDate);
})

function renderCurrencyData(currencyData) {
    let tableText = '';
    let selectText = '';
    for(let elements of currencyData) {
        tableText += `<tr>
                <td>${elements.abbreviation}</td>
                <td>${elements.txt}</td>
                <td>${elements.rate}</td>
                <td>${elements.exchangedate}</td>
            </tr>`
    }
    for(let nameOfCurrency of currencyData) {
        selectText += `<option>${nameOfCurrency.txt}</option>`
    }
    document.querySelector('.table tbody').innerHTML = tableText;
    document.querySelector('form select').innerHTML = selectText;
}

function setConversion(mappedCurrencyData) {
    document.getElementById('button').addEventListener('click', () => {
        let number = document.getElementById('number').value;
        let select = document.getElementById('select').value;
        let filteredObjectOfConverter = mappedCurrencyData.filter(currency => {
            return currency.txt == select;
        });
        console.log(filteredObjectOfConverter[0].rate);
        let result = (filteredObjectOfConverter[0].rate*number).toFixed(4);
        document.querySelector('p').innerHTML = result;
        document.querySelector('p').style.color = "black";
        if (number < 1) {
            number = 1 ;
            document.getElementById('number').value = number;
            document.querySelector('p').innerHTML = "error";
            document.querySelector('p').style.color = "red";
        };
    })
}

function fetchCurrencyExchange(selectedDate) {
    fetch(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${selectedDate}&json`)
    .then(res => res.json())
    .then(data => {
        let mappedCurrencyData = data.map(currency => ({
            abbreviation: currency.cc,
            txt: currency.txt,
            rate: currency.rate,
            exchangedate: currency.exchangedate,
        }));
        store.setData(mappedCurrencyData);
        renderCurrencyData(mappedCurrencyData);
        setConversion(mappedCurrencyData);
    });
}
