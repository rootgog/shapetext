import {
    ShapeText
} from "./shapetext.js";


var demo = new ShapeText({
    element: document.getElementById("demo"),
    text: "demo",
    radius: 2.5,
    scale: 5.6,
    range: 10,
    speed: 100,
    colors: ["blue", "green", "yellow", "lightblue"],
    density: 0.15,
    font: "arial"
}).draw();