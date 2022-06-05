import { useRef, useState, useCallback } from 'react'
import Twemoji from 'react-twemoji'
import { toJpeg } from 'html-to-image';
import { Editor } from "@tinymce/tinymce-react";
import MD5 from "crypto-js/md5";
import ColorPicker from './ColorPicker';
import Parameters from './Parameters';
import './App.css'

function App() {
  const [haiku, setHaiku] = useState("")
  const [color, setColor] = useState("rgba(234, 244, 243, 0.9)")
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
    setColor(c.rgb)
    const newc = "rgba(" + c.rgb.r + "," + c.rgb.g + "," + c.rgb.b + "," + c.rgb.a + ")"
    console.log(newc)
    document.documentElement.style.setProperty("--bg-color", newc)
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
            <div id="haiku" 
              ref={ref} 
              // style={{backgroundColor: color}}
              >
              <p dangerouslySetInnerHTML={{__html: haiku}}></p>
            </div>
          </div>
        </Twemoji>

        <Twemoji>
        <button onClick={onTogglePicker}>🎨</button>
        { showPicker ? 
        <ColorPicker color={color} handleColorChange={handleColorChange} style={{margin: "auto"}}/> 
        : null }
        <button onClick={onToggleParameters}>⚙️</button>
        {showParameters ? 
        <Parameters 
          parameters={parameters} 
          handleParameterChange={handleParameterChange}/>
        : null}
        <button onClick={onButtonClick}>💾</button>
        </Twemoji>
      </main>
    </div>
  )
}

export default App
