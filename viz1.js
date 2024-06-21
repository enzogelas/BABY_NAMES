let all_data = [];
let data_per_year = Array.from({ length: 2021 }, () => []);
let colorPerName = {};

let svgContainer;
let paths;
let labels = Array(96);


let mode = 0;
let searchedName = '';

document.addEventListener('DOMContentLoaded', function () {
    svgContainer = document.getElementById('race-container');


    // Creating the display of the svg bars
    console.log("test")

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
    