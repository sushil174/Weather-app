
import './style.css';
import { format,parseISO } from 'date-fns';

async function getData(search="mumbai",unit="us") {
    try{
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${search}?unitGroup=${unit}&key=ETAVPF9X344S8DHNWY4RFWJKC&contentType=json`
        const response = await fetch(url);

        if(response.status===400) {
            throw new Error(`${search} does not exist perhaps spelling mistake.`)
        }
        else if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const jsonData = await response.json();
        const data =  { 
                "address" : jsonData.resolvedAddress, 
                "days" : jsonData.days.slice(0,7)
        }
        const result = data.days.map( day => {
            return Object.keys(day).filter( key => key === "temp" || key === "datetime" || key === "icon").map( key => ({[key] : day[key]}));
        })

        return {
            "address" : data.address,
            "days" : result
        }
    }catch(err) {
        throw err
    }
}



const dom = (() => {

    const logo = document.querySelector('.logo');
    const date = document.querySelector('.date');
    const city = document.querySelector('.city');
    const cards = document.querySelector('.cards');
    const degreeSymbol = '\u00B0'
    function display(res,check) {
        logo.textContent = ''
        date.textContent = ''
        city.textContent = ''
        cards.textContent = ''
        if(check) {
            city.textContent = res.message;
            return;

        }
        const logoImg = document.createElement('img');
        const logoP = document.createElement('p');
        logoP.textContent = res.days[0][2].icon;
        logoImg.src = `svg/${res.days[0][2].icon}.svg`;
        logoImg.classList.add('filter-green')
        logo.append(logoImg)
        logo.append(logoP)
    
        const temp = document.createElement('h2');
        temp.textContent = res.days[0][1].temp + degreeSymbol;
        logo.append(temp)
    
        const day = new parseISO(res.days[0][0].datetime);
        date.textContent = format(day, 'EEEE, dd MMMM yyyy');
        city.textContent = res.address
        // date.textContent = res.days[0][0].datetime
    
        for(let i = 1; i < res.days.length; i++) {
            const img = document.createElement('img');
            img.src = `svg/${res.days[i][2].icon}.svg`;
            img.classList.add('filter-green')
            const temp = document.createElement('p');
            temp.classList.add('card-temp')
            temp.textContent = res.days[i][1].temp+degreeSymbol;
            const date = document.createElement('p');
            date.textContent = format(new parseISO(res.days[i][0].datetime), 'eee, d MMMM yyyy')
            // date.textContent = res.days[i][0].datetime;
    
            const card = document.createElement('div');
            card.classList.add('card');
            card.append(img);
            card.append(temp);
            card.append(date);
            
            cards.append(card);
        }    
    }

    const search = document.querySelector('#searchButton');
    const input = document.querySelector('#searchInput');
    const unit = document.querySelector('#change-unit') ;
    let cityName = ''
    search.addEventListener('click', () => {
        cityName = input.value;
        if(cityName) {
            getData(cityName,unit.value).then((response) => {
                display(response)
            })
            .catch(err => {
                dom.display(err, true)
            })
        }
    })

    unit.addEventListener('click', () => {
        if(unit.value === 'metric') {
            unit.value = 'us';
            unit.textContent = "Fahrenheit";
        }else {
            unit.value = 'metric';
            unit.textContent = "Celcius";
        }
        getData((cityName || 'mumbai'),unit.value).then((response) => {
            display(response)
        })
    })
    return {
        display
    }
})();

const unit = document.querySelector('#change-unit') ;
getData('mumbai',unit.value).then((response) => {
    dom.display(response,false)
})
.catch(err => {
    dom.display(err, true)
})