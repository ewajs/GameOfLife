var SIZE = 600;
var resolution = 10;
var underpopulation = 2;
var overpopulation = 3;
var revive = 3;
var xitems;
var yitems;
var grid;

var overSlider, overValue, subSlider, subValue, birthSlider, birthValue, clockSlider, clockValue;


function setup() {
    // Canvas setup
    var canvas = createCanvas(SIZE + 1, SIZE + 1);
    canvas.parent('canvas');

    // Grid setup
    xitems = floor(SIZE/resolution);
    yitems = floor(SIZE/resolution);
    grid = createGrid(xitems, yitems);

    // Interface setup - Sliders
    overSlider = document.getElementById('overSlider');
    overValue = document.getElementById('overValue');
    overSlider.value = overpopulation;
    overSlider.addEventListener('change', overpopulationListener);
    overValue.value = overpopulation;
    overValue.addEventListener('change', overpopulationListener);

    bindSliderAndInput(overSlider, overValue, 0, 8);
    subSlider = document.getElementById('subSlider');
    subValue = document.getElementById('subValue');
    subSlider.value = underpopulation;
    subSlider.addEventListener('change', underpopulationListener);
    subValue.value = underpopulation;
    subValue.addEventListener('change', underpopulationListener);
    bindSliderAndInput(subSlider, subValue, 0, 8);
    birthSlider = document.getElementById('birthSlider');
    birthValue = document.getElementById('birthValue');
    birthSlider.value = revive;
    birthSlider.addEventListener('change', birthListener);
    birthValue.value = revive;
    birthValue.addEventListener('change', birthListener);
    bindSliderAndInput(birthSlider, birthValue, 0, 8);
    clockSlider = document.getElementById('clockSlider');
    clockValue = document.getElementById('clockValue');
    clockSlider.value = 1;
    clockSlider.addEventListener('change', clockListener);
    clockValue.value = 1;
    clockValue.addEventListener('change', clockListener);
    bindSliderAndInput(clockSlider, clockValue, 1, 30);


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
        xitems = floor(SIZE/resolution);
        yitems = floor(SIZE/resolution);
        grid = createGrid(xitems, yitems);
        drawGrid();
        noLoop();
    });
    var restore = document.getElementById('restore');
    restore.addEventListener('click', function () {
        resolution = 10;
        underpopulation = 2;
        overpopulation = 3;
        revive = 3;
        overSlider.value = overpopulation;
        overValue.value = overpopulation;
        subSlider.value = underpopulation;
        subValue.value = underpopulation;
        birthSlider.value = revive;
        birthValue.value = revive;
        clockValue.value = 1;
        clockSlider.value = 1;
        xitems = floor(SIZE/resolution);
        yitems = floor(SIZE/resolution);
        grid = createGrid(xitems, yitems);
        drawGrid();
        noLoop();
    });



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
            // if (i == xitems - 1)
            //     rect(i*resolution, j*resolution, resolution-1, resolution);
            // else if (j == yitems - 1)
            //     rect(i*resolution, j*resolution, resolution, resolution-1);
            // else
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

function bindSliderAndInput(slider, input, min, max) {
    slider.addEventListener('change', function (){
        input.value = slider.value;
    });
    input.addEventListener('change', function (){
        if (input.value < min) {
            input.value = min;
        } else if (input.value > max) {
            input.value = max;
        }
        slider.value = input.value;
    });
}

function overpopulationListener () {
    overpopulation = this.value;
}

function underpopulationListener() {
    underpopulation = this.value;
}

function birthListener() {
    revive = this.value;
}

function clockListener() {
    frameRate(parseInt(this.value));
    //console.log(this.value);
}
