
var SIZE = 600;

Life.prototype.createGrid = function (cols, rows) {
    var newGrid = new Array(cols);
    for (var i = 0; i < cols; i++) {
        newGrid[i] = new Array(rows);
        for (var j = 0; j < newGrid[i].length; j++) {
            newGrid[i][j] = 0;
        }
    }
    return newGrid;
}

Life.prototype.createTable = function (cols, rows) {
    var table = document.createElement('table');
    table.classList.add('table-board');
    table.style.width = this.size + "px";
    for(var i = 0; i < rows; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < cols; j++) {
            var td = document.createElement('td');
            td.style.width = (this.size/cols) + "px";
            td.style.height = (this.size/cols) + "px";
            //td.innerText = i * rows + j;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    return table;
}

Life.prototype.appendTableTo = function (parent) {
    document.getElementById(parent).appendChild(this.table);
}

Life.prototype.setCell = function (i, j) {
    this.grid[i][j] = 1;
    var rows = this.table.childNodes;
    var cell = rows[i].childNodes;
    cell = cell[j];
    cell.style.background = this.liveColor;
}

function Life(cols, rows, size) {
    this.rows = rows;
    this.cols = cols;
    this.size = size;
    this.grid = this.createGrid(cols, rows);
    this.table = this.createTable(cols, rows);
    this.liveColor = "#000000";

}


var life = new Life(50, 50, 600);
life.appendTableTo("board");

function randomGrid() {
    for (var i = 0; i < xitems; i++) {
        for (var j = 0; j < yitems; j++) {
            grid[i][j] = floor(random()*2);
        }
    }
    drawGrid();
}

function cleanGrid() {
    for (var i = 0; i < grid.length; i++) {
        for(var j = 0; j < grid[i].length; j++) {
            grid[i][j] = 0;
        }
    }
    drawGrid();
}

function computeNextGrid() {
    var nextGrid = new Array(grid.length);
    for (var i = 0; i < grid.length; i++) {
        nextGrid[i] = new Array(grid[i].length);
        for (var j = 0; j < grid[i].length; j++) {
            nextGrid[i][j] = computeState(i, j);
        }
    }
    return nextGrid;
}

function resizeGrid(cols, rows) {
    var nextGrid = new Array(cols);
    var imax = grid.length;
    var jmax = grid[0].length;
    for (var i = 0; i < cols; i++) {
        nextGrid[i] = new Array(rows);
        for (var j = 0; j < rows; j++) {
            if (i < imax && j < jmax) {
                nextGrid[i][j] = grid[i][j];
            } else {
                nextGrid[i][j] = 0;
            }
        }
    }
    return nextGrid;

}

function computeState(i, j) {
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

/*


function mouseCheck() {
    if(mouseIsPressed) {
        var i = floor(mouseX/resolution);
        var j = floor(mouseY/resolution);
        if (i > 0 && j > 0 && i < xitems && j < yitems) {
            grid[i][j] = 1;
            if(borderControl.checked) {
                stroke("#"+ borderColor);
            } else {
                noStroke();
            }
            fill("#"+liveColor);
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

function createTable(cols, rows) {
    var table = document.createElement('table');
    table.classList.add('table-board');
    for(var i = 0; i < rows; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < cols; j++) {
            var td = document.createElement('td');
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    return table;
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


function setup() {
    // Canvas setup
    var canvas = createTable(50, 50);
    document.getElementById('canvas').appendChild(canvas);
    noLoop();
    return;
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
    var restore = document.getElementById('restore');
    restore.addEventListener('click', function () {
        resolution = 10;
        underpopulation = 2;
        overpopulation = 3;
        revive = 3;
        SIZE = 800;
        overSlider.value = overpopulation;
        overValue.value = overpopulation;
        subSlider.value = underpopulation;
        subValue.value = underpopulation;
        birthSlider.value = revive;
        birthValue.value = revive;
        clockValue.value = 1;
        clockSlider.value = 1;
        resizeCanvas(SIZE + 1, SIZE + 1);
        xitems = floor(SIZE/resolution);
        yitems = floor(SIZE/resolution);
        grid = createGrid(xitems, yitems);
        drawGrid();
        noLoop();
    });

    // Interface setup - Size and Resolution
    var resolutionControl = document.getElementById('resolution');
    resolutionControl.addEventListener('blur', function() {
        resolution = parseInt(document.getElementById('resolution').value);
        xitems = floor(SIZE/resolution);
        yitems = floor(SIZE/resolution);
        grid = resizeGrid(xitems, yitems);
        drawGrid();
    });

    var sizeControl = document.getElementById('size');
    sizeControl.addEventListener('blur', function() {
        SIZE = parseInt(document.getElementById('size').value);
        xitems = floor(SIZE/resolution);
        yitems = floor(SIZE/resolution);
        grid = resizeGrid(xitems, yitems);
        resizeCanvas(SIZE + 1, SIZE + 1, true);
        drawGrid();
    });



    // Interface Setup - Color Controls
    borderControl = document.getElementById('border');
    borderControl.addEventListener('change', function () {
        drawGrid();
    })
    liveColor = "000000" // Initialize
    var liveColorControl = document.getElementById('liveColor');
    liveColorControl.addEventListener('change', function(){
      liveColor = this.value;
      drawGrid();
    });

    deadColor = "FFFFFF" // Initialize
    var deadColorControl = document.getElementById('deadColor');
    deadColorControl.addEventListener('change', function(){
      deadColor = this.value;
      drawGrid();
    });

    borderColor = "000000" // Initialize
    var borderColorControl = document.getElementById('borderColor');
    borderColorControl.addEventListener('change', function(){
      borderColor = this.value;
      drawGrid();
    });



    setTimeout(mouseCheck, 1);
    frameRate(1);
    noLoop();
}
*/
