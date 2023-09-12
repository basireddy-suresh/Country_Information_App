const autoCompleteInput = document.querySelector('.autocompleteInput');
const submitBtn = document.querySelector('.submitBtn');
const countryInfoContainer = document.querySelector('.countryInfoContainer');

let countryNames = [];

getCountryData();

autoCompleteInput.addEventListener('input', onInputChange);
submitBtn.addEventListener('click', onSubmit);

async function getCountryData() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Unable to fetch country data');
        }
        const data = await response.json();
        countryNames = data.map((country) => country.name.common);
    } catch (error) {
        console.error(error);
    }
}

function onInputChange() {
    const value = autoCompleteInput.value.trim().toLowerCase();
    if (value.length === 0) {
        submitBtn.disabled = true;
        return;
    }
    submitBtn.disabled = false;
}

function onSubmit(e) {
    e.preventDefault();
    const countryName = autoCompleteInput.value.trim();
    if (countryName) {
        fetchCountryInfo(countryName);
    }
}


function fetchCountryInfo(countryName) {
    const countryInfoURL = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;
    fetch(countryInfoURL)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Country not found');
            }
            return response.json();
        })
        .then((data) => {
            displayCountryInfo(data[0]);
        })
        .catch((error) => {
            displayError(error);
        });
}

function displayCountryInfo(country) {
    const { flags, name, area, capital, continents, population, currencies, languages } = country;

    const currencyCode = Object.keys(currencies)[0];
    const currencyName = currencies[currencyCode].name;
    const currencySymbol = currencies[currencyCode].symbol;

    const languagesList = Object.values(languages).map((lang) => lang);

    const countryInfoHTML = `
        <img src="${flags.svg}" alt="${name.common}">
        <h2>${name.common}</h2>
        <p><strong>Country Name:</strong> ${name.common}</p>
        <p><strong>Total Area:</strong> ${area} km<sup>2</sup></p>
        <p><strong>Capital:</strong> ${capital[0]}</p>
        <p><strong>Continent:</strong> ${continents[0]}</p>
        <p><strong>Population:</strong> ${population}</p>
        <p><strong>Currency:</strong> ${currencyName} (${currencySymbol}) - ${currencyCode}</p>
        <p><strong>Languages:</strong> ${languagesList.join(', ')}</p>
    `;

    countryInfoContainer.innerHTML = countryInfoHTML;
}


function displayError(error) {
    countryInfoContainer.innerHTML = `<h3>Error: ${error.message}</h3>`;
}
