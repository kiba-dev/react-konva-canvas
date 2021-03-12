import React, { useEffect, useState, useRef } from 'react'
import { render } from 'react-dom'
import { Stage, Layer, Text, Image, Transformer } from 'react-konva'
import useImage from 'use-image'

const Rectangle = ({
  shapeProps,
  onChange,
  image,
  stageWidth,
  stageHeight,
  handleImageX,
  handleImageY,
  handleImageWidth,
  handleImageHeight
}) => {
  const shapeRef = useRef()
  const trRef = useRef()

  useEffect(() => {
    if (image) {
      trRef.current.nodes([shapeRef.current])
    }
  }, [image])

  return (
    <React.Fragment>
      {
        image &&
        <Image
          image={image}
          ref={shapeRef}
          {...shapeProps}
          draggable
          onTransformEnd={e => {
            const node = shapeRef.current
            const scaleX = node.scaleX()
            const scaleY = node.scaleY()

            node.scaleX(1)
            node.scaleY(1)
            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(node.height() * scaleY),
            });
          }}
          dragBoundFunc={pos => {
            let newY = (pos.y >= 0 && pos.y < stageHeight - shapeRef.current.attrs.height) ?
              pos.y : pos.y < 0 ? 0 : stageHeight - shapeRef.current.attrs.height
            let newX = (pos.x >= 0 && pos.x < stageWidth - shapeRef.current.attrs.width) ?
              pos.x : pos.x < 0 ? 0 : stageWidth - shapeRef.current.attrs.width
            handleImageX(newX.toFixed(2))
            handleImageY(newY.toFixed(2))
            handleImageWidth(shapeRef.current.attrs.width.toFixed(2))
            handleImageHeight(shapeRef.current.attrs.height.toFixed(2))
            return {
              x: newX,
              y: newY
            }
          }}
        />
      }
      
      {image && <Transformer ref={trRef} />}
    </React.Fragment>
  );
};

const initialRectangles = [
  {
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    id: "rect1"
  },
];

const App = () => {
  const [stageWidth, setStageWidth] = useState(1000)
  const [stageHeight, setStageHeight] = useState(1000)
  const [inputText, setInputText] = useState('')
  const [fileUrl, setFileUrl] = useState()
  const [image_url] = useImage(fileUrl)
  const [rectangles, setRectangles] = useState(initialRectangles)
  const [textX, setTextX] = useState(0)
  const [textY, setTextY] = useState(0)
  const [imageX, setImageX] = useState(0)
  const [imageY, setImageY] = useState(0)
  const [imageWidth, setImageWidth] = useState(100)
  const [imageHeight, setImageHeight] = useState(100)

  const hiddenFileInput = useRef(null)
  const stageRef = useRef()
  const inputRef = useRef()
  
  useEffect(() => {
    setStageWidth(document.querySelector('#parent-div').offsetWidth)
    setStageHeight(document.querySelector('#parent-div').offsetHeight)
    window.addEventListener('resize', e => {
      setStageWidth(document.querySelector('#parent-div').offsetWidth)
      setStageHeight(document.querySelector('#parent-div').offsetHeight)
    })
  }, [])

  const handleInputChange = e => {
    setInputText(e.target.value)
  }

  const handleButtonClick = e => {
    hiddenFileInput.current.click();
  }

  const handleChange = e => {
    setFileUrl(URL.createObjectURL(e.target.files[0]))
  }

  const handleTextX = val => {
    setTextX(val)
  }

  const handleTextY = val => {
    setTextY(val)
  }

  const handleImageX = val => {
    setImageX(val)
  }

  const handleImageY = val => {
    setImageY(val)
  }

  const handleImageWidth = val => {
    setImageWidth(val)
  }

  const handleImageHeight = val => {
    setImageHeight(val)
  }

  return (
    <div>
      <div style={{display: 'flex', height: '100vh'}}>
        <div 
          id="parent-div"
          style={{
            width: '50%',
            backgroundColor: '#33333322',
            margin: '40px',
            marginRight: '40px',
          }}
        >
          <Stage width={stageWidth} height={stageHeight} ref={stageRef}>
            <Layer>
              <Rectangle
                image={image_url}
                shapeProps={rectangles[0]}
                stageWidth={stageWidth}
                stageHeight={stageHeight}
                handleImageX={handleImageX}
                handleImageY={handleImageY}
                handleImageWidth={handleImageWidth}
                handleImageHeight={handleImageHeight}
                onChange={newAttrs => {
                  const rects = rectangles.slice()
                  rects[0] = newAttrs
                  setRectangles(rects)
                }}
              />
              <Text
                id="text"
                text={inputText}
                draggable
                fontSize={50}
                ref={inputRef}
                dragBoundFunc={pos => {
                  let newY = (pos.y >= 0 && pos.y < stageHeight - 50 * inputRef.current.textArr.length) ?
                    pos.y : pos.y < 0 ? 0 : stageHeight - 50 * inputRef.current.textArr.length
                  let newX = (pos.x >= 0 && pos.x < stageWidth - inputRef.current.textWidth) ?
                    pos.x : pos.x < 0 ? 0 : stageWidth - inputRef.current.textWidth
                  handleTextX(newX.toFixed(2))
                  handleTextY(newY.toFixed(2))
                  return {
                    x: newX,
                    y: newY
                  }
                }}
                visible={inputText !== ''}
                wrap="word"
                width={stageWidth}
              />
            </Layer>
          </Stage>
        </div>
        <div style={{ width: '50%', margin: '40px' }}>
          <div style={{ marginBottom: '40px' }}>
            <input
              value={inputText}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <button onClick={handleButtonClick}>Upload Image</button>
            <input
              type="file"
              ref={hiddenFileInput}
              style={{ display: 'none' }}
              onChange={handleChange}
              accept="image/x-png,image/gif,image/jpeg"
            />
          </div>
          <div>
            <p>Text: x = {textX}, y = {textY}</p><br />
            <p>Image: x = {imageX}, y = {imageY}, width = {imageWidth}, height = {imageHeight}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

render(<App />, document.getElementById('root'))
