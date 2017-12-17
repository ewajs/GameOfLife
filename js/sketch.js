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
  createCanvas(WIDTH, HEIGHT);
  xitems = floor(WIDTH/resolution);
  yitems = floor(HEIGHT/resolution);
  grid = createGrid(xitems, yitems);
  console.log(grid);
  fillRandomly(grid);
  setTimeout(mouseCheck, 1);
  frameRate(1);

}

function draw() {
  drawGrid(grid);
  grid = computeNextGrid(grid);

}

function createGrid(cols, rows) {
  var grid = new Array(cols);
  for (var i = 0; i < cols; i++)
    grid[i] = new Array(rows);

  return grid;
}

function fillRandomly(grid) {
  for (var i = 0; i < xitems; i++) {
    for (var j = 0; j < yitems; j++) {
      grid[i][j] = floor(random()*2);
    }
  }
}

function drawGrid(grid) {
  for (var i = 0; i < xitems; i++) {
    for(var j = 0; j < yitems; j++) {
      if(grid[i][j] == 0) {
        fill(255);
      } else {
        fill(0);
      }
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
  neighbors += grid[(k+1)%xitems][(l-1)%yitems];
  neighbors += grid[(k+1)%xitems][(l)%yitems];
  neighbors += grid[(k+1)%xitems][(l+1)%yitems];

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
    grid[i][j] = 1;
    if(grid[i][j] == 0) {
      fill(255);
    } else {
      fill(0);
    }
    rect(i*resolution, j*resolution, resolution, resolution);
  }
  setTimeout(mouseCheck, 1);
}
