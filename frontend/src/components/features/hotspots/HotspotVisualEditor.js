import React from "react";
import useHotspotVisualEditorLogic from "./HotspotVisualEditor.logic";
import HotspotVisualEditorView from "./HotspotVisualEditor.jsx";

export default function HotspotVisualEditor(props) {
  const logic = useHotspotVisualEditorLogic(props);
  return <HotspotVisualEditorView {...props} {...logic} />;
}
