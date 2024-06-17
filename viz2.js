let all_data = [];
let data_per_year = Array.from({ length: 2021 }, () => []);
let colorPerName = {};

let svgContainer;
let paths;
let labels = Array(96);

document.addEventListener('DOMContentLoaded', function () {
    svgContainer = document.getElementById('france-container');

    fetch('france.svg') // Replace with the actual path to your SVG file
        .then(response => response.text())
        .then(svgContent => {
            svgContainer.innerHTML = svgContent; // Inject the SVG into the container

            // Now select all paths with class 'region'
            paths = svgContainer.querySelectorAll('.region');

            paths.forEach(function (path) {
                path.addEventListener('mouseover', function () {
                    path.style.fillOpacity = '0.2';
                });

                path.addEventListener('mouseout', function () {
                    path.style.fillOpacity = '1';
                });

                labels[parseInt(path.id)] = createLabel(path,"Hello !");
            });

            console.log("Completed !!");
            //console.log(labels);
        })
        .catch(error => console.error('Error loading the SVG:', error));

        
        /*d3.csv('dpt2020.csv').then(function(data) {

            data.forEach(function (element) {
                let values = Object.values(element);
                all_data.push([parseInt(values[0]), values[1], parseInt(values[2]), parseInt(values[3]), parseInt(values[4])]);
            });

            console.log("Array constructed !!!"); 
            document.getElementById('title').textContent = "Now enjoy !!"; 

        }).catch(function(error) {
            console.error('Error loading CSV:', error);
        });*/

        fetch('dpt2020_1.json')
            .then(response => response.json())
            .then(data => {
                console.log("I read the json");
                all_data = data;

                console.log("Array constructed !!!"); 
                document.getElementById('title').textContent = "Now enjoy !!"; 

                
                all_data.forEach(element => {
                    const year = element[2];
                    if (year>=1900 && year<=2020){
                        data_per_year[year].push(element);
                    }
                });
                console.log("Data sorted per year !");

                all_data.forEach(element => {
                    const name = element[1];
                    if (!(name in colorPerName)){
                        colorPerName[name] = '#' + Math.floor(Math.random()*16777215).toString(16);
                    }
                })
                console.log("Colors created for names");
            })            

});

function createLabel(path,labelText){

    const bbox = path.getBBox();
    let centerX = bbox.x + bbox.width / 2;
    let centerY = bbox.y + bbox.height / 2;
    
    // Creating the text element
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", centerX);
    text.setAttribute("y", centerY);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("alignment-baseline", "central");
    text.style.fontSize = "12px";
    text.style.fill = "black"; // Set the text color
    text.textContent = labelText; // Replace with your actual label

    // Append the text element to the SVG container
    svgContainer.querySelector("svg").appendChild(text);

    return text;
}

// It show the most popular name for a fixed year
function showDataOneYear(year){ 

    let maxPerDpt = Array(96).fill(0);
    let namePerDpt = Array(96).fill("");

    data_per_year[year].forEach(element => {
        const dpt = element[3];

        if(element[4] > maxPerDpt[dpt]){
            namePerDpt[dpt] = element[1];
            maxPerDpt[dpt] = element[4]
        }

    });

    // Get the bounding box of the path
    paths.forEach(path => {
        const dpt = parseInt(path.id);

        path.style.fill = colorPerName[namePerDpt[dpt]];
        labels[dpt].textContent = namePerDpt[dpt];
    })
}

// It show the most popular name for an interval of years
function showDataManyYears(min, max){
    console.log(min,max);

    // To count the occurence of each name in each dpt
    let allNamesPerDpt = Array.from({ length: 96 }, () => ({})); 

    // To record the most popular name in each dpt
    let popularNamePerDpt = Array(96).fill('');

    // Computing the occurence of each name per dpt between min and max year
    for(let year=min; year<=max; year++){

        data_per_year[year].forEach(element => {
            const dpt = element[3];
            const name = element[1];

            if(dpt<=95){ //To exclude non wanted dpt
                if(!(name in allNamesPerDpt[dpt])){
                    allNamesPerDpt[dpt][name] = element[4];
                } else {
                    allNamesPerDpt[dpt][name] = allNamesPerDpt[dpt][name] + element[4];
                }
            }

        });
    }

    // Finding the most popular name per dpt between min and max year
    for (let dpt=1; dpt<95; dpt++){
        let popularName = '';
        let maxPopularity = 0;
        const obj = allNamesPerDpt[dpt];
        for(const key in obj){
            const value = obj[key];
            if(value > maxPopularity){
                maxPopularity = value;
                popularName = key;
            }
        }
        popularNamePerDpt[dpt] = popularName;
    }

    // Modifying the view
    paths.forEach(path => {
        const dpt = parseInt(path.id);

        path.style.fill = colorPerName[popularNamePerDpt[dpt]];
        labels[dpt].textContent = popularNamePerDpt[dpt];
    })
}


let minYearInput = document.getElementById('minYear');
let maxYearInput = document.getElementById('maxYear');
let minYearDisplay = document.getElementById('minYearValue');
let maxYearDisplay = document.getElementById('maxYearValue');
let minYear = 1900;
let maxYear = 2020;

document.getElementById('minYear').addEventListener('input', () => {
    minYear = parseInt(minYearInput.value);
    if (minYear>maxYear){
        maxYearInput.value = minYear.toString();
        maxYear=minYear;
        maxYearDisplay.textContent = maxYear.toString();
    }
    minYearDisplay.textContent = minYear.toString();
    showDataManyYears(minYear,maxYear);
})

document.getElementById('maxYear').addEventListener('input', () => {
    maxYear = parseInt(maxYearInput.value);
    if (minYear>maxYear){
        minYearInput.value = maxYear.toString();
        minYear=maxYear;
        minYearDisplay.textContent = minYear.toString();
    }
    maxYearDisplay.textContent = maxYear.toString();
    showDataManyYears(minYear,maxYear);
})