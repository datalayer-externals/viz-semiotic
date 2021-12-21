import React from "react"
import DocumentFrame from "../DocumentFrame"
import { OrdinalFrame } from "semiotic"
import { green, red, purple } from "../theme"
import MarkdownText from "../MarkdownText"

const frameProps = {
  size: [700, 400],
  rExtent: [0, 65000],
  rAccessor: "value",
  oAccessor: "name",
  axes: [{ tickFormat: d => `$${d / 1000}k`, orient: "left" }],
  type: waterfall,
  oLabel: d => <text transform="rotate(45)">{d}</text>,
  margin: { left: 60, top: 20, bottom: 100, right: 20 },
  oPadding: 40,
  data: [
    { name: "Product Revenue", value: 42000 },
    { name: "Services Revenue", value: 21000 },
    { name: "Fixed Costs", value: -17000 },
    { name: "Variable Costs", value: -14000 },
    { name: "Other Costs", value: -10000 },
    { name: "Ransoms", value: 10000 },
    { name: "Cat Rental", value: 10000 },
    { name: "Total" }
  ]
}

const framePropsInteractive = {
  size: [700, 400],
  rExtent: [0, 65000],
  rAccessor: "value",
  oAccessor: "name",
  axes: [{ tickFormat: d => `$${d / 1000}k`, orient: "left" }],
  type: waterfallInteractive,
  oLabel: d => <text transform="rotate(45)">{d}</text>,
  margin: { left: 60, top: 20, bottom: 100, right: 20 },
  oPadding: 40,
  pieceHoverAnnotation: true,
  tooltipContent: d => <div className="tooltip-content"><p>{d.name}</p><p>{d.value}</p></div>,
  data: [
    { name: "Product Revenue", value: 42000 },
    { name: "Services Revenue", value: 21000 },
    { name: "Fixed Costs", value: -17000 },
    { name: "Variable Costs", value: -14000 },
    { name: "Other Costs", value: -10000 },
    { name: "Ransoms", value: 10000 },
    { name: "Cat Rental", value: 10000 },
    { name: "Total" }
  ]
}

function waterfall({ data, rScale, adjustedSize }) {
  const renderedPieces = []
  let currentY = 0
  let currentValue = 0
  const zeroValue = rScale(0)

  const formatLabel = (name, value) => {
    let label = `${(name === "Total" ? Math.abs(value) : value) / 1000}k`

    if (label[0] === "-") {
      label = label[0] + "$" + label.slice(1)
    } else {
      label = "$" + label
    }
    return label
  }

  const fillRule = d =>
    d.column === "Total" ? purple : d.value > 0 ? green : red

  const keys = Object.keys(data)

  keys.forEach(key => {
    //assume only one per column though...
    const thisPiece = data[key].pieceData[0]
    let value = thisPiece.value
    const name = thisPiece.data.name
    if (name === "Total") {
      value = -currentValue
    } else {
      currentValue += value
    }
    const thisColumn = data[name]

    const { x, width } = thisColumn
    const height = rScale(value) - zeroValue

    let y = adjustedSize[1] - height
    if (height < 0) {
      y = adjustedSize[1]
    }
    y += currentY

    const svgElements = []

    svgElements.push(
      <rect
        height={Math.abs(height)}
        x={x}
        y={y}
        width={width}
        style={{ fill: fillRule(thisPiece) }}
      />
    )
    const lineY = name === "Total" || value > 0 ? y : y + Math.abs(height)

    if (name !== "Total") {
      svgElements.push(
        <line
          x1={x + width}
          x2={x + width + frameProps.oPadding}
          y1={lineY}
          y2={lineY}
          style={{ stroke: "gray", strokeDasharray: "5 5" }}
        />
      )
    }
    const textOffset = name === "Total" || value > 0 ? 15 : -5
    svgElements.push(
      <text
        x={x + width / 2}
        y={lineY + textOffset}
        style={{ fontSize: "10px", textAnchor: "middle", fill: "white" }}
      >
        {formatLabel(name, value)}
      </text>
    )
    renderedPieces.push(<g>{svgElements}</g>)

    currentY -= height
  })

  return renderedPieces
}

