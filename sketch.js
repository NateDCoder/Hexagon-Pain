let SCALE = 50;
const REEF_Y = 4;
const REEF_X_BLUE = 4.5;
const REEF_X_RED = 17.5 - 4.5;
const REEF_SIZE = 1.3;
var reefPointsAngles;

var startPoint, endPoint, controlPoint1, controlPoint2;

var vertexPoint1, vertexPoint2;
let vertexs = [];
function setup() {
    createCanvas(17.5 * SCALE, 8 * SCALE);
    reefPointsAngles = [0, PI / 3, 2 * PI / 3, PI, 4 * PI / 3, 5 * PI / 3];

    startPoint = createVector(0, 0)
    endPoint = createVector(0, 0)

    controlPoint1 = createVector(0, 0);
    controlPoint2 = createVector(0, 0);
}


function draw() {
    background(57);
    // Reef Zone
    fill(0, 0, 255);
    noStroke();
    beginShape();
    for (let i = 0; i < reefPointsAngles.length; i++) {
        vertex(REEF_X_BLUE * SCALE + SCALE * REEF_SIZE * Math.sin(reefPointsAngles[i]), REEF_Y * SCALE + SCALE * REEF_SIZE * Math.cos(reefPointsAngles[i]));
        vertexs.push(createVector(REEF_X_BLUE * SCALE + SCALE * REEF_SIZE * Math.sin(reefPointsAngles[i]), REEF_Y * SCALE + SCALE * REEF_SIZE * Math.cos(reefPointsAngles[i])))
    }
    endShape();

    fill(255, 0, 0);
    noStroke();
    beginShape();
    for (let i = 0; i < reefPointsAngles.length; i++) {
        vertex(REEF_X_RED * SCALE + SCALE * REEF_SIZE * Math.sin(reefPointsAngles[i]), REEF_Y * SCALE + SCALE * REEF_SIZE * Math.cos(reefPointsAngles[i]));
    }
    endShape();
    noFill();
    stroke(255);
    strokeWeight(4);
    bezier(startPoint.x, startPoint.y, startPoint.x + controlPoint1.x, startPoint.y + controlPoint1.y, endPoint.x + controlPoint2.x, endPoint.y + controlPoint2.y, endPoint.x, endPoint.y)
    if (changeStart || changeEnd) {
        return;
    }
    let intersectedPlanes = [];
    // Check if the lines intersect
    for (let i = 0; i < reefPointsAngles.length; i++) {
        let vertex1 = createVector(REEF_X_BLUE * SCALE + SCALE * REEF_SIZE * Math.sin(reefPointsAngles[i]), REEF_Y * SCALE + SCALE * REEF_SIZE * Math.cos(reefPointsAngles[i]));
        let nextI = (i + 1) % 6;
        let vertex2 = createVector(REEF_X_BLUE * SCALE + SCALE * REEF_SIZE * Math.sin(reefPointsAngles[nextI]), REEF_Y * SCALE + SCALE * REEF_SIZE * Math.cos(reefPointsAngles[nextI]));
        if (doIntersect(vertex1, vertex2, startPoint, endPoint)) {
            intersectedPlanes.push(i);
        }
    }
    if (intersectedPlanes.length == 0) {
        controlPoint1 = createVector(0, 0);
        controlPoint2 = createVector(0, 0);
        return;
    }
    let planeLength = Math.min(Math.abs(intersectedPlanes[0] - intersectedPlanes[1]), 6 - Math.abs(intersectedPlanes[0] - intersectedPlanes[1]));
    let L1, L2, L3, t1, t2;
    switch (planeLength) {
        case 1:
            vertexPoint2 = endPoint.copy();
            vertexPoint1 = intersectedPlanes[0] == 0 && intersectedPlanes[1] == 5 ? vertexs[0] : vertexs[intersectedPlanes[0] + 1];
            controlPoint2 = createVector(0, 0);
            L1 = dist(startPoint.x, startPoint.y, vertexPoint1.x, vertexPoint1.y);
            L2 = dist(vertexPoint1.x, vertexPoint1.y, vertexPoint2.x, vertexPoint2.y);
            t1 = L1 / (L1 + L2) * 0.86;

            getControlPoints(t1, 0.999);
            break;
        case 2:
            vertexPoint1 = vertexs[intersectedPlanes[0] + 1];
            vertexPoint2 = vertexs[intersectedPlanes[0] + 2];
            if (intersectedPlanes[0] == 0 && intersectedPlanes[1] == 4) {
                vertexPoint1 = vertexs[5];
                vertexPoint2 = vertexs[0];
            } else if (intersectedPlanes[0] == 1 && intersectedPlanes[1] == 5) {
                vertexPoint1 = vertexs[0];
                vertexPoint2 = vertexs[1];
            }
            controlPoint2 = createVector(0, 0);
            if (dist(startPoint.x, startPoint.y, vertexPoint1.x, vertexPoint1.y) > dist(startPoint.x, startPoint.y, vertexPoint2.x, vertexPoint2.y)) {
                let cpy = vertexPoint1;
                vertexPoint1 = vertexPoint2;
                vertexPoint2 = cpy;
            } 
            L1 = dist(startPoint.x, startPoint.y, vertexPoint1.x, vertexPoint1.y);
            L2 = dist(vertexPoint1.x, vertexPoint1.y, vertexPoint2.x, vertexPoint2.y);
            L3 = dist(vertexPoint2.x, vertexPoint2.y, endPoint.x, endPoint.y);

            t1 = L1 / (L1 + L2 + L3) * 0.86;
            t2 = 1 - L3 / (L1 + L2 + L3)


            getControlPoints(t1, t2);
            break;
        case 3:
            vertexPoint1 = vertexs[intersectedPlanes[0] + 1];
            vertexPoint2 = vertexs[intersectedPlanes[0] + 2];
            if (intersectedPlanes[0] == 0 && intersectedPlanes[1] == 4) {
                vertexPoint1 = vertexs[5];
                vertexPoint2 = vertexs[0];
            } else if (intersectedPlanes[0] == 1 && intersectedPlanes[1] == 5) {
                vertexPoint1 = vertexs[0];
                vertexPoint2 = vertexs[1];
            }
            controlPoint2 = createVector(0, 0);
            if (dist(startPoint.x, startPoint.y, vertexPoint1.x, vertexPoint1.y) > dist(startPoint.x, startPoint.y, vertexPoint2.x, vertexPoint2.y)) {
                let cpy = vertexPoint1;
                vertexPoint1 = vertexPoint2;
                vertexPoint2 = cpy;
            } 
            L1 = dist(startPoint.x, startPoint.y, vertexPoint1.x, vertexPoint1.y);
            L2 = dist(vertexPoint1.x, vertexPoint1.y, vertexPoint2.x, vertexPoint2.y);
            L3 = dist(vertexPoint2.x, vertexPoint2.y, endPoint.x, endPoint.y);

            t1 = L1 / (L1 + L2 + L3) * 0.86;
            t2 = 1 - L3 / (L1 + L2 + L3)


            getControlPoints(t1, t2);
            break;
    }
}

