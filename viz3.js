// Data : [genre, name, year, dpt, count]

let all_data = [];
let data_per_year = Array.from({ length: 2021 }, () => []);
let colorPerName = {};


// Year Interval 
let minYear = 1900;
let maxYear = 2020;

let best_name_per_year = Array.from({ length: 2021 }, () => "");

function draw() {
    // Get the context of the canvas
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let interval = maxYear - minYear + 1;

    let bar_width = canvas.width / interval;

    let best_name_periods_masc = [];
    let best_name_periods_fem = [];

    for (let i = minYear; i <= maxYear; i++) {
        let j_masc = i;// end of the interval with the same name

        while (j_masc <= maxYear && best_name_per_year[j_masc][0] === best_name_per_year[i][0]) {
            j_masc++;
        }
        let best_name_masc = best_name_per_year[i][0];

        let color_masc = colorPerName[best_name_masc];

        ctx.fillStyle = color_masc;
        ctx.fillRect((i - minYear) * bar_width, 0, bar_width * (j_masc - i), 100);

        best_name_periods_masc.push([best_name_masc, i, j_masc]);

        i = j_masc - 1;
    }

    // Draw the name labels
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    for (let i = 0; i < best_name_periods_masc.length; i++) {
        let [name, i_start, i_end] = best_name_periods_masc[i];
        let x = (i_start + i_end) / 2;
        let y = 50;
        // Compute the width of the text
        let text_width = ctx.measureText(name).width;
        if (text_width > bar_width * (i_end - i_start)) {
            ctx.font = "10px Arial";
            text_width = ctx.measureText(name).width;
        } // If the text still doesn't fit
        if (text_width < bar_width * (i_end - i_start)) {
            ctx.fillStyle = "black";
            ctx.fillText(name, (x - minYear) * bar_width - text_width / 2, y);

        }
        ctx.font = "20px Arial";
    }

    for (let i = minYear; i <= maxYear; i++) {
        let j_fem = i;// end of the interval with the same name

        while (j_fem <= maxYear && best_name_per_year[j_fem][2] === best_name_per_year[i][2]) {
            j_fem++;
        }
        let best_name_fem = best_name_per_year[i][2];

        let color_fem = colorPerName[best_name_fem];

        ctx.fillStyle = color_fem;
        ctx.fillRect((i - minYear) * bar_width, 100, bar_width * (j_fem - i), 100);

        best_name_periods_fem.push([best_name_fem, i, j_fem]);

        i = j_fem - 1;
    }

    // Draw the name labels
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    for (let i = 0; i < best_name_periods_fem.length; i++) {
        let [name, i_start, i_end] = best_name_periods_fem[i];
        let x = (i_start + i_end) / 2;
        let y = 150;
        // Compute the width of the text
        let text_width = ctx.measureText(name).width;
        if (text_width > bar_width * (i_end - i_start)) {
            ctx.font = "10px Arial";
            text_width = ctx.measureText(name).width;
        } // If the text still doesn't fit
        if (text_width < bar_width * (i_end - i_start))
            ctx.fillText(name, (x - minYear) * bar_width - text_width / 2, y);
        ctx.font = "20px Arial";
    }

    // Draw strokes to indicate the years
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    for (let i = minYear; i <= maxYear; i++) {
        ctx.lineWidth = i % 10 === 0 ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo((i - minYear) * bar_width, i % 10 === 0 ? 180 : 190);
        ctx.lineTo((i - minYear) * bar_width, 200);
        if (i % 10 === 0) {
            ctx.fillText(i.toString(), (i - minYear) * bar_width, 190);
        }
        ctx.stroke();
    }


}

function start() {

    // Compute the best name per year
    for (let i = 1900; i <= 2020; i++) {
        let best_name_masc = "";
        let best_name_fem = "";
        let best_count_masc = 0;
        let best_count_fem = 0;
        let name_count_masc = {};
        let name_count_fem = {};

        data_per_year[i].forEach(element => {
            const name = element[1];
            const genre = element[0];
            const count = element[4];

            if (genre === 1) {
                if (!(name in name_count_masc)) {
                    name_count_masc[name] = 0;
                }
                name_count_masc[name] += count;
            } else {
                if (!(name in name_count_fem)) {
                    name_count_fem[name] = 0;
                }
                name_count_fem[name] += count;
            }
        });

        for (const [name, count] of Object.entries(name_count_masc)) {
            if (count > best_count_masc) {
                best_count_masc = count;
                best_name_masc = name;
            }
        }

        for (const [name, count] of Object.entries(name_count_fem)) {
            if (count > best_count_fem) {
                best_count_fem = count;
                best_name_fem = name;
            }
        }

        best_name_per_year[i] = [best_name_masc, best_count_masc, best_name_fem, best_count_fem];

        //console.log(`Year ${i} : Best masc name = ${best_name_masc} (${best_count_masc}), Best fem name = ${best_name_fem} (${best_count_fem})`);

    }

    draw();
}

document.addEventListener('DOMContentLoaded', function () {

    // Get the width of the window
    var window_width = window.innerWidth;

    // Set the canvas width to the window width minus the margins
    var canvas = document.getElementById("myCanvas");
    canvas.width = window_width - 20;
    canvas.height = 200;

    fetch('dpt2020.json')
        .then(response => response.json())
        .then(data => {
            // Raw data
            all_data = data;

            // Sorting data per year
            all_data.forEach(element => {
                const year = element[2];
                if (year >= 1900 && year <= 2020) {
                    data_per_year[year].push(element);
                }
            });
            console.log("Data sorted per year !");

            // Creating random colors for each name
            all_data.forEach(element => {
                const name = element[1];
                if (!(name in colorPerName)) {
                    colorPerName[name] = '#' + Math.floor(Math.random() * 16777215).toString(16);
                }
            })
            console.log("Colors created for names");

            // SLiders
            let minYearInput = document.getElementById('minYear');
            let maxYearInput = document.getElementById('maxYear');
            // Values displayed below sliders
            let minYearDisplay = document.getElementById('minYearValue');
            let maxYearDisplay = document.getElementById('maxYearValue');

            document.getElementById('minYear').addEventListener('input', () => {
                lastMinYear = minYear;
                minYear = parseInt(minYearInput.value);
                maxYear += minYear - lastMinYear;
                if (maxYear > 2020)
                    maxYear = 2020;

                if (minYear > maxYear)
                    maxYear = minYear;

                maxYearInput.value = maxYear.toString();
                maxYearDisplay.textContent = maxYear.toString();

                minYearDisplay.textContent = minYear.toString();
                draw();
            });

            document.getElementById('maxYear').addEventListener('input', () => {
                maxYear = parseInt(maxYearInput.value);
                if (minYear > maxYear) {
                    minYearInput.value = maxYear.toString();
                    minYear = maxYear;
                    minYearDisplay.textContent = minYear.toString();
                }
                maxYearDisplay.textContent = maxYear.toString();
                draw();
            });

            start();
        });
});