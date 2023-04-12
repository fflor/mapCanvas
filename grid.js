// create options object
const options = {
  maxCellSize: 40,
  columns: 33,
  rows: 30,
  backgroundColor: "rgb(74, 104, 90)",
  gridColor: "#000000",
  gridLineWidth: 2,
  borderColor: "#fff",
  maxWidth: 1200,
  maxHeight: 1000,
  padding: 20,
  textColor: "#000000",
  topColor: "#ffffff",
  bottomColor: "#ffffff",
  leftColor: "#ffffff",
  rightColor: "#ffffff",
  circleColor: "red",
  scale: 5,
};
//set cellSize
function setCellSize() {
  //get max width as width/columns
  let maxCellWidth = (options.maxWidth - options.padding * 2) / options.columns;
  //get max height as height/rows
  let maxCellHeight = (options.maxHeight - options.padding * 2) / options.rows;
  //get the smaller of the two
  let theoreticalMaxSize = Math.min(maxCellWidth, maxCellHeight);

  return Math.min(theoreticalMaxSize, options.maxCellSize);
}

let cellSize = setCellSize();
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let locations = [];
let gridHeight = cellSize * options.rows;
let gridWidth = cellSize * options.columns;
canvas.width = Math.min(gridWidth + options.padding * 2, options.maxWidth);
canvas.height = Math.min(gridHeight + options.padding * 2, options.maxHeight);
/**
 * Draw the border
 */
function drawBorder() {
  // undo options.padding and any pan before drawing the border
  //ctx.translate(-options.padding, -options.padding);

  ctx.save();
  //setLayer(0);
  const fillEdge = (start, end, color) => {
    ctx.beginPath();
    ctx.lineCap = "square";
    ctx.lineWidth = options.padding;
    ctx.strokeStyle = color;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.restore();
  };
  // Left Edge
  fillEdge(
    { x: options.padding * 0.5, y: 0 },
    { x: options.padding * 0.5, y: canvas.height },
    options.leftColor
  );
  // Bottom Edge
  fillEdge(
    { x: options.padding * 0.5, y: canvas.height - options.padding * 0.5 },
    {
      x: canvas.width + options.padding * 0.5,
      y: canvas.height - options.padding * 0.5,
    },
    options.bottomColor
  );
  // Right Edge
  fillEdge(
    { x: canvas.width - options.padding * 0.5, y: 0 },
    {
      x: canvas.width - options.padding * 0.5,
      y: canvas.height + options.padding,
    },
    options.rightColor
  );
  // Top Edge
  fillEdge(
    { x: options.padding * 0.5, y: options.padding * 0.5 },
    { x: canvas.width, y: options.padding * 0.5 },
    options.topColor
  );
  // outer grid lines
}
/**
 * create an array of column labels
 * @returns {Array}
 */
function getColumnLabels() {
  //create a 2d array of cell names
  let columnLabels = [];
  //for each column
  for (let i = 0; i < options.columns; i++) {
    //create an alphabetic label for the column
    let colLabel = String.fromCharCode(65 + (i % 26));
    if (i > 25) {
      colLabel = String.fromCharCode(64 + Math.floor(i / 26)) + colLabel;
    }
    columnLabels.push(colLabel);
  }
  return columnLabels;
}

/**
 * return the cell name for a given x,y position
 * @param x
 * @param y
 * @returns {string}
 */
//const col = Math.floor((x - options.padding) / cellSize);
function getCellName(x,y) {
 
  //get the column labels
  let columnLabels = getColumnLabels();
  //get the column label at the x position
  let colLabel = columnLabels[x - 1];
  //get the row label at the y position
  let rowLabel = y;
  //row label should be between 1 and options.rows
  if (rowLabel < 1 || rowLabel > options.rows) {
    rowLabel = undefined;
  }
  //handle the case where the mouse is outside the grid
  if (colLabel === undefined || rowLabel === undefined) {
    return "";
  }
  //return the cell name
  return colLabel + rowLabel;
}

/**
 * label the axes
 */