function waterfallInteractive({ data, rScale, adjustedSize }) {
  const renderedPieces = []
  let currentY = 0
  let currentValue = 0
  const zeroValue = rScale(0)

  const formatLabel = (name, value) => {
    let label = `${(name === "Total" ? Math.abs(value) : value) / 1000}k`

    if (label[0] === "-") {
      label = label[0] + "$" + label.slice(1)
    } else {
      label = "$" + label
    }
    return label
  }

  const fillRule = d =>
    d.column === "Total" ? purple : d.value > 0 ? green : red

  const keys = Object.keys(data)

  keys.forEach(key => {
    //assume only one per column though...
    const thisPiece = data[key].pieceData[0].data
    let value = thisPiece.value
    const name = thisPiece.name
    if (name === "Total") {
      value = -currentValue
    } else {
      currentValue += value
    }
    const thisColumn = data[name]

    const { x, width } = thisColumn
    const height = rScale(value) - zeroValue

    let y = adjustedSize[1] - height
    if (height < 0) {
      y = adjustedSize[1]
    }
    y += currentY

    const markObject = {
      o: key,
      piece: thisPiece,
      renderElement: {
        markType: "g",
        children: []
      },
      xy: {
        x: x + width / 2,
        y: y
      }
    }

    renderedPieces.push(markObject)

    markObject.renderElement.children.push(
      <rect
        height={Math.abs(height)}
        x={x}
        y={y}
        width={width}
        style={{ fill: fillRule(thisPiece) }}
      />
    )
    const lineY = name === "Total" || value > 0 ? y : y + Math.abs(height)

    if (name !== "Total") {
      markObject.renderElement.children.push(
        <line
          x1={x + width}
          x2={x + width + frameProps.oPadding}
          y1={lineY}
          y2={lineY}
          style={{ stroke: "gray", strokeDasharray: "5 5" }}
        />
      )
    }
    const textOffset = name === "Total" || value > 0 ? 15 : -5
    markObject.renderElement.children.push(
      <text
        x={x + width / 2}
        y={lineY + textOffset}
        style={{ fontSize: "10px", textAnchor: "middle", fill: "white" }}
      >
        {formatLabel(name, value)}
      </text>
    )

    currentY -= height
  })

  return renderedPieces
}


const overrideProps = {
  oLabel: `d => <text transform="rotate(45)">{d}</text>`,
  type: "waterfall",
  waterfall: `
function waterfall({ data, rScale, adjustedSize }) {
  const renderedPieces = []
  let currentY = 0
  let currentValue = 0
  const zeroValue = rScale(0)

  const formatLabel = (name, value) => {
    let label = \`\${(name === "Total" ? Math.abs(value) : value) / 1000}k\`

    if (label[0] === "-") {
      label = label[0] + "$" + label.slice(1)
    } else {
      label = "$" + label
    }
    return label
  }

  const fillRule = d =>
    d.column === "Total" ? purple : d.value > 0 ? green : red

  const keys = Object.keys(data)

  keys.forEach(key => {
    //assume only one per column though...
    const thisPiece = data[key].pieceData[0]
    let value = thisPiece.value
    const name = thisPiece.data.name
    if (name === "Total") {
      value = -currentValue
    } else {
      currentValue += value
    }
    const thisColumn = data[name]

    const { x, width } = thisColumn
    const height = rScale(value) - zeroValue

    let y = adjustedSize[1] - height
    if (height < 0) {
      y = adjustedSize[1]
    }
    y += currentY

    const svgElements = []

    svgElements.push(
      <rect
        height={Math.abs(height)}
        x={x}
        y={y}
        width={width}
        style={{ fill: fillRule(thisPiece) }}
      />
    )
    const lineY = name === "Total" || value > 0 ? y : y + Math.abs(height)

    if (name !== "Total") {
      svgElements.push(
        <line
          x1={x + width}
          x2={x + width + frameProps.oPadding}
          y1={lineY}
          y2={lineY}
          style={{ stroke: "gray", strokeDasharray: "5 5" }}
        />
      )
    }
    const textOffset = name === "Total" || value > 0 ? 15 : -5
    svgElements.push(
      <text
        x={x + width / 2}
        y={lineY + textOffset}
        style={{ fontSize: "10px", textAnchor: "middle", fill: "white" }}
      >
        {formatLabel(name, value)}
      </text>
    )
    renderedPieces.push(<g>{svgElements}</g>)

    currentY -= height
  })

  return renderedPieces
}`
}

const overridePropsInteractive = {
  oLabel: `d => <text transform="rotate(45)">{d}</text>`,
  type: "waterfallInteractive",
  waterfallInteractive: `
function waterfall({ data, rScale, adjustedSize }) {
  const renderedPieces = []
  let currentY = 0
  let currentValue = 0
  const zeroValue = rScale(0)

  const formatLabel = (name, value) => {
    let label = \`\${(name === "Total" ? Math.abs(value) : value) / 1000}k\`

    if (label[0] === "-") {
      label = label[0] + "$" + label.slice(1)
    } else {
      label = "$" + label
    }
    return label
  }

  const fillRule = d =>
    d.column === "Total" ? purple : d.value > 0 ? green : red

  const keys = Object.keys(data)

  keys.forEach(key => {
    //assume only one per column though...
    const thisPiece = data[key].pieceData[0].data
    let value = thisPiece.value
    const name = thisPiece.name
    if (name === "Total") {
      value = -currentValue
    } else {
      currentValue += value
    }
    const thisColumn = data[name]

    const { x, width } = thisColumn
    const height = rScale(value) - zeroValue

    let y = adjustedSize[1] - height
    if (height < 0) {
      y = adjustedSize[1]
    }
    y += currentY

    const markObject = {
      o: key,
      piece: thisPiece,
      renderElement: {
        markType: "g",
        children: []
      },
      xy: {
        x: x + width / 2,
        y: y
      }
    }

    renderedPieces.push(markObject)

    markObject.renderElement.children.push(
      <rect
        height={Math.abs(height)}
        x={x}
        y={y}
        width={width}
        style={{ fill: fillRule(thisPiece) }}
      />
    )
    const lineY = name === "Total" || value > 0 ? y : y + Math.abs(height)

    if (name !== "Total") {
      markObject.renderElement.children.push(
        <line
          x1={x + width}
          x2={x + width + frameProps.oPadding}
          y1={lineY}
          y2={lineY}
          style={{ stroke: "gray", strokeDasharray: "5 5" }}
        />
      )
    }
    const textOffset = name === "Total" || value > 0 ? 15 : -5
    markObject.renderElement.children.push(
      <text
        x={x + width / 2}
        y={lineY + textOffset}
        style={{ fontSize: "10px", textAnchor: "middle", fill: "white" }}
      >
        {formatLabel(name, value)}
      </text>
    )

    currentY -= height
  })

  return renderedPieces
}`
}

const WaterfallChart = () => {
  return (
    <div>
      <MarkdownText
        text={`
This demonstrates how to use a custom \`type\` to render \`data\` for an unsupported layout.

To accomodate this new chart type, you also need to manually calculate the extent.

The data in this chart is ficticious.

`}
      />
      <DocumentFrame
        frameProps={frameProps}
        overrideProps={overrideProps}
        functions={{
          waterfall
        }}
        pre={`const purple = "${purple}"
const green = "${green}"
const red = "${red}"`}
        type={OrdinalFrame}
        useExpanded
      />

<MarkdownText
        text={`
  If you want to enable interactivity you need to do a little more work. Because Semiotic doesn't know the dimensions of the elements you've generated your custom function needs to send back more than just an array of SVG elements.

  Instead, you need to send back an array of JSON objects that follow this structure:
  
  An \`o\` property that is a string that corresponds to the ordinal value of the row/column.

  A \`piece\` property that is a JSON object with the data that you want to pass through to \`tooltipContent\` or \`customClickBehavior\` or similar function.

  An \`xy\` property that is a JSON object with \`x\` and \`y\` properties that correspond to the screen position where you want a tooltip to display (and which will also act as the voronoi point for the interaction layer).

  A \`renderElement\` property that is a valid React Node that is the mark or glyph being rendered.

  `}
      />
      <DocumentFrame
        frameProps={framePropsInteractive}
        overrideProps={overridePropsInteractive}
        functions={{
          waterfall
        }}
        pre={`const purple = "${purple}"
const green = "${green}"
const red = "${red}"`}
        type={OrdinalFrame}
        useExpanded
      />
      
    </div>
  )
}

export default WaterfallChart