function getControlPoints(t1, t2) {
    let t1Minus = (1 - t1);
    let t1MinusSquared = (1 - t1) * (1 - t1)
    let t1MinusCubed = (1 - t1) * (1 - t1) * (1 - t1)
    let t1Squared = t1 * t1;
    let t1Cubed = t1 * t1 * t1;

    let t2Minus = (1 - t2);
    let t2MinusSquared = (1 - t2) * (1 - t2)
    let t2MinusCubed = (1 - t2) * (1 - t2) * (1 - t2);
    let t2Squared = t2 * t2;
    let t2Cubed = t2 * t2 * t2;

    let controlP2 = createVector(0, 0);

    let num2_1X = 3 * t1MinusSquared * t1 * (-endPoint.x * t2Cubed - startPoint.x * t2MinusCubed + vertexPoint2.x);
    let num2_2X = 3 * (endPoint.x * t1Cubed + startPoint.x * t1MinusCubed - vertexPoint1.x) * t2MinusSquared * t2


    let den_2_1 = 9 * t1MinusSquared * t1 * t2Minus * t2Squared;
    let den_2_2 = - 9 * t1Minus * t1Squared * t2MinusSquared * t2

    controlP2.x = (num2_1X + num2_2X) / (den_2_1 + den_2_2) - endPoint.x;
    let num2_1Y = 3 * t1MinusSquared * t1 * (-endPoint.y * t2Cubed - startPoint.y * t2MinusCubed + vertexPoint2.y)
    let num2_2Y = 3 * (endPoint.y * t1Cubed + startPoint.y * t1MinusCubed - vertexPoint1.y) * t2MinusSquared * t2

    controlP2.y = (num2_1Y + num2_2Y) / (den_2_1 + den_2_2) - endPoint.y;
    if (t2 == 0.999) {
        controlP2 = createVector(0, 0);
    }

    let num1_1X = vertexPoint1.x - t1MinusCubed * startPoint.x - t1Cubed * endPoint.x;
    let num1_2X = -3 * t1Squared * t1Minus * (controlP2.x + endPoint.x);

    let den1 = 3 * t1 * t1MinusSquared;
    let controlP1 = createVector(0, 0);
    controlP1.x = (num1_1X + num1_2X) / den1 - startPoint.x

    let num1_1Y = vertexPoint1.y - t1MinusCubed * startPoint.y - t1Cubed * endPoint.y;
    let num1_2Y = -3 * t1Squared * t1Minus * (controlP2.y + endPoint.y);

    controlP1.y = (num1_1Y + num1_2Y) / den1 - startPoint.y

    controlPoint1 = controlP1;
    controlPoint2 = controlP2;
    // noLoop();
    return { "controlP1": controlP1, "controlP2": controlP2 }

}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

