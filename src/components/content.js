import React from "react";
import { CSVLink } from "react-csv";
import Toolbox from "./toolbox";
import ValuesPanel from "./values-panel";
import { ExportCSV } from './ExportCSV';
import { MyUploader } from './MyUploader';
import { uploadImageToCanvas } from './uploadImageToCanvas'
import $ from 'jquery';
import './jquery.loupe.min.js'

export default class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawing: false,
      isGistogramAnalyzed: false,
      offsetX: 0,
      offsetY: 0,
      startX: 0,
      startY: 0,
      width: 0,
      height: 0,
      histogram: [],
      graphData: [0],
      BottomHistogram: 0,
      TopHistogram: 0,
      MinimumX: 0,
      MaximumX: 0,
      MinimumY: 0,
      MaximumY: 0,
      XValues: [],
      YValues: [],
      filename: "",
    };
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.canvasRef = React.createRef();
    this.canvasOverlayRef = React.createRef();
    this.ctx = null;
    this.overlayCtx = null;
    this.download = this.download.bind(this);
    this._handleChange = this._handleChange.bind(this);
  }

  download() {
    console.log(this.ctx);
    console.log("getImageData:");
    let image = new Image();
    image.src = "https://res.cloudinary.com/satvasolutions-com/image/upload/v1528968358/Combine-Asp.net-Identity-Web-Api-and-MVC-Best-in-a-Single-Web-App_nzzbqs_szh44c.jpg"
    console.log(image.src);
    image.crossOrigin = "Anonymous";
    image.onload = () => {
      //console.log(this.image);
      this.ctx.drawImage(image, 0, 0);
      let imgData2 = this.ctx.getImageData(50, 50, 5, 5);
      console.log(imgData2);
      //console.log(this.ctx)
    };
    console.log("color:");
  }
  _handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: Number(value)
    });
  }

  componentDidMount() {
    const script = document.createElement("script");
    script.src = "https://redopop.com/loupe/jquery.loupe.min.jss";
    script.async = true;
    document.body.appendChild(script);
    let canvasRef = this.canvasRef.current;
    let canvasOverlayRef = this.canvasOverlayRef.current;
    let canvasRect = canvasRef.getBoundingClientRect();
    this.ctx = canvasRef.getContext("2d");
    console.log("ctx", this.ctx);
    this.ctxOverlay = canvasOverlayRef.getContext("2d");
    this.setState({ offsetX: canvasRect.left, offsetY: canvasRect.top });
    // let image = new Image();
    // image.setAttribute('crossOrigin', '');
    // image.src="https://hansenjohnson.org/post/2018-03-02-spectrograms-in-r_files/figure-html/main-1.png"
    // console.log(this.image);
    // image.onload = () => {
    //   this.ctx.drawImage(image, 0, 0, image.width*0.5, image.height*0.5);
    // };
  }
  analyzeGraph(_startX, _startY, _width, _height, minX, maxX, minY, maxY) {
    let imgData = this.ctx.getImageData(_startX, _startY, _width, _height);
    let array = new Array();
    let RGBA = 4;
    console.log("getting_data_width", _width);
    console.log("getting_data_height", _height);
    for (let i = 0; i < imgData.data.length; i += Number(RGBA)) {
      array.push([imgData.data[i], imgData.data[i + 1], imgData.data[i + 2], imgData.data[i + 3]])
    }
    console.log("getting", array.length)
    array = array.slice(_width, array.length - _width);
    for (let i = array.length - 1; i >= 0; i = i - 1) {
      if ((i % Number(_width) == 0) || (i % Number(_width) == (_width - 1))) {
        array.splice(i, 1);
      }
    }
    _width = _width - 2;
    _height = _height - 2;
    console.log("after1del_data_width", _width);
    console.log("after1del_data_height", _height);
    console.log("after1del", array.length)
    let whitecode = 237;
    let imageLocationStart = 0;
    let StartImagePositionHeight = 1;
    let EndImagePositionHeight = _height;
    let centerHeightPositionInArrayOfColors = Number((_height / 2.0).toFixed());
    let StartImagePositionWidth = 0;
    let EndImagePositionWidth = _width;
    let centerWidthPositionInArrayOfColor = Number((_width / 2.0).toFixed());
    let RecognizedData = [];
    //StartH
    for (let i = centerWidthPositionInArrayOfColor; i < array.length; i = Number(i) + _width) {
      if (array[i][0] >= whitecode && array[i][1] >= whitecode && array[i][2] >= whitecode) {
        StartImagePositionHeight = StartImagePositionHeight + 1;
      }
      else
        break;
    }
    //EndH
    for (let i = array.length - centerWidthPositionInArrayOfColor; i > 0; i = Number(i) - _width) {
      if (array[i][0] >= whitecode && array[i][1] >= whitecode && array[i][2] >= whitecode) {
        EndImagePositionHeight = EndImagePositionHeight - 1;
      }
      else
        break;
    }
    //StartW
    for (let i = centerHeightPositionInArrayOfColors * _width; i < centerHeightPositionInArrayOfColors * _width + _width; i = i + 1) {
      if (array[i][0] >= whitecode && array[i][1] >= whitecode && array[i][2] >= whitecode) {
        StartImagePositionWidth = StartImagePositionWidth + 1;
      }
      else
        break;
    }
    //EndW
    for (let i = centerHeightPositionInArrayOfColors * _width + _width; i > centerHeightPositionInArrayOfColors * _width; i = i - 1) {
      if (array[i][0] >= whitecode && array[i][1] >= whitecode && array[i][2] >= whitecode) {
        EndImagePositionWidth = EndImagePositionWidth - 1;
      }
      else
        break;
    }
    console.log("StartImagePositionHeight", StartImagePositionHeight);
    console.log("EndImagePositionHeight", EndImagePositionHeight);
    console.log("StartImagePositionWidth", StartImagePositionWidth);
    console.log("EndImagePositionWidth", EndImagePositionWidth);
    //EndOfAll
    for (let i = 0; i < array.length; i = i + 1) {
      if (array[i][0] >= whitecode && array[i][1] >= whitecode && array[i][2] >= whitecode) {
        continue
      }
      else {
        if ((i % Number(_width) == 0) || (i % Number(_width) == (_width - 1))) {
          continue;
        }
        else {
          imageLocationStart = i;
          break;
        }
      }
    }
    let ImageArray = new Array();
    for (let i = imageLocationStart; i < (imageLocationStart + _width * (EndImagePositionHeight - StartImagePositionHeight - 1) - (EndImagePositionWidth - StartImagePositionWidth)); i = i + _width) {
      for (let jj = i; jj < i + (EndImagePositionWidth - StartImagePositionWidth); jj = jj + 1) {
        ImageArray.push(array[jj]);
      }
    }
    console.log("del white", ImageArray)
    _width = EndImagePositionWidth - StartImagePositionWidth;
    _height = EndImagePositionHeight - StartImagePositionHeight - 1;
    ImageArray = ImageArray.slice(_width, ImageArray.length - _width);
    for (let i = ImageArray.length - 1; i >= 0; i = i - 1) {
      if ((i % Number(_width) == 0) || (i % Number(_width) == (_width - 1))) {
        //console.log("i", i);
        ImageArray.splice(i, 1);
      }
    }
    _width = _width - 2;
    _height = _height - 2;
    //this.findValueInHist(_width, _height);

    let appendX = (maxX - minX) / _width;
    let appendY = (maxY - minY) / _height;
    let yValue = maxY;
    let xValue = maxX;
    let XArray = new Array();
    let YArray = new Array();
    for (let i = 0; i < _width; i++) {
      XArray.push(xValue);
      xValue = xValue - appendX;
    }
    for (let i = 0; i < _height; i++) {
      YArray.push(yValue);
      yValue = yValue - appendY;
    }
    this.setState({
      XValues: XArray,
      YValues: YArray,
    });
    // for (let i=0; i<ImageArray.length; i=i+1)
    // {
    //   if(i!=0)
    //   {
    //     if (i%_width==0)
    //     {
    //       yValue=yValue-appendY;
    //       xValue=minX;
    //     }
    //     else
    //     {
    //       xValue=minX+appendX;
    //     }
    //   }
    //   ImageArray[i][4]=xValue;
    //   ImageArray[i][5]=yValue
    // }
    this.findValueInHist(_width, _height, ImageArray, XArray, YArray);
  }
  findValueInHist(_widthImage, _heightImage, ImageArray, XArray, YArray) {
    //Sort set
    let resultOfRecognizing = new Array();
    let currentColor;
    let currentValue;
    for (let i = 0; i < ImageArray.length; i++) {
      currentColor = [ImageArray[i][0], ImageArray[i][1], ImageArray[i][2], ImageArray[i][3]];
      currentValue = this.state.histogram.filter(curretArrayElem => { curretArrayElem[0] == currentColor[0] && curretArrayElem[1] == currentColor[1] && curretArrayElem[2] == currentColor[2] });
      if (currentValue.length != 0) {
        //Править не работает
        console.log("Нашли точно")
        resultOfRecognizing.push(currentValue[4]);
      }
      else {
        for (let DifferenceValue = 1; DifferenceValue < 255; DifferenceValue++)
          for (let i = 0; i < this.state.histogram.length; i++) {
            if (this.AbsoluteDifference(this.state.histogram[i], currentColor, Number(DifferenceValue))) {
              resultOfRecognizing.push(this.state.histogram[i][4]);
              DifferenceValue = 255;
              break;
            }
          }
      }
    }
    console.log("width", _widthImage);
    console.log("resultOfRecognizing", resultOfRecognizing);
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + '-' + today.getMinutes() + '-' + today.getSeconds();
    let dateTime = date + ' ' + time;
    console.log(dateTime);
    console.log("XArray.length", XArray.length);
    console.log("YArray.length", YArray.length);
    console.log("res of recog size", resultOfRecognizing.length);
    let size = YArray.length;
    let subarrayResultOfRecognizing = []; //массив в который будет выведен результат.
    for (let i = 0; i < Math.ceil(resultOfRecognizing.length / size); i++) {
      subarrayResultOfRecognizing[i] = resultOfRecognizing.slice((i * size), (i * size) + size);
    }
    console.log("subarrayResultOfRecognizing", subarrayResultOfRecognizing.length);
    console.log("XArray", XArray.length);
    for (let i = 0; i < subarrayResultOfRecognizing.length; i++) {
      subarrayResultOfRecognizing[i].unshift(XArray[i]);
    }
    console.log("subarrayResultOfRecognizing", subarrayResultOfRecognizing);
    XArray.unshift(0);
    console.log(XArray);
    const ret = subarrayResultOfRecognizing.map((x) => {
      return x.reduce((prev, c, i) => {
        const p = prev;
        p[XArray[i]] = c;
        return p;
      }, {});
    });
    console.log("ret", ret);
    this.setState({ graphData: ret, fileName: dateTime });

    //save as xls
    //get to user


  }
  AbsoluteDifference(histColor, color, value) {
    let isSimilar = false;
    let Red = 0;
    let Green = 1;
    let Blue = 2;
    let Alpha = 3;
    if ((Math.abs(color[Red] - histColor[Red]) < value) && (Math.abs(color[Green] - histColor[Green]) < value) && (Math.abs(color[Blue] - histColor[Blue]) < value)) {
      //&&(Math.abs(color[Alpha]-histColor[Alpha])<value)
      isSimilar = true;
    }
    return isSimilar;
  }
  analyzeHistogram(_startX, _startY, _width, _height, minValue, maxValue) {
    let imgData = this.ctx.getImageData(_startX, _startY, _width, _height);
    let RGBA = 4;
    let centerPositionInArrayOfColors = Number((_width / 2.0).toFixed() * Number(RGBA));
    let set = new Set();
    for (let i = centerPositionInArrayOfColors; i < imgData.data.length; i = Number(i) + Number(_width * RGBA)) {
      set.add([imgData.data[i], imgData.data[i + 1], imgData.data[i + 2], imgData.data[i + 3]])
    }
    let iterator = set.values();
    let valueForDelete = iterator.next();
    set.delete(valueForDelete);
    let arr = Array.from(set);
    let NewSet = arr.filter(function (value) { return (value[0] != 255 && value[1] != 255 && value[2] != 255); });
    NewSet = NewSet.slice(2, arr.length - 6);
    let append = Number((maxValue - minValue) / NewSet.length);
    let histogramValue = maxValue;
    for (let i = 0; i < NewSet.length; i++) {
      NewSet[i][4] = histogramValue;
      histogramValue = histogramValue - append;
    }
    console.log("hist complete");
    this.setState({ histogram: NewSet });
  }

  handleMouseDown(e) {
    let ctx = this.ctx;
    let ctxOverlay = this.ctxOverlay;
    let activeItem = this.props.activeItem;
    if (activeItem != "Loop" && activeItem != "Sheet" && activeItem != "Data") {
      this.setState({ isDrawing: true });
      ctx.beginPath();
      ctx.strokeStyle = this.props.color;
      ctx.lineWidth = 1;
      ctx.lineJoin = ctx.lineCap = "round";
    }


    if (activeItem === "Pencil" || activeItem === "Brush") {
      ctx.moveTo(
        e.clientX - this.state.offsetX,
        e.clientY - this.state.offsetY
      );
      if (activeItem === "Brush") ctx.lineWidth = 5;
    } else if (activeItem === "Line" || activeItem === "Rectangle") {
      ctxOverlay.strokeStyle = this.props.color;
      ctxOverlay.lineWidth = 1;
      ctxOverlay.lineJoin = ctx.lineCap = "round";
      this.setState({
        startX: e.clientX - this.state.offsetX,
        startY: e.clientY - this.state.offsetY
      });
    }
    else if (activeItem === "Erase") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.arc(e.clientX - this.state.offsetX, e.clientY - this.state.offsetY, 1.5, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.moveTo(
        e.clientX - this.state.offsetX,
        e.clientY - this.state.offsetY
      );
      if (activeItem === "Brush") ctx.lineWidth = 3;
    }
  }

  handleMouseMove(e) {
    let ctx = this.ctx;
    let ctxOverlay = this.ctxOverlay;
    if (this.state.isDrawing) {
      if (
        this.props.activeItem === "Pencil" ||
        this.props.activeItem === "Brush"
      ) {
        ctx.lineTo(
          e.clientX - this.state.offsetX,
          e.clientY - this.state.offsetY
        );
        ctx.stroke();
      }
      if (this.props.activeItem === "Line") {
        ctx.beginPath();
        ctx.moveTo(this.state.startX, this.state.startY);
        ctx.lineTo(
          e.clientX - this.state.offsetX,
          e.clientY - this.state.offsetY
        );
        ctx.stroke();
        ctx.closePath();
      }
      if (this.props.activeItem === "Rectangle") {
        this.setState({ width: e.clientX - this.state.offsetX - this.state.startX });
        this.setState({ height: e.clientY - this.state.offsetY - this.state.startY });
      }
      if (this.props.activeItem === "Erase") {
        ctx.lineTo(
          e.clientX - this.state.offsetX,
          e.clientY - this.state.offsetY
        );
        ctx.stroke();
      }
    }
    else {
      if (this.props.activeItem === "Loop") {

        window.$ = window.jQuery = require('jquery')
        console.log(window.$)
        window.$('graph').loupe();
      }
    }
  }

  handleMouseUp(e) {
    let ctx = this.ctx;
    if (this.props.activeItem === "Line") {
      ctx.moveTo(this.state.startX, this.state.startY);
      ctx.lineTo(
        e.clientX - this.state.offsetX,
        e.clientY - this.state.offsetY
      );
      ctx.stroke();
    }

    if (this.props.activeItem === "Rectangle") {
      ctx.strokeRect(this.state.startX, this.state.startY, this.state.width, this.state.height);
      this.setState({ height: e.clientY - this.state.offsetY - this.state.startY });
      console.log("startx2", this.state.startX);
      console.log("starty2", this.state.startY);
      console.log("widht2", this.state.width);
      console.log("height2", this.state.height);
      let _width = this.state.width;
      let _startX = this.state.startX;
      if ((_width) < 0) {
        _startX = _startX + _width;
        _width = -_width;
      }
      let _height = this.state.height;
      let _startY = this.state.startY;
      if ((_height) < 0) {
        _startY = _startY + _height;
        _height = -_height;
      }
      if (this.state.isGistogramAnalyzed == false) {
        this.analyzeHistogram(_startX, _startY, _width, _height, this.state.BottomHistogram, this.state.TopHistogram);
        this.setState({ isGistogramAnalyzed: true });
      }
      else {
        this.analyzeGraph(_startX, _startY, _width, _height, this.state.MinimumX, this.state.MaximumX, this.state.MinimumY, Number(this.state.MaximumY));
        this.setState({ isGistogramAnalyzed: false });
      }
    }
    ctx.closePath();
    this.setState({ isDrawing: false });
  }
  render() {
    return (
      <div>
        <div className="content">
          <Toolbox
            items={this.props.items}
            activeItem={this.props.activeItem}
            handleClick={this.props.handleClick}
          />
          <div className="canvas">
            <canvas
              id="graph"
              className="canvas-actual"
              width="800px"
              height="480px"
              ref={this.canvasRef}
              onMouseDown={this.handleMouseDown}
              onMouseMove={this.handleMouseMove}
              onMouseUp={this.handleMouseUp}
            >
            </canvas>
            <canvas
              className="canvas-overlay"
              width="900px"
              height="480px"
              ref={this.canvasOverlayRef}
            />
          </div>
        </div>
        <MyUploader valueChange={this.ctx}></MyUploader>
      </div>
    );
  }
}
