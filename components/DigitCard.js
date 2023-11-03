import React, { useState } from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import ReloadIcon from "@mui/icons-material/RestartAlt";

import DigitCanvas from "./DigitCanvas";

export default function DigitCard() {
  const [prediction, setPrediction] = useState("Tap Predict button below");
  const [makePrediction, setMakePrediction] = React.useState(false);

  const predictButtonWasPressed = (evt) => {
    console.log("predictButtonWasPressed", evt);
    console.log("predictButtonWasPressed makePrediction", makePrediction);
    setMakePrediction(true);
  };

  return (
    <Card sx={{ maxWidth: 400 }}>
      <CardHeader title="Digit" />
      <DigitCanvas
        setPrediction={setPrediction}
        setMakePrediction={setMakePrediction}
        makePrediction={makePrediction}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {prediction}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="predict" onClick={predictButtonWasPressed}>
          <KeyboardReturnIcon />
        </IconButton>
        <IconButton
          aria-label="clear"
          onClick={() => {
            saveableCanvas.eraseAll();
          }}
        >
          <ReloadIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
