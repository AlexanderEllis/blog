// This is silly little code for playing around with RGB Color Space in 3D.
// It's pretty rough, because this is a hack for fun. If you're curious about
// how any of it works, feel free to reach out for a walkthrough.

// Helper function to change the color accordingly.
let colors = {
  'red': 137,
  'green': 137,
  'blue': 137,
};

function updateColor(color, value) {
  colors[color] = (value / 100) * 255 ;
  let colorValue = `rgb(${colors.red}, ${colors.green}, ${colors.blue})`;
  document.getElementById('slider-select').style.backgroundColor = colorValue;
  document.getElementById(`${color}-label`).innerText = value;
  updatePoint();
}

for (const color in colors) {
  document.getElementById(color).addEventListener('input', (event) => {
    updateColor(color, event.target.value);
  });
}

// Most of this is copied from
// http://bl.ocks.org/fabid/acb5dc4961ffa741b52b
var makeSolid =  function(selection, color) {
  selection.append("appearance").append("material").attr("diffuseColor", color || 	"black");
  return selection;
}

var width = 800, height = 500;
var x3d = d3.select("#x3d-container").append("x3d")
  .attr("width", width + 'px')
  .attr("height", height +'px' );
d3.select('.x3dom-canvas')
  .attr("width", 2 * width)
  .attr("height", 2 *  height);

var x = d3.scaleLinear().range([0, 100]);
var y = d3.scaleLinear().range([0, 100]);
var z = d3.scaleLinear().range([0, 100]);
var xAxis = d3_x3dom_axis.x3domAxis('x', 'z', x).tickSize(z.range()[1] - z.range()[0]).tickPadding(y.range()[0]);;
var yAxis = d3_x3dom_axis.x3domAxis('y', 'z', y).tickSize(z.range()[1] - z.range()[0]);
var yAxis2 = d3_x3dom_axis.x3domAxis('y', 'x', y).tickSize(x.range()[1] - x.range()[0]).tickFormat(function(d){return ''});
var zAxis = d3_x3dom_axis.x3domAxis('z', 'x', y).tickSize(x.range()[1] - x.range()[0]);
var scene = x3d.append("scene");
var view_pos = [200, 50, 200];
var fov = 0.8;
var view_or = [0, 1, 0, 0.7];

scene.append("viewpoint")
  .attr("position", view_pos.join(" "))
  .attr("orientation", view_or.join(" "))
  .attr("fieldOfView", fov);
scene.append('group')
  .attr('class', 'xAxis')
  .call(xAxis)
  .select('.domain').call(makeSolid, 'blue');
scene.append('group')
  .attr('class', 'yAxis')
  .call(yAxis)
  .select('.domain').call(makeSolid, 'red');
scene.append('group')
  .attr('class', 'yAxis')
  .call(yAxis2)
  .select('.domain').call(makeSolid, 'red');
scene.append('group')
  .attr('class', 'zAxis')
  .call(zAxis)
  .select('.domain');

// My code starts here.
const getFraction = (colorValue) => {
  return Math.floor(colorValue) / 255;
}
var rows = [{
    x: getFraction(colors.red),
    z: getFraction(colors.green),
    y: getFraction(colors.blue),
}];

function updatePoint() {
  var color = `#${makeHex(colors.red)}${makeHex(colors.green)}${makeHex(colors.blue)}`;
  // Update translation and color.
  var translationString = `${x(getFraction(colors.red))} ${y(getFraction(colors.green))} ${z(getFraction(colors.blue))}`;
  scene.selectAll('.point').attr('translation', translationString);
  scene.selectAll('.point').selectAll('material').attr('diffuseColor', color);
}

const makeHex = (colorValue) => {
  let value = Math.floor(colorValue).toString(16);
  if (value.length == 1) {
    value = '0' + value;
  }
  return value;
}

// We only draw the point once, after which we can just update the attributes.
var color = `#${makeHex(colors.red)}${makeHex(colors.green)}${makeHex(colors.blue)}`;
scene.selectAll('.point').data(rows).enter()
  .append('transform')
    .attr('class', 'point')
    .attr('translation', function(d){ return x(d.x) + ' ' + y(d.y) + ' ' + z(d.z); })
  .append('shape')
    .call(makeSolid, color)
  .append('sphere')
    .attr('radius', 5);
updatePoint();

// True is positive, false is negative, but I'm the only one who has to remember this.
let directions = {
  'red': true,
  'green': false,
  'blue': false,
}
let dvdEnabled = false;
function dvdMode() {
  if (!dvdEnabled) {
    return;
  }
  requestAnimationFrame(dvdMode);
  for (const color in directions) {
    if ((directions[color] && colors[color] >= 255) || (!directions[color] && colors[color] <= 0)) {
      directions[color] = !directions[color];
    }
    colors[color] += directions[color] ? 1 : -1;
    // Update sliders.
    const value = Math.floor(colors[color] / 255 * 100)
    document.getElementById(color).value = value;
    document.getElementById(`${color}-label`).innerText = value;
  }
  // Update main color too.
  let colorValue = `rgb(${colors.red}, ${colors.green}, ${colors.blue})`;
  document.getElementById('slider-select').style.backgroundColor = colorValue;
  updatePoint();
}
function handleRadioChange(element) {
  // This leads to a bug where pressing it multiple times speeds it up, but it's pretty funny so I'll leave it in.
  if (element.value == 'on') {
    // it's on
    dvdEnabled = true;
    dvdMode();
  } else {
    dvdEnabled = false;
  }
}