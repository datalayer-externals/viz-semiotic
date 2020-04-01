import React from "react"
import { mount } from "enzyme"
import AnnotationLayer from "./AnnotationLayer"

const svgAnnotationRule = () => <g><text>Just a blank</text></g>
const htmlAnnotationRule = () => <div>Just a blank</div>
const voronoiHover = () => { }

const annotations = [
    { type: "react-annotation", label: "first", x: 5, y: 5 },
    { type: "frame-hover", label: "hover" }
]

describe("AnnotationLayer", () => {
    it("renders without crashing", () => {
        mount(<AnnotationLayer
            margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
            size={[400, 400]}
            useSpans={false}
            annotations={annotations}
            svgAnnotationRule={svgAnnotationRule}
            htmlAnnotationRule={htmlAnnotationRule}
            voronoiHover={voronoiHover}
        />)
    })

    const mountedLayerWithOptions = mount(
        <AnnotationLayer
            margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
            size={[400, 400]}
            useSpans={false}
            annotations={annotations}
            svgAnnotationRule={svgAnnotationRule}
            htmlAnnotationRule={htmlAnnotationRule}
            voronoiHover={voronoiHover}
        />
    )
    it("creates a div and an SVG with annotations", () => {
        expect(mountedLayerWithOptions.find("svg").length).toEqual(1)
        //        expect(mountedLayerWithOptions.find("g.annotation").length).toEqual(1)
    })

})
