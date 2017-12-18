var WIDTH = 1000;
var HEIGHT = 500;
var resolution = 10;
var underpopulation = 2;
var overpopulation = 3;
var revive = 3;
var xitems;
var yitems;
var grid;


function setup() {
    // Canvas setup
    var canvas = createCanvas(WIDTH, HEIGHT);
    canvas.parent('canvas');

    // Grid setup
    xitems = floor(WIDTH/resolution);
    yitems = floor(HEIGHT/resolution);
    grid = createGrid(xitems, yitems);

    // Interface setup - Buttons
    var random = document.getElementById('random');
    random.addEventListener('click', randomGrid);
    var play = document.getElementById('play');
    play.addEventListener('click', loop);
    var pause = document.getElementById('pause');
    pause.addEventListener('click', noLoop);
    var clean = document.getElementById('clean');
    clean.addEventListener('click', cleanGrid);
    var configure = document.getElementById('configure');
    configure.addEventListener('click', function () {
        resolution = document.getElementById('resolution').value;
        xitems = floor(WIDTH/resolution);
        yitems = floor(HEIGHT/resolution);
        grid = createGrid(xitems, yitems);
        drawGrid();
    });

    // Interface setup - Sliders
    var overSlider = document.getElementById('overSlider');
    var overValue = document.getElementById('overValue');
    overSlider.value = overpopulation;
    overValue.value = overpopulation;
    bindSliderAndInput(overSlider, overValue, 'over');
    var subSlider = document.getElementById('subSlider');
    var subValue = document.getElementById('subValue');
    subSlider.value = underpopulation;
    subValue.value = underpopulation;
    bindSliderAndInput(subSlider, subValue, 'under');
    var birthSlider = document.getElementById('birthSlider');
    var birthValue = document.getElementById('birthValue');
    birthSlider.value = revive;
    birthValue.value = revive;
    bindSliderAndInput(birthSlider, birthValue, 'birth');


    setTimeout(mouseCheck, 1);
    frameRate(1);
    noLoop();
}

function draw() {
    drawGrid();
    grid = computeNextGrid(grid);
}

function createGrid(cols, rows) {
    var grid = new Array(cols);
    for (var i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
        for (var j = 0; j < grid[i].length; j++) {
            grid[i][j] = 0;
        }
    }
    return grid;
}

function randomGrid() {
    for (var i = 0; i < xitems; i++) {
        for (var j = 0; j < yitems; j++) {
            grid[i][j] = floor(random()*2);
        }
    }
    drawGrid()
}

function cleanGrid() {
    for (var i = 0; i < grid.length; i++) {
        for(var j = 0; j < grid[i].length; j++) {
            grid[i][j] = 0;
        }
    }
    drawGrid();
}

function drawGrid() {
    clear();
    for (var i = 0; i < xitems; i++) {
        for(var j = 0; j < yitems; j++) {
            if(grid[i][j] == 0) {
                fill(255);
            } else {
                fill(0);
            }
            if (i == xitems - 1)
                rect(i*resolution, j*resolution, resolution-1, resolution);
            else if (j == yitems - 1)
                rect(i*resolution, j*resolution, resolution, resolution-1);
            else
                rect(i*resolution, j*resolution, resolution, resolution);
        }
    }
}

function computeNextGrid(grid) {
    var nextGrid = new Array(grid.length);
    for (var i = 0; i < grid.length; i++) {
        nextGrid[i] = new Array(grid[i].length);
        for (var j = 0; j < grid[i].length; j++) {
            nextGrid[i][j] = computeState(grid, i, j);
        }
    }
    return nextGrid;
}

function computeState(grid, i, j) {
    k = i + xitems - 1;
    l = j + yitems;
    var neighbors = 0;

    neighbors += grid[k%xitems][(l-1)%yitems];
    neighbors += grid[k%xitems][(l)%yitems];
    neighbors += grid[k%xitems][(l+1)%yitems];
    k++;
    neighbors += grid[k%xitems][(l-1)%yitems];
    neighbors += grid[k%xitems][(l+1)%yitems];
    k++;
    neighbors += grid[k%xitems][(l-1)%yitems];
    neighbors += grid[k%xitems][(l)%yitems];
    neighbors += grid[k%xitems][(l+1)%yitems];

    if(grid[i][j] == 1) {
        if (neighbors < underpopulation || neighbors > overpopulation) {
            return 0;
        } else {
            return 1;
        }
    } else {
        if(neighbors == revive) {
            return 1;
        } else {
            return 0;
        }
    }
}

function mouseCheck() {
    if(mouseIsPressed) {
        var i = floor(mouseX/resolution);
        var j = floor(mouseY/resolution);
        if (i > 0 && j > 0 && i < xitems && j < yitems) {
            grid[i][j] = 1;
            if(grid[i][j] == 0) {
                fill(255);
            } else {
                fill(0);
            }
            rect(i*resolution, j*resolution, resolution, resolution);
        }
    }
    setTimeout(mouseCheck, 1);
}

function bindSliderAndInput(slider, input, parameter) {
    slider.addEventListener('change', function (){
        input.value = slider.value;
        switch (parameter) {
            case 'over':
                overpopulation = slider.value;
                break;
            case 'under':
                underpopulation = slider.value;
                break;
            case 'birth':
                revive = slider.value;
                break;
        }
    });
    input.addEventListener('change', function (){
        if (input.value < 0) {
            input.value = 0;
        } else if (input.value > 8) {
            input.value = 8;
        }
        slider.value = input.value;
    });
}
