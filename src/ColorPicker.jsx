import {useState} from "react";
import { SketchPicker } from "react-color";

const ColorPicker = ({color, handleColorChange}) => {
    return (
      <div className="color-picker">
        <SketchPicker 
            color={color}
            onChange={handleColorChange}
            disableAlpha={false}
            presetColors={["#eaf4f3",
            "#ffecf8",
            "#d8fcff",
            "#f8e7f8",
            "#f8f7ff",
            "#F4EAEA",
            "#E7F8F1",
          ]}
        />
      </div>
    );
}

export default ColorPicker;