function labelAxes() {
  ctx.save();
  //setLayer(0);
  ctx.fillStyle = options.textColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${options.padding * 0.35}px Arial`;
  //get the column labels
  let columnLabels = getColumnLabels();
  //for each column
  for (let i = cellSize / 2; i < gridWidth; i += cellSize) {
    //get the column label
    let colLabel = columnLabels[Math.floor(i / cellSize)];
    //draw the column label
    ctx.fillText(colLabel, i + options.padding, options.padding / 2);
  }
  //for each row
  for (let i = cellSize / 2; i < gridHeight; i += cellSize) {
    //get the row label
    let rowLabel = Math.floor(i / cellSize) + 1;
    //draw the row label
    ctx.fillText(rowLabel, options.padding / 2, i + options.padding);
  }
}
/**
 * draw grid lines
 */
function drawGridLines() {
  ctx.save();
  //setLayer(1);
  ctx.beginPath();
  ctx.lineWidth = options.gridLineWidth;
  ctx.strokeStyle = options.gridColor;
  // draw vertical lines
  // from cellSize to gridWidth increment by cell
  for (let i = 0; i <= gridWidth + options.padding; i += cellSize) {
    ctx.moveTo(0.5 + i + options.padding, options.padding);
    ctx.lineTo(0.5 + i + options.padding, gridHeight + options.padding);
  }
  // draw horizontal lines
  for (let i = 0; i <= gridHeight + options.padding; i += cellSize) {
    ctx.moveTo(options.padding, 0.5 + i + options.padding);
    ctx.lineTo(gridWidth + options.padding, 0.5 + i + options.padding);
  }
  ctx.stroke();
  ctx.restore();
}
/*set layer
function setLayer(layer) {
  currentLayer = layer;
}*/

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {string} color
 */
function drawCircle(x,y, color) {

  ctx.save();
  //setLayer(2);
  ctx.fillStyle = color;
  let columnCenter = cellSize * (x - 1) + cellSize / 2 + options.padding;
  let rowCenter = cellSize * (y - 1) + cellSize / 2 + options.padding;
  //console.log("center : " + columnCenter + " " + rowCenter);
  ctx.beginPath();
  ctx.arc(columnCenter, rowCenter, 10, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
}
//change the color of a cell
function erase(x,y) {
  //check if the cell is in the locations array
  if(locations.includes (x + "," + y) < 0) {
    return;
  }
       //remove the cell from the locations array
  
  locations.splice(locations.indexOf(x + "," + y), 1); 
  ctx.save();
  ctx.fillStyle = options.backgroundColor;
  //get cell top left corner
  const topX = (x-1) * cellSize + options.padding + options.gridLineWidth;
  const topY = (y-1) * cellSize + options.padding + options.gridLineWidth;
  const eraserSize = cellSize - options.gridLineWidth * 2;
  //fill the cell
  ctx.fillRect(topX, topY, eraserSize, eraserSize);
  ctx.restore();
}
/**  main draw function*/
function draw() {
  ctx.save();
  ctx.beginPath();
  //draw the background
  ctx.fillStyle = options.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //setLayer(0);
  drawBorder();
  //setLayer(1);
  drawGridLines();
  labelAxes();
}

//get the coordinates of the mouse click
function getCoords(event) {
  // Calculate mouse position relative to canvas
  const { x, y } = event.target.getBoundingClientRect();
  const mouseX = event.clientX - x;
  const mouseY = event.clientY - y;
  //limit xCoord to 1 to options.columns
  const xCoord = Math.min(
    Math.max(Math.floor(mouseX / cellSize), 1),
    options.columns
  );
  //limit yCoord to 1 to options.rows
  const yCoord = Math.min(
    Math.max(Math.floor(mouseY / cellSize), 1),
    options.rows
  );
  // console.log("mouseX mouseY : " + mouseX + " " + mouseY);
  // console.log("coords: " + xCoord + " " + yCoord);
  return [xCoord, yCoord];
}
//get the distance between two points
function getDistance(x1, y1, x2, y2) {
 
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const diagonalSteps = Math.min(dx, dy);
    const straightSteps = Math.abs(dx - dy);
    return options.scale * (diagonalSteps + straightSteps);
   
  
}
function drawArrow(x, y) {
  //get the last location
  let lastLocation = locations[locations.length - 1];
  //get the last location coordinates
  let lastLocationCoords = lastLocation.split(",");
  let lastX = parseInt(lastLocationCoords[0]);
  let lastY = parseInt(lastLocationCoords[1]);
  //get the distance
  let distance = getDistance(lastX, lastY, x, y);
  //get the cell name
  let cellName = getCellName(x, y);
  //draw the arrow
  drawArrowBetween(lastX, lastY, x, y, cellName, distance);
}
/*
 *generate command
 *example !map -t test -move AB9
 * @param {string} target
 * @param {string} location
 */
function generateCommand(target, location) {
  let command = "!map";
  if (target !== "") {
    command += " -t " + target;
  }
  command += " -move " + location;
  document.getElementById("command-text").innerHTML = command;
}

canvas.addEventListener("mousedown", (event) => {
 

  //coordintates
  let location = getCoords(event);
  let x = location[0];
  let y = location[1];

  if (event.shiftKey) {
    drawArrow(x, y);

    
  } else {
    locations.push(x + "," + y)
    drawCircle(x,y, options.circleColor);
    let cellName = getCellName(x,y);
    //get the distance
    if(locations.length === 1){
      document.getElementById("distance").innerHTML = `distance: 0 ft`;
    } else {
      let previousLocation = locations[locations.length - 2].split(",");
      let distance = getDistance(previousLocation[0], previousLocation[1], x, y);
      document.getElementById("distance").innerHTML = `distance: ${distance} ft`;
      erase(previousLocation[0], previousLocation[1]);
    }
   
    //generate the command
    generateCommand(document.getElementById("target").value, cellName);
  }
});

draw();
