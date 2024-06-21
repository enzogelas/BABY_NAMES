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

                document.getElementById('title').textContent = "France Name Race"; 
            })

          // SLiders
          
          let yearInput = document.getElementById('year');
          // Values displayed below sliders
      
          let yearDisplay = document.getElementById('yearValue');
          // Year Interval 
          let year = 1900;
  
          document.getElementById('year').addEventListener('input', () => {
              year = parseInt(yearInput.value);
    

            yearDisplay.textContent = year.toString();

              minYearDisplay.textContent = minYear.toString();

          });
  

    })

    // Function to add a label in the center of a svg path (Only used at loading page at the beginning)
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

// It show the most popular name for a fixed year (not used anymore but interesting)
function showDataOneYear(year){ 

    let maxPerDpt = Array(96).fill(0);
    let namePerDpt = Array(96).fill("");

    let max10ppl = Array(10).fill("");
    let max10 = Array(10).fill(0);

    data_per_year[year].forEach(element => {
        const dpt = element[3];

        if(element[4] > maxPerDpt[dpt]){
            namePerDpt[dpt] = element[1];
            maxPerDpt[dpt] = element[4]
        }

    })
}

function groupByName(){

    // Compute the best name per year
    for (let i = 1900; i <= 2020; i++) {
        let best10 = Array(10).fill(0);
        let best10names= Array(10).fill("");

        let name_count= {};

        data_per_year[i].forEach(element => {
            const name = element[1];
            const count = element[4];

            if (!(name in name_count_masc)) {
               name_count_masc[name] = 0;
            }
            name_count[name] += count;


        });

        for (const [name, count] of Object.entries(name_count_masc)) {
            for(let i = 0; i<10; i++){
            if (count > best10[i]) {
                    shift_down(i,best10,best10names)
                    best10[i]=count;
                    best10names[i] = name;
            }
        }

   
        }
        best_10names_per_year[i] = [best10,best10names];
        }

    }
function shift_down(i, tableint, tablestring){
    if (i==9){
        return;
    }
    else{
        shift_down(i+1,tablestring,tablestring);
        tableint[i+1]=tableint[i];
        tablestring[i+1]=tableint[i];

    }
}
