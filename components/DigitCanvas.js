import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";

import CanvasDraw from "react-canvas-draw";
const MODEL_URL = "./model/model.json";

export default function DigitCanvas(props) {
  let saveableCanvas = useRef();
  const [data, setData] = React.useState("");

  useEffect(() => {
    console.log("useEffect props.makePrediction", props.makePrediction);
    if (props.makePrediction) {
      makePredictionHandler();
    }
  }, [props.makePrediction]);

  useEffect(() => {
    if (data) {
      if (data.lines.length > 1) {
        data.lines.shift();
        saveableCanvas.loadSaveData(JSON.stringify(data));
      }
    }
  }, [data]);

  const setPredictionText = (input) => {
    props.setPrediction(input);
  };

  const handleChange = (evt) => {
    console.log("onChange data", data);
    setPredictionText("Tap Predict button below");
    setData(JSON.parse(evt.getSaveData()));
  };

  const handleMouseDown = (evt) => {
    console.log("handleMouseDown", evt);
  };

  const preprocessCanvas = (canvas) => {
    let tensor = tf.browser
      .fromPixels(canvas)
      .resizeNearestNeighbor([28, 28])
      .mean(2)
      .expandDims(2)
      .expandDims()
      .toFloat();
    console.log("preprocessCanvas", tensor);
    return tensor.div(255.0); // Normalize [0..255] values into [0..1] range
  };

  const digitString = (data, val) => {
    const percentage = Number(data[val] * 100).toFixed(0);
    if (data[val] > 0.5) {
      return "Digit is " + val[0];
    }
    return `Digit may be ${val[0]}, I'm ${percentage}% sure.`;
  };

  const makePredictionHandler = async () => {
    // console.log("makePrediction", data);

    const model = await tf.loadLayersModel(MODEL_URL);

    if (model) {
      console.log(
        "makePrediction saveableCanvas1.canvas.drawing",
        saveableCanvas.canvas.drawing
      );

      const modelData = await model
        .predict(preprocessCanvas(saveableCanvas.canvas.drawing))
        .data(); // this will run whenever "tensor" updates
      console.log("makePrediction modelData", modelData);

      const result = await tf.argMax(modelData).data();
      if (result) setPredictionText(digitString(modelData, result));
    }

    props.setMakePrediction(!props.makePrediction);
  };

  return (
    <CanvasDraw
      id="myCanvas"
      ref={(canvasDraw) => (saveableCanvas = canvasDraw)}
      onChange={handleChange}
      onMouseDown={handleMouseDown}
      onClick={() => {
        saveableCanvas.clear();
      }}
    />
  );
}
