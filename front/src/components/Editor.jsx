import React, { useEffect, useRef, useState } from 'react'
import MonacoEditor, { loader } from '@monaco-editor/react';
import "../App.css"
import Actions from '../Action';
import toast from 'react-hot-toast';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import htmlLogo from "../assets/icons/html.png"
import cssLogo from "../assets/icons/css-3.png"
import jsLogo from "../assets/icons/js.png"
import python from "../assets/icons/python.png"
import java from "../assets/icons/java.png"
import cplusplus from "../assets/icons/cpp.png"
import loaderGif from "../assets/icons/Loading-bar.gif"


function Editor({ socketRef, roomId, onInputChange, onOutputChange }) {

  const [code, setCode] = useState("#write your python code here")
  const [input, setInput] = useState(" ")
  const [output, setOutput] = useState(" ")
  const [language, setLanguage] = useState(localStorage.getItem("language") || "python")
  const [dropdown, setDropdown] = useState(false)
  const [front, setFront] = useState(false)
  // for front end editor 
  const [htmlCode, setHtmlCode] = useState(localStorage.getItem("htmlCode") || '<!-- write your html here -->')
  const [cssCode, setCssCode] = useState(localStorage.getItem("cssCode") || '/* write your css here */')
  const [jsCode, setJsCode] = useState(localStorage.getItem("jsCode") || '//write your js here')
  const [fileIconImage, setFileIconImage] = useState(python)
  const [loader, setLoader] = useState(false);
  const [JobId, setJobId] = useState(null)
  const [status, setStatus] = useState(null)
  const [executionTime, setExecutionTime] = useState()
  // debounce function which will wait 8000ms

  const myDebounce = (cb, delay) => {
    let timer;
    return function (...args) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        cb(...args)
      }, delay)
    }
  }


  const username = localStorage.getItem("name")
  const handleChange = myDebounce((code) => {
    setCode(code)

    if (language === "python") {
      localStorage.setItem("pythonCode", code)
    } else if (language === "cpp") {
      localStorage.setItem("cppCode", code)
    } else if (language === "java") {
      localStorage.setItem("javaCode", code)
    }
    if (socketRef.current && code != null) {
      socketRef.current.emit(Actions.CODE_CHANGE, ({ code, roomId }))
    }
  }, 800)

  useEffect(() => {
    if (language === "python") {
      if (localStorage.getItem("pythonCode")) {
        setCode(localStorage.getItem("pythonCode"))
        console.log(localStorage.getItem("pythonCode"))
      } else {
        setCode("#write your python code here")
      }
      setFileIconImage(python)
    } else if (language === "cpp") {
      if (localStorage.getItem("cppCode")) {
        setCode(localStorage.getItem("cppCode"))
      } else {
        setCode("//write your cpp code here")
      }
      setFileIconImage(cplusplus)
    } else if (language === "java") {
      if (localStorage.getItem("javaCode")) {
        setCode(localStorage.getItem("javaCode"))
      } else {
        setCode("//write your java code in main class \nclass Main {\npublic static void main(String[] args) {\n\n}\n}")
      }
      setFileIconImage(java)
    } else if (language == "HTML, CSS& JS") {
      setFront(true)
    }
  }, [language])



  const handleInputChange = (e) => {
    setInput(e.target.value)
    onInputChange(e.target.value)
    const input = e.target.value
    if (socketRef.current) {
      socketRef.current.emit(Actions.INPUT_CHANGE, ({ input, roomId }))
    }
  }
  // onLanguageChange(language)
  useEffect(() => {
    var textInput = document.getElementById("input")
    if (socketRef.current) {
      socketRef.current.on(Actions.CODE_CHANGE, (code) => {
        if (code !== null) {
          const language = localStorage.getItem("language")
          if (language === "python") {
            localStorage.setItem("pythonCode", code)
          } else if (language === "cpp") {
            localStorage.setItem("cppCode", code)
          } else if (language === "java") {
            localStorage.setItem("javaCode", code)
          }
          setCode(code)
          console.log(code)
        }
      });
      socketRef.current.on(Actions.INPUT_CHANGE, (input) => {
        if (input !== null) {
          setInput(input)
          onInputChange(input)
          textInput.value = input
        }
      });
      socketRef.current.on(Actions.OUTPUT_CHANGE, (output) => {
        if (output !== null) {
          setOutput(output)
          onOutputChange(output)
        }
      })
      socketRef.current.on(Actions.LANGUAGE_CHANGE, (lang) => {
        localStorage.setItem("language", lang)
        setLanguage(lang)
        if (lang != "HTML, CSS& JS") {
          setFront(false)
        }

      })

      socketRef.current.on(Actions.LANGUAGE_SYNC, (lang) => {
        if (lang != null) {
          console.log(lang)
          localStorage.setItem("language", lang)
          setLanguage(lang)
          if (lang != "HTML, CSS& JS") {
            setFront(false)
          }
        }
      })

      socketRef.current.on(Actions.FRONT_END_CODE_HTML, (html) => {
        if (htmlCode != html) {
          console.log(html)
          setHtmlCode(html)
          localStorage.setItem("htmlCode", html)
        }
      })
      socketRef.current.on(Actions.FRONT_END_CODE_CSS, (css) => {
        if (cssCode != css) {
          setCssCode(css)
          localStorage.setItem("cssCode", css)
        }
      })
      socketRef.current.on(Actions.FRONT_END_CODE_JS, (js) => {
        if (jsCode != js) {
          setJsCode(js)
          localStorage.setItem("jsCode", js)
        }
      })
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off(Actions.CODE_CHANGE);
      }
    };
  }, [socketRef.current]);



  const handleCodeCompilation = async () => {
    if (code !== " " && code !== "#write your python code here " && code !== "//write your cpp code here" && code !== "//write your java code in main class \nclass Main {\npublic static void main(String[] args) {\n\n}\n}") {
      setLoader(true);
      setOutput("")
      setExecutionTime("")
      const response = await fetch('http://localhost:8000/compile/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          input: input,
          code: code,
          language: language
        })
      });
      if (response) {
        const result = await response.json()
        setJobId(result.jobId)
        console.log(JobId)
        setStatus(result.status)

        if (result.jobId) {
          var pollInterval;
          pollInterval = setInterval(async () => {
            const response = await fetch(`http://localhost:8000/compile/status/${result.jobId}`)
            const codeResult = await response.json()
            console.log(codeResult.status)
            console.log("Interval running")
            if (codeResult.status == "success") {
              setLoader(false)
              setStatus("success")
              setExecutionTime(new Date(codeResult.completedAt) - new Date(codeResult.submittedAt))
              setOutput(codeResult.output)
              clearInterval(pollInterval)
            } else if (codeResult.status == "error") {
              setLoader(false)
              setStatus("error")
              if (JSON.parse(codeResult.output).error.code === "ERR_CHILD_PROCESS_STDIO_MAXBUFFER") {
                setOutput("TLE(Time Limited Exection)")
              } else {
                setOutput(JSON.parse(codeResult.output).stderr)
                 console.log(JSON.parse(codeResult.output))
              }
              clearInterval(pollInterval)
            }
            else {
              setTimeout(()=>{
                setLoader(false)
                setStatus("rejected")
                clearTimeout(pollInterval)
                console.log("interval cleared!")
              },5000)
            }
          }, 1000)

        }
      }
    } else {
      setOutput("")
    }
  }

  const handleSelectLanguage = (event) => {
    const lang = event.target.value;
    if (lang === "python") {
      if (localStorage.getItem("pythonCode")) {
        setCode(localStorage.getItem("pythonCode"))
        console.log(localStorage.getItem("pythonCode"))
      } else {
        setCode("#write your python code here")
      }
      setFront(false)
    } else if (lang === "cpp") {
      if (localStorage.getItem("cppCode")) {
        setCode(localStorage.getItem("cppCode"))
      } else {
        setCode("//write your cpp code here")
      }
      setFront(false)
    } else if (lang === "java") {
      if (localStorage.getItem("javaCode")) {
        setCode(localStorage.getItem("javaCode"))
      } else {
        setCode("//write your java code in main class \nclass Main {\npublic static void main(String[] args) {\n\n}\n}")
      }
      setFront(false)
    } else if (lang == "HTML, CSS& JS") {
      setFront(true)
    }
    setLanguage(lang)
    localStorage.setItem("language", lang)
    setDropdown(false)
    if (socketRef.current) {
      socketRef.current.emit(Actions.LANGUAGE_CHANGE, ({ lang, roomId }))
    }
  };

  const showDropDown = () => {
    dropdown ? setDropdown(false) : setDropdown(true)
  }
  const hideDropDown = () => {
    setDropdown(false)
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`http://localhost:5173/editor/${roomId}`);
      toast.success("Share link copied to clipboard", {
        duration: 1000
      })
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }

  //  handle front code change
  const handleHtmlChange = myDebounce((html) => {
    setHtmlCode(html)
    localStorage.setItem("htmlCode", html)
    if (socketRef.current) {
      socketRef.current.emit(Actions.FRONT_END_CODE_HTML, ({ html, roomId }))
    }
  }, 800)
  const handleCssChange = myDebounce((css) => {
    setCssCode(css)
    localStorage.setItem("cssCode", css)
    if (socketRef.current) {
      socketRef.current.emit(Actions.FRONT_END_CODE_CSS, ({ css, roomId }))
    }
  }, 800)
  const handleJsChange = myDebounce((js) => {
    setJsCode(js)
    localStorage.setItem("jsCode", js)
    if (socketRef.current) {
      socketRef.current.emit(Actions.FRONT_END_CODE_JS, ({ js, roomId }))
    }
  }, 800)


  const handleFrontCodeDownload = async () => {
    const response = await fetch('http://localhost:8000/compile/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        htmlCode: htmlCode,
        cssCode: cssCode,
        jsCode: jsCode
      })
    });
    if (response.ok) {
      // Create a temporary link to trigger file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'index.html';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      console.error('Failed to download file');
    }
  }



  return (
    <div className='editor'>
      <div className="editorNavbar">
        <div className='loginedUser'>Hello {username}, happy coding 😊.</div>
        <div className="leftbuttons">
          <button className="leftBtns share" onClick={handleShare}>Share</button>
          {front && <button className="leftBtns execute" onClick={handleFrontCodeDownload}>Download code</button>}
          {loader ? <button className="leftBtns execute">Executing...</button> : !front && <button className="leftBtns execute" onClick={handleCodeCompilation}>Execute</button>}
          <button className='select' onClick={showDropDown}>{language} <ArrowDropDownRoundedIcon /></button>
          {dropdown && <div className="dropdown">
            <button onClick={handleSelectLanguage} className="dropdowns" value="python" >Python</button>
            <button onClick={handleSelectLanguage} className="dropdowns" value="cpp">cpp</button>
            <button onClick={handleSelectLanguage} className="dropdowns" value="java">Java</button>
            <button onClick={handleSelectLanguage} className="dropdowns" value="HTML, CSS& JS">HTML, CSS& JS</button>
          </div>}

        </div>
      </div>

      {!front &&
        <PanelGroup className="editorBody">
          <Panel>
            <p className='fileName'> <img className='fileIcon' src={fileIconImage} />{language}</p>
            <MonacoEditor
              height="100%"
              width="100%"
              language={language}
              value={code}
              theme='vs-dark'
              onChange={handleChange}
              mouseWheelZoom={76}
            />
          </Panel>
          <PanelResizeHandle className='handle' />
          <Panel>
            <PanelGroup direction="horizontal">
              <Panel className='inputPanel'>
                <span>Input</span>
                <textarea id="input" placeholder='Enter your inputs here' onChange={handleInputChange} />
              </Panel>
              <PanelResizeHandle className="vHandle" />
              <Panel className='outputPanel' >
                <div className='outPutTitle'>
                  <span>Output: </span>
                  <button onClick={() => (setOutput(""), setJobId(""), setStatus(""), setExecutionTime(""))} className='clrOutput'>Clear Output</button>
                </div>
                {loader ? <div className='loader'><div className="loading"></div> </div> : <textarea value={output} readOnly>
                </textarea>}
                <div className="executionInfo">
                  {JobId && <span>Job id : {JobId} |</span>}
                  {status && <span>Status : <span style={{ color: status == "error" ? '#ff3737' : status == "success" ? "#31ff31" : "yellow" }}>{status}</span></span>}
                  {executionTime && <span> | Execution time : <span style={{ color: executionTime > 2000 ? '#ff3737' : "#31ff31" }}>{executionTime} ms</span></span>}
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>

      }

      {/* front end code */}

      {front &&
        <PanelGroup className="editorBody">
          <Panel>
            <PanelGroup direction="horizontal">
              <Panel minSize={5}>
                <p className='fileName'><img className='fileIcon' src={htmlLogo} alt='htmlLogo' /> HTML</p>
                <MonacoEditor
                  height="100%"
                  width="100%"
                  language="html"
                  theme='vs-dark'
                  onChange={(value) => { handleHtmlChange(value) }}
                  value={htmlCode}
                />
              </Panel>
              <PanelResizeHandle className="vHandle" />
              <Panel minSize={5}>
                <p className='fileName'><img className='fileIcon' src={cssLogo} alt='cssLogo' /> CSS</p>
                <MonacoEditor
                  height="100%"
                  width="100%"
                  language="css"
                  theme='vs-dark'
                  onChange={(value) => { handleCssChange(value) }}
                  value={cssCode}
                />
              </Panel>
              <PanelResizeHandle className="vHandle" />
              <Panel minSize={5}>
                <p className='fileName'> <img className='fileIcon' src={jsLogo} alt='jsLogo' /> JavaScript</p>
                <MonacoEditor
                  height="100%"
                  width="100%"
                  language="javascript"
                  theme='vs-dark'
                  onChange={(value) => { handleJsChange(value) }}
                  value={jsCode}
                />
              </Panel>
            </PanelGroup>
          </Panel>
          <PanelResizeHandle className="handle" />
          <Panel style={{ margin: 0, background: "white" }}>
            <iframe
              srcDoc={`
              <!doctype html>
              <html lang="en">
                <head>
                  <style>${cssCode}</style>
                </head>
                <body>
                  ${htmlCode}
                  <script>${jsCode}</script>
                </body>
              </html>
              `}
              title="output"
              sandbox="allow-forms allow-popups allow-scripts allow-same-origin allow-modals"
              frameBorder="0"
              width="100%"
              height="100%"
            />
          </Panel>
        </PanelGroup>
      }

    </div>
  )
}

export default Editor
