import React from "react";
import MarkdownText from "../MarkdownText";

export default () => {
  return (
    <div>
      <MarkdownText
        text={`
      
How to use the highlight annotation type on its own to highlight a hovered item or in tandem to achieve cross-highlighting. Move your mouse over things.

There is a built-in annotation type "highlight" that you can use in your annotations or pass in your hoverAnnotation array. In XYFrame it uses the function in lineIDAccessor to evaluate what objects to highlight and will render that shape (or shapes) in the AnnotationLayer with style and class defined by the annotation. Style can be a React style object or function returning a React style object and class can be a string or function returning a string. All highlight annotations created in the annotation layer will always have "highlight-annotation" class in addition to any passed classes.

Move your mouse over the chart to see the region highlighted.
      

## Dynamic Styles

The annotation honors a style prop that can be a React style object or a function that returns a React style object and evaluates the annotation. Because dynamically produced hover annotations are generated with the hover item's data, this lets you create custom styles. This also passes a frame-hover to the hoverAnnotation settings, showing off the ability to pass multiple annotation types to hoverAnnotation. Nothing else is changed from the previous example.

## Cross Highlighting
Frames have custom interaction using customHoverBehavior, customClickBehavior and customDoubleClickBehavior. You can use these to take the value of the hovered or clicked item and pass a highlight annotation made from that data object to the annotations property of another frame to achieve cross-highlighting. These two frames have different sizes and different lineTypes but otherwise the only change is in the


## Point and Area Highlighting
Highlight annotations will return all points, lines and areas that match the id value of the passed highlight. This can be used to highlight multiple shapes if your lineIDAccessor is sophisticated (or simple) enough. Here I check in lineIDAccessor not only for title but if the object has a parentLine (indicating a point generated by showLinePoints) to match against the parentLine title value.

## OrinalFrame Highlighting
OrdinalFrames get highlighting, too. The second example uses classes with a defined gradient in CSS. Unlike in XYFrame, there's already one built-in id accessor in OrdinalFrame: oAccessor, additionally if you define a pieceIDAccessor you can use that to highlight individual pieces (this is the same property used to annotate specific pieces with other OrdinalFrame annotatinos). Without a pieceIDAccessor defined, all items in a column/row will be highlighted.

Highlighting is not available for custom graphics or summary graphics.

## Highlighting Across Categories 
You don't have to send annotations with valid oAccessor or pieceIDAccessor traits. If you do, they will highlight all the pieces that satisfy the one you do send. This example has two annotations sent that highlight all the pieces in one column as well as all pieces of a certain type across all four columns.

## Scatterplot Highlighting 
      `}
      />
    </div>
  );
};
