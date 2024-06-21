let all_data = [];
let data_per_year = Array.from({ length: 2021 }, () => []);
let colorPerName = {};

let svgContainer;
let paths;
let labels = Array(96);

let best_10names_per_year = Array.from({ length: 2021 }, () => [],[]); //indice annee,  [compte],[noms]
let mode = 0;
let searchedName = '';

document.getElementById("yearValue").innerHTML = document.getElementById("year").value;


document.addEventListener('DOMContentLoaded', function () {
    svgContainer = document.getElementById('race-container');


    // Creating the display of the svg bars

        // Loading of the data
        fetch('dpt2020.json')
            .then(response => response.json())
            .then(data => {
                console.log("I read the json");

                // Raw data
                all_data = data;

                // Sorting data per year
                all_data.forEach(element => {
                    const year = element[2];
                    if (year>=1900 && year<=2020){
                        data_per_year[year].push(element);
                    }
                });
                console.log("Data sorted per year !");

                //creating top 10 name list
                groupByName();
                console.log("grouped by best names");

                // Creating random colors for each name
                all_data.forEach(element => {
                    const name = element[1];
                    if (!(name in colorPerName)){
                        colorPerName[name] = '#' + Math.floor(Math.random()*16777215).toString(16);
                    }
                })
                console.log("Colors created for names");

                //document.getElementById('title').textContent = "Explore the names in France"; 
            })

        // Slider management

        // SLiders
        let yearInput = document.getElementById('year');
        
        // Values displayed below sliders
        let yearDisplay = document.getElementById('yearValue');
        // Year Interval 
        let year = 1900;
      

        //document.getElementById('year').addEventListener('input', () => {
        //    year = parseInt(yearInput.value);
        //    yearDisplay.textContent = year.toString();
            
        //});

        
    })

    slider = document.getElementById("year")
        slider.addEventListener("change", event => {
            document.getElementById("yearValue").innerHTML = slider.value;
      });
    

let timer = null;

function startPlaying(){
    console.log("started playing !");

    timer = setInterval(play, 1000);
    
}

function play(){

    document.getElementById("year").value = parseInt(document.getElementById("year").value) + 1;
    document.getElementById("yearValue").innerHTML = document.getElementById("year").value;
    
    if(parseInt(document.getElementById("year").value)>=2020){
        clearInterval(timer);
    }
    
}