var newStart = false;
var changeStart = false;
var changeEnd = false;

function mousePressed() {
    if (dist(0, 0, startPoint.x, startPoint.y) < 5 && dist(0, 0, endPoint.x, endPoint.y) < 5) {
        startPoint = createVector(mouseX, mouseY);
        newStart = true;
    } else if (dist(mouseX, mouseY, startPoint.x, startPoint.y) < 20) {
        startPoint = createVector(mouseX, mouseY);
        changeStart = true;
    } else if (dist(mouseX, mouseY, endPoint.x, endPoint.y) < 20) {
        endPoint = createVector(mouseX, mouseY);
        changeEnd = true;
    }
}

// Stop changing the first control point when the user releases the mouse.
function mouseReleased() {
    changeStart = false;
    changeEnd = false;
    newStart = false;
}

// Update the first control point while the user drags the mouse.
function mouseDragged() {
    if (changeStart) {
        startPoint = createVector(mouseX, mouseY);
    } else if (changeEnd || newStart) {
        endPoint = createVector(mouseX, mouseY);
    }
}

function onSegment(p, q, r) {
    return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
        q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
}

function orientationLine(p, q, r) {
    let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (val === 0) return 0;  // collinear
    return (val > 0) ? 1 : 2;  // 1 -> clockwise, 2 -> counterclockwise
}

function doIntersect(p1, q1, p2, q2) {
    let o1 = orientationLine(p1, q1, p2);
    let o2 = orientationLine(p1, q1, q2);
    let o3 = orientationLine(p2, q2, p1);
    let o4 = orientationLine(p2, q2, q1);

    // General case
    if (o1 !== o2 && o3 !== o4) return true;

    // Special cases
    if (o1 === 0 && onSegment(p1, p2, q1)) return true;
    if (o2 === 0 && onSegment(p1, q2, q1)) return true;
    if (o3 === 0 && onSegment(p2, p1, q2)) return true;
    if (o4 === 0 && onSegment(p2, q1, q2)) return true;

    return false;  // No intersection
}