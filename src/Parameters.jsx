import { useState} from "react";


const Parameters = ({parameters, handleParameterChange}) => {
    return(
        <div className="flex-col" style={{maxWidth: "200px"}}>
            <div className="flex-col">
                <label for="margin-x">margin-x: {parameters[0].value}</label>
                <input 
                    type="range"
                    name="margin-x" 
                    min="0" max="1" 
                    step="0.1" 
                    defaultValue={parameters[0].default}
                    onChange = {(e) => handleParameterChange(0, e)} />
            </div>
            <div className="flex-col">
                <label for="margin-x">margin-y: {parameters[1].value}</label>
                <input 
                    type="range" 
                    name="margin-y" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    defaultValue={parameters[1].default}
                    onChange = {(e) => handleParameterChange(1, e)}/>
            </div>
            <div className="flex-col">
                <label for="emoji-size">Emoji Size: {parameters[2].value}</label>
                <input 
                    type="range" 
                    name="emoji-size" 
                    min="5" 
                    max="75" 
                    step="5" 
                    defaultValue={parameters[2].default}
                    onChange = {(e) => handleParameterChange(2, e)}/>
            </div>
       </div>
    )
}


export default Parameters;