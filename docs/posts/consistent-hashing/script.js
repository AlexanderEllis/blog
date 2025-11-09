/*
 * DISCLAIMER: Hacky code ahead. @ me if you have any questions.
 */
const BIG_CIRCLE_RADIUS = 200;
const FULL_WIDTH = 600;
const HALF_WIDTH = FULL_WIDTH / 2;

const NODE_RADIUS = 20;

var svgns = "http://www.w3.org/2000/svg";
var container = document.getElementById('container');

var listOfNodes = [];

var sortNodes = (a, b) => {
  return a.value > b.value ? 1 : -1;
}

var createNode = (id, value) => {
  let newNode = {
    id: id,
    value: value,
  };
  return newNode;
}

// Initialize IDs to 1. We'll be incrementing/decrementing as we go.
var nextID = 1;

function drawMainCircle() {
  console.log('drawing circle');
  var circle = document.createElementNS(svgns, 'circle');
  circle.setAttributeNS(null, 'cx', HALF_WIDTH);
  circle.setAttributeNS(null, 'cy', HALF_WIDTH);
  circle.setAttributeNS(null, 'r', BIG_CIRCLE_RADIUS);
  circle.setAttributeNS(null, 'style', 'fill: none; stroke: blue; stroke-width: 1px;');

  container.appendChild(circle);

  var label = document.createElementNS(svgns, 'text');
  label.setAttributeNS(null, 'x', HALF_WIDTH);
  label.setAttributeNS(null, 'y', 75);
  label.setAttributeNS(null, 'font-size', '50');
  label.setAttributeNS(null, 'text-anchor', 'middle');
  var textNode = document.createTextNode("0 and 1");
  label.appendChild(textNode);
  container.appendChild(label);

  label = document.createElementNS(svgns, 'text');
  label.setAttributeNS(null, 'x', HALF_WIDTH);
  label.setAttributeNS(null, 'y', FULL_WIDTH - 50);
  label.setAttributeNS(null, 'font-size', '50');
  label.setAttributeNS(null, 'text-anchor', 'middle');
  var textNode = document.createTextNode("0.5");
  label.appendChild(textNode);
  container.appendChild(label);

  label = document.createElementNS(svgns, 'text');
  label.setAttributeNS(null, 'x', 45);
  label.setAttributeNS(null, 'y', HALF_WIDTH);
  label.setAttributeNS(null, 'font-size', '50');
  label.setAttributeNS(null, 'text-anchor', 'middle');
  var textNode = document.createTextNode("0.75");
  label.appendChild(textNode);
  container.appendChild(label);

  label = document.createElementNS(svgns, 'text');
  label.setAttributeNS(null, 'x', FULL_WIDTH - 50);
  label.setAttributeNS(null, 'y', HALF_WIDTH);
  label.setAttributeNS(null, 'font-size', '50');
  label.setAttributeNS(null, 'text-anchor', 'middle');
  var textNode = document.createTextNode("0.25");
  label.appendChild(textNode);
  container.appendChild(label);

}

function drawNode(node) {
  let id = node.id;
  let value = node.value;
  // Get radians, subtract pi/2 so zero is at the top of the circle
  const radians = 2 * 3.14 * value - 3.14 / 2;
  const x = Math.cos(radians) * BIG_CIRCLE_RADIUS;
  const y = Math.sin(radians) * BIG_CIRCLE_RADIUS;

  var circle = document.createElementNS(svgns, 'circle');
  circle.setAttributeNS(null, 'cx', HALF_WIDTH + x);
  circle.setAttributeNS(null, 'cy', HALF_WIDTH + y);
  circle.setAttributeNS(null, 'r', NODE_RADIUS);
  circle.setAttributeNS(null, 'style', 'fill: #eeffaa; stroke: blue; stroke-width: 1px;');
  circle.setAttribute('id', 'circle' + id);
  container.appendChild(circle);

  var label = document.createElementNS(svgns, 'text');
  label.setAttributeNS(null, 'x', HALF_WIDTH + x);
  label.setAttributeNS(null, 'y', HALF_WIDTH + y + 8);
  label.setAttributeNS(null, 'font-size', '25');
  label.setAttributeNS(null, 'text-anchor', 'middle');
  label.setAttribute('id', 'label' + id);
  var textNode = document.createTextNode(id);
  label.appendChild(textNode);

  container.appendChild(label);
}

drawMainCircle();


function addNode () {
  // Create node.
  let newNode = createNode(nextID++, Math.round(Math.random() * 100) / 100);

  // Add to list of nodes.
  listOfNodes.push(newNode);
  listOfNodes.sort(sortNodes);
  drawNode(newNode);
  recalculateRanges();
}

function removeNode() {
  // Stop if we don't have any nodes to remove.
  if (nextID === 1) {
    return;
  }

  // Remove item from listOfNodes.
  const idToRemove = --nextID;
  listOfNodes.splice(
  listOfNodes.findIndex(node => node.index === idToRemove), 1);

  // Remove circle and label.
  document.getElementById('circle' + idToRemove).remove();
  document.getElementById('label' + idToRemove).remove();
}

// On click, show the range covered by this node
function nodeClick(e) {
  console.log(e);

  // Hide all other ones
}


function recalculateRanges() {
  // TODO: remove all range labels
  // TODO: recalculate all range labels

  for (let i = 0; i < listOfNodes.length; i++) {
      let node = listOfNodes[i];
    if (i === 0) {
      let previousValue = listOfNodes[listOfNodes.length - 1].value;
      console.log(`node ${node.id} is responsible for ${previousValue}-0 and 0-${node.value}`);
    } else {
      let previousValue = listOfNodes[i - 1].value;
      console.log(`node ${node.id} is responsible for ${previousValue}-${node.value}`);
    }
  }

  console.log(listOfNodes);
}

document.getElementById("add-node").onclick = addNode;
document.getElementById("remove-node").onclick = removeNode;