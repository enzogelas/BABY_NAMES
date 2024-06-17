document.addEventListener('DOMContentLoaded', function () {
    //const france = document.getElementById('france').contentDocument;
    const paths = document.querySelectorAll('.region'); // Select all paths with class 'region'

    paths.forEach(function (path) {
        path.addEventListener('mouseover', function () {
            path.style.fill = '#000000'; // Change fill color on mouseover
        });

        path.addEventListener('mouseout', function () {
            path.style.fill = ''; // Reset fill color on mouseout
        });
    });

    console.log("Completed !!");
});


console.log("Completed !!");