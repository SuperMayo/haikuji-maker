import { useRef, useState, useCallback } from 'react'
import Twemoji from 'react-twemoji'
import { toJpeg } from 'html-to-image';
import { Editor } from "@tinymce/tinymce-react";
import MD5 from "crypto-js/md5";
import ColorPicker from './ColorPicker';
import Parameters from './Parameters';
import styled from 'styled-components';
import './App.css'
import Noise from './noise.svg'


const rgbToString = (c) => {
    return("rgba(" + c. r + "," + c.g + "," + c.b + "," + c.a + ")")
}

const Haikuji = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 250px;
  height: 250px;
  filter: contrast(100%) brightness(100%);
  background: linear-gradient(${props => props.angle}deg, ${props => rgbToString(props.color[0])}, ${props => rgbToString(props.color[1])}), url(${Noise});
`;

function App() {
  const [haiku, setHaiku] = useState("")
  const [color, setColor] = useState([{r:27, g:1, b:155, a:0.5},{r:27, g:1, b:155, a:0.5}])
  const [colorContext, setColorContext] = useState([true, true])
  const [angle, setAngle] = useState(45)
  const [showPicker, setShowPicker] = useState(false)
  const [showParameters, setShowParameters] = useState(false)
  const [parameters, setParameters] = useState(
    [
      {var: "--emoji-margin-x", default: "0.3", value: "0.3", unit: "rem"},
      {var: "--emoji-margin-y", default: "0.3", value: "0.3", unit: "rem"},
      {var: "--emoji-size", default: "25", value: "25", unit: "px"},
    ]
  )

  const handleColorChange = (c) => {
    let colorVector = [...color];
    colorContext.forEach((isContext, index) => {
      if(isContext){
        colorVector[index] = c.rgb;
      }
    })
    setColor(colorVector);
  }

  const handleContextChange = (id) => {
    let newContext = [...colorContext];
    newContext[id] = !colorContext[id];
    setColorContext(newContext);
  }

  const handleAngleChange = (e) => {
    setAngle(e.currentTarget.value);
  }
  
  const onTogglePicker = () => setShowPicker(!showPicker)
  const onToggleParameters = () => setShowParameters(!showParameters)

  const ref = useRef()
  
  const handleParameterChange = (id, e) => {
      document.documentElement.style.setProperty(parameters[id].var, 
        e.currentTarget.value + parameters[id].unit);
      const newParam = [...parameters];
      newParam[id].value = e.currentTarget.value;
      setParameters(newParam);
  }

  const updateHaiku = str => {
    setHaiku(str.replace(/<img.*?alt="(.*?)"[^\>]+>/g, '$1'))
  }

  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return
    }

    toJpeg(ref.current, { cacheBust: false, pixelRatio: 4 })
      .then((dataUrl) => {
        const link = document.createElement('a')
        const hash = MD5(dataUrl).toString().slice(0,7);
        link.download = 'haikuji_' + hash + '.jpg';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err)
      })
  }, [ref])

  return (
    <div className="App">
      <main>
        <h1>Haikuji maker</h1>
        <div className="container">
        <Editor
          className="editor"
          apiKey="lhbf10sal6l98ijg1obpri3uh8wp5cwl7uiclkjhkj6ck4dn"
          init={{
            plugins: ["emoticons", "autoresize"],
            max_height: 200,
            initialValue: "<p>hello</p>",
            height: 200,
            width: 200,
            toolbar: "emoticons",
            emoticons_database: 'emojiimages',
            toolbar_location: "bottom",
            menubar: false,
            content_style: "p {margin: 0; padding: 0}"
          }}
          onEditorChange={e => updateHaiku(e)}>
          </Editor>
          </div>

        <Twemoji options={{ className: 'twemoji', ext: '.svg', folder: 'svg' }}>
          <div className = "container">
            <Haikuji ref={ref} color={color} angle={angle} >
              <p dangerouslySetInnerHTML={{__html: haiku}}></p>
            </Haikuji>
          </div>
        </Twemoji>

        <Twemoji>
          <button onClick={onTogglePicker}>🎨</button>
            { showPicker ? 
            <div>
              <ColorPicker 
                color={color[colorContext.indexOf(true)]} 
                handleColorChange={handleColorChange}
                style={{margin: "auto"}}/> 
              <div>
                <input type="checkbox" value="0" defaultChecked={colorContext[0]} onChange={(e) => handleContextChange(0)}/> From
                <input type="checkbox" value="1" defaultChecked={colorContext[1]} onChange={(e) => handleContextChange(1)}/> To
              </div>
          </div>
            : null }
          <button onClick={onToggleParameters}>⚙️</button>
            {showParameters ? 
            <Parameters 
              parameters={parameters}
              angle={angle}
              handleAngleChange={handleAngleChange}
              handleParameterChange={handleParameterChange}/>
            : null}
          <button onClick={onButtonClick}>💾</button>
        </Twemoji>
      </main>
    </div>
  )
}

export default App
