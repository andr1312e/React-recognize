import React from "react";

import MenuBar from "./menu-bar";
import Content from "./content";
import ColorPanel from "./color-panel";
import ValuesPanel from "./values-panel";

const defaultColor = "black";
const defaultTool = "Pencil";

import pencil from "../images/pencil.svg";
import line from "../images/line.svg";
import brush from "../images/brush.svg";
import loop from "../images/loop.svg";
import rectangle from "../images/rectangle.svg";
import text from "../images/text.svg";
import download from "../images/download.svg";
import erase from "../images/erase.svg";
import picker from "../images/picker.svg";

const toolbarItems = [
  { name: "Pencil", image: pencil },
  { name: "Line", image: line },
  { name: "Brush", image: brush },
  { name: "Loop", image: loop },
  { name: "Text", image: text },
  { name: "Rectangle", image: rectangle },
  { name: "Download", image: download },
  { name: "Erase", image: erase },
  { name: "Picker", image: picker }
];

const menuItems = [
  { name: "Open File" },
  { name: "Delete File" },
  { name: "Erase all" },
  { name: "Export to xlsx" },
  { name: "View graphics" },

]

export default class ReactPaint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: defaultColor,
      selectedItem: defaultTool,
      toolbarItems: toolbarItems,
      menuItems: menuItems
    };
    this.changeColor = this.changeColor.bind(this);
    this.changeTool = this.changeTool.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
  }

  changeColor(event) {
    this.setState({ color: event.target.style.backgroundColor });
  }

  handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      //Компонент контент присванивание файла
      // this.setState({
      //   file: file,
      // });
    }

    reader.readAsDataURL(file)
  }

  changeTool(event, tool) {
    if (tool != "Download") {
      this.setState({ selectedItem: tool });
    }
    console.log(event);
    //this.handleImageChange(event);
    console.log(tool);
  }

  render() {
    return (
      <React.Fragment>
        <Content
          items={this.state.toolbarItems}
          activeItem={this.state.selectedItem}
          handleClick={this.changeTool}
          color={this.state.color}
        />
        <ColorPanel
          selectedColor={this.state.color}
          handleClick={this.changeColor}
        />
      </React.Fragment>
    );
  }
}
