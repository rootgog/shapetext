import {
    ShapeText
} from "./shapetext.js";

window.onload = () => {

    var text = new ShapeText({
        element: document.getElementById("demo"),
        text: "demo",
        radius: 3,
        scale: 6,
        range: 10,
        speed: 100,
        colors: ["#FFFFFF", "#81F4E1", "#56CBF9", "#FF729F", "#D3C4D1"],
        density: 0.07,
        font: "arial"
    }).draw();
}