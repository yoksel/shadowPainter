// "use strict";

var line = "------------------------";
//console.log( "Hello!" );

function shadowPainter() {
  var doc = document;

  var timer = 0;
  var isMousePressed = false;

  var classNames = {
    wrapper: ".l-wrapper",
    paintBox: ".b-box--paint",
    resultBox: ".b-box--result",
    resultDot: ".b-box--result .dot",
    palette: ".b-palette",
    steps: ".b-steps",

    codes: ".b-codes",
    codesToggle: ".b-codes__toggle",
    codesCss: ".textarea--css",
    codesHtml: ".textarea--html",

    durationInp: ".text--duration",
    sizeInp: ".text--size",
    dotsInp: ".text--dots"
  };

  var Elems = {};

  var Cell = {
    className: "cell",
    inputType: "checkbox",
    inputClass: "cell__inp",
    labelClass: "cell__lbl",
    inputData: "data-hpos=\"{hpos}\"  data-vpos=\"{vpos}\" ",
    labelContent: "",
    dots: "<span class=\"dot dot--previous\"></span><span class=\"dot\"></span>"
  };

  var Palettes = [
      ["#3FB8AF","#7FC7AF","#DAD8A7","#FF9E9D","#FF3D7F"],
      ["#468966","#FFF0A5","#FFB03B","#B64926","#8E2800"],
      ["#004358","#1F8A70","#BEDB39","#FFE11A","#FD7400"],
      ["#96CA2D","#B5E655","#EDF7F2","#4BB5C1","#7FC6BC"],
      ["#2E0927","#D90000","#FF2D00","#FF8C00","#04756F"],
      ["#FCFFF5","#D1DBBD","#91AA9D","#3E606F","#193441"],
      ["#332532","#644D52","#F77A52","#FF974F","#A49A87"]
    ];

  var Color = {
    className: "color",
    inputType: "radio",
    inputClass: "color__inp",
    inputData: "data-color=\"{color}\" ",

    labelContent: "",
    controlClass: "colors-controls__item",
    transparent: "rgba(255,255,255,0)",
    currentNum: 0,
  };

  Color.currentListNum = 0;
  Color.list = Palettes[Color.currentListNum];

  Color.current = Color.list[0];
  Color.classCurrent = Color.className + "--" + Color.currentNum;

  Color.StyleTempl = "." + Color.className + "--{i} {background: {color};}\n";
  Color.controlTempl = "<li class=\"{itemsClass} {itemsClass}-{direction}\" data-direction=\"{direction}\"></li>";

  Color.upDown = {
    list: {
      "up": "",
      "down": ""
    },
    replacements: {
      "{itemsClass}": Color.controlClass
    },
    template: "<li class=\"{itemsClass} {itemsClass}--{action}\" data-action=\"{action}\"></li>"
  };

  var Step = {
    className: "step",
    inputType: "radio",
    inputClass: "step__inp",
    inputData: "",
    labelContent: "{i+1}",
    controlClass: "steps-control",
    clearFramesClass: "frames-clear",

    currentNum: 0,
    customClass: "{customClass}",
    hiddenClass: "is-hidden",
    disabledClass: "is-disabled"
  };
  Step.plusMinus = {
    list: {
      "minus": "&ndash;",
      "plus": "+"
    },
    replacements: {
      "{itemsClass}": Step.controlClass
    },
    template: "<span class=\"{itemsClass} {itemsClass}--{action}\" data-action=\"{action}\">{text}</span>",
    insertBetween: "Frames"
  };

  Step.clearFrames = {
    list: {
      "current": "Clear current frame",
      "all": "Clear all frames"
    },
    replacements: {
      "{itemsClass}": Step.clearFramesClass
    },
    template: "<span class=\"{itemsClass} {itemsClass}--{action}\" data-action=\"{action}\">{text}</span>"
  };


  var templatesConfig = [Cell, Color, Step];

  var stylesClassNames = {
    config: "configBox",
    shadows: "stylesBox",
    colors: "colorsBox"
  };
  var Styles = {};

  var Output = {
    HtML: "",
    Css: "",
    Animation: "",
    comment: "Created in shadowPainter : )"
  };

  var Scene = {
     oneSide: 5,// dottes in line
     oneSideMax: 30,// dottes in line
     size: 250,
     dotSize: 30,// pixels
     padding: 20,// pixels. Don't change it
     border: 1// pixels
  };

  var Anim = {
    steps: 5,
    stepsMax: 20,
    duration: "1s",
    name: "shadows",
    keyframes: findKeyFrames("shadows")
  };
  Anim.rules = Anim.keyframes.cssRules;

  var is_opened = false;// codes
  var classIsRunning = "is-running";

  var Frames = {};
  var currentFrame = 0;

  this.init = function(){


  this.createTemplates();
  this.createStylesBoxes();

  this.initElements();
  this.addConfig();
  this.createInputsSet();
  this.createFramesSet();
  this.createPalette();
  this.createSteps();
  this.createCodes();
  this.createDurationInp();
  this.createSizeInp();
  this.createDotsInp();
};


  // FUNCTIONS
  // -----------------------------------------


  function findKeyFrames(name){
    var keyFrames;
    for (var i = 0; i < doc.styleSheets.length; i++) {
      var stylesList = doc.styleSheets[i].cssRules;

      for (var k = 0; k < stylesList.length; k++) {
        if ( stylesList[k].name === name ){
          keyFrames = stylesList[k];
        }
      }
    }

    return keyFrames;
  }

  // -----------------------------------------

  function setTimer( func, params ) {
    if ( timer ){
      this.clearTimeout( timer );
    }
    var execFunc = function(){ func( params ) };
    timer = this.setTimeout( execFunc , 50);
  }

  // -----------------------------------------

  function getAnimStr() {
    return Anim.duration + " " + Anim.name + " linear infinite";
  }

  // -----------------------------------------

  this.initElements = function() {

    for ( var className in classNames ){
      Elems[className] = doc.querySelector(classNames[className]);
    }

  };

  // -----------------------------------------

  this.setParams = function() {

    Scene.dotSize = (Scene.size/Scene.oneSide);

    Scene.dotSize = Scene.dotSize.toFixed();
    Scene.size = Scene.dotSize * Scene.oneSide;

    this.configElemParams = {
      ".l-wrapper": {
        "width": 700, //size * 2 + Scene.padding * 3 + border*6
        "height": 490, //size + Scene.padding * 2 + border*4
      },
      ".b-boxes": {
        "height": 340
      },
      ".l-zero-gravity": {
        "height": Scene.size + Scene.border
      },
      ".b-box": {
        "width": Scene.size + Scene.border,
        "height": Scene.size
      },
      ".cell__lbl": {
        "width": Scene.dotSize,
        "height": Scene.dotSize
      },
      ".dot": {
        "width": Scene.dotSize,
        "height": Scene.dotSize,
        "top": "-" + Scene.dotSize,
        "left": "-" + Scene.dotSize
      },
      ".is-running": {
        "-webkit-animation": getAnimStr(),
        "animation": getAnimStr()
      },
      ".b-box--paint": {
        "background-size": Scene.dotSize + " " + Scene.dotSize
      }
    };
  };

  // -----------------------------------------

  this.setOutputParams = function () {
    this.outputElemParams = {
      ".box": {
        "position": "absolute",
        "top": "0",
        "bottom": "0",
        "left": "0",
        "right": "0",
        "margin": "auto",
        "width": Scene.size,
        "height": Scene.size,
        "overflow": "hidden",
        "border": "1px solid #DDD"
      },
      ".dot": {
        "display": "block",
        "position": "absolute",
        "width": Scene.dotSize,
        "height": Scene.dotSize,
        "top": "-" + Scene.dotSize,
        "left": "-" + Scene.dotSize,
        "-webkit-animation": getAnimStr(),
        "animation": getAnimStr()
      }
    };

  };

  // -----------------------------------------

  this.addConfig = function(){

    this.setParams();

    var styles = "";
    for ( var elem in this.configElemParams ){
      var className = elem;
      var elemStyles = "";
      var params = this.configElemParams[elem];
      for (var item in params){
        var value = addUnits( params[item], item );
        elemStyles += item + ": " + value + ";\n";
      }
      styles += className + " {\n" + elemStyles + "}\n";
    }

    Styles.config.innerHTML = styles;
  };


  // -----------------------------------------

  function addStylesBox(elemClass){
    var elem = doc.createElement( "style" );
    elem.classList.add( elemClass );
    var head = doc.querySelector( "head" );
    head.appendChild( elem );
    return elem;
  }

  // -----------------------------------------

  this.createStylesBoxes = function () {
     for ( var styleBox in stylesClassNames ){
        Styles[styleBox] = addStylesBox(stylesClassNames[styleBox]);
     }
  };

  // -----------------------------------------

  this.createTemplates = function(){

    for (var i = 0; i < templatesConfig.length; i++) {

      var item = templatesConfig[i];
      item.template = createTemplate ( item );

    }
  };

  // -----------------------------------------

  function createTemplate ( item ){

    var itemType = item.className;
    var inputType = item.inputType;
    var data_attr = item.inputData;
    var lblContent = item.labelContent;
    var itemCustomClass = item.customClass ? item.customClass : "";

    var itemInpClass = itemType + "__inp";
    var itemLblClass = itemType + "__lbl";

    var replacements = {
      "{inputType}": inputType,
      "{itemType}": itemType,
      "{itemClass}": itemType,
      "{itemLblClass}": itemLblClass,
      "{itemInpClass}": itemInpClass,
      "{lblContent}": lblContent
    };

    var itemInputTempl = "<input type='{inputType}' id='{itemType}-{i}' class='" + itemInpClass +"' name='{itemType}' data-{itemType}-num='{i}' " + data_attr + ">";//
    var itemLabelTempl = "<label for='{itemType}-{i}' class='{itemLblClass} {itemType}--{i}'>{lblContent}</label>";
    var itemTempl = "<li class='{itemType}" + itemCustomClass + "'>" + itemInputTempl + itemLabelTempl  +"</li>";

    var result = fillTemplate( itemTempl, replacements );

    return result;
  }

  // -----------------------------------------

  this.createControls = function( data ) {
    var output = "";

    var counter = 0;
    for (var item in data.list ){
      data.replacements["{action}"] = item;
      data.replacements["{text}"] = data.list[ item ];
      output += fillTemplate( data.template, data.replacements );

      if ( counter === 0 && data.insertBetween ){
        output += data.insertBetween;
      }
      counter++;
    }
    return output;
  };

  // -----------------------------------------

  this.addDataDefautlt = function( elem, defaultValue){
    var defData = elem.getAttribute("data-default");
    if ( defData === null ){
      elem.setAttribute("data-default", defaultValue);
    }
  };

  // -----------------------------------------

  this.addEvents = function ( itemsClass, func ){

    itemsClass = checkDot ( itemsClass );
    var items = doc.querySelectorAll(itemsClass);

    var parent = this;

    for (var i = 0; i < items.length; i++) {

      items[i].onclick = function() {
        func.call(parent, this);
      };
    }
  };

  // -----------------------------------------

  this.addOverEvents = function ( itemsClass, func ){

    itemsClass = checkDot ( itemsClass );
    var items = doc.querySelectorAll(itemsClass);

    var parent = this;

    for (var i = 0; i < items.length; i++) {

      items[i].onmousedown = function() {
        isMousePressed = true;
      };

      items[i].onmouseup = function() {
        isMousePressed = false;
      };

      items[i].onmouseover = function() {
        if ( isMousePressed ){
          func.call(parent, this);
        }
      };

    }
  };

  // -----------------------------------------

  this.checkInputValue = function ( params ) {

    var elem = params.elem;
    var func = params.func;
    var parent = params.parent;

    var minMax = minMaxDef(elem);
    var isNan = valueSetDefaultIfNAN(elem);

    if ( isNan ){
      elem.value = isNan;
    }

    if ( minMax  ) {
      elem.value = minMax ;
    }

    func.call(parent, elem);
  };

  // -----------------------------------------

  this.addOnChangeEvents = function ( itemsClass, func ){
    var items = doc.querySelectorAll(itemsClass);
    var parent = this;

    var params = {
      func: func,
      parent: parent
      };

    for (var i = 0; i < items.length; i++) {

      items[i].onkeyup = function(event) {
        params.elem = this;

        if ( event.keyCode === 38 || event.keyCode === 40 ){

            this.value = getValByKeyCode(this, event.keyCode, event.shiftKey);
            func.call(parent, this);
          }
        else {
          setTimer( parent.checkInputValue, params );
        }
      };

      items[i].onchange = function() {
        params.elem = this;
        parent.checkInputValue( params );
      };

      items[i].onblur = function() {
        params.elem = this;
        parent.checkInputValue( params );
      };
    }
  };

  // -----------------------------------------

  this.createInputsSet = function() {
    Elems.paintBox.innerHTML = Cell.dots;
    var output = "";

    for (var i = 0; i < Scene.oneSide * Scene.oneSide; i++) {
      var hpos = i % Scene.oneSide + 1;
      var vpos = Math.floor(i / Scene.oneSide) + 1;

      var replacements = {
        "{i}": i,
        "{hpos}": hpos,
        "{vpos}": vpos
      };
      var checkBox = fillTemplate( Cell.template, replacements );
      output += checkBox;
    }

    Elems.paintBox.innerHTML += "<ul class=\"items items--dots\">" + output + "</ul>";

    this.addOverEvents( Cell.labelClass, this.onOverLabel);
    this.addEvents( Cell.inputClass, this.onClickCell);
  };

  // -----------------------------------------

  this.createFramesSet = function() {

    for (var k = 0; k < Anim.stepsMax; k++) {
      Frames[k] = { active: 0 };

      for (var hpos = 0; hpos < Scene.oneSideMax; hpos++) { // verticals
        Frames[k][hpos] = {};

        for (var vpos = 0; vpos < Scene.oneSideMax; vpos++) { // gorizontals

          Frames[k][hpos][vpos] = {
            "hpos": hpos,
            "vpos": vpos,
            "color": Color.transparent
          };
        }  // End gorizontals
      } // End verticals

    }
  };

  // -----------------------------------------

  this.resetCurrentFrame = function( ) {

    var k = currentFrame;
    Frames[k] = { active: 0 };

    for (var hpos = 0; hpos < Scene.oneSideMax; hpos++) { // verticals
      Frames[k][hpos] = {};
      for (var vpos = 0; vpos < Scene.oneSideMax; vpos++) { // gorizontals
        Frames[k][hpos][vpos] = {
          "color": Color.transparent
        };
      }  // End gorizontals
    } // End verticals

  };

  // -----------------------------------------

  this.toggleColorClass = function( elem ) {
   var findClass = Color.className + "--";
   var classes = elem.classList;
    for (var i = 0; i < classes.length; i++) {

     if(classes[i].indexOf(findClass) >= 0 ){
       classes.remove(classes[i]);
       return;
     }
    }
   classes.add(findClass + Color.currentNum);
  };


  // -----------------------------------------

  this.onClickCell = function(elem) {
    this.updateFrames( elem );
  };

  // -----------------------------------------

  this.onOverLabel = function(elem) {
    var input = elem.previousSibling;

    if ( input.checked === true ){
      input.checked = false;
    }
    else {
      input.checked = true;
    }

    this.updateFrames( input );

  };

  // -----------------------------------------

  this.updateFrames = function( elem ) {

    var hpos = elem.getAttribute("data-hpos");
    var vpos = elem.getAttribute("data-vpos");

    var place = Frames[currentFrame];
    var color = Color.transparent;

    if ( elem.checked ){
      color = Color.current;
      place.active++;
      }
    else {
      place.active--;
    }

    place[hpos][vpos].color = color;
    this.paintShadow();
   };

  // -----------------------------------------

  this.paintShadow = function(){

    var styles = "";

    var framesLength = Anim.steps; //objLength(Frames);

    var perc = Anim.steps === 1 ? 0 : (100 / framesLength).toFixed(3);

    var dottes = Frames[currentFrame];
    var shadows = this.createShadow( dottes );

    styles = ".b-box--paint .dot {\n " + shadows + " \n}\n";

    dottes = Frames[0];
    shadows = this.createShadow( dottes );
    styles += classNames.resultDot + " {\n " + shadows + " -webkit-animation-duration: " + Anim.duration + "; \nanimation-duration: " + Anim.duration + ";\n}\n";

    if ( currentFrame > 0 ){

      dottes = Frames[currentFrame - 1];
      shadows = this.createShadow( dottes );
      styles += ".b-box--paint .dot--previous {\n " + shadows + " \n}\n";
    }

    Styles.shadows.innerHTML = styles;

    this.replaceAnimation({perc: perc});

  };

  // -----------------------------------------

  this.createShadow = function( dottes, is_value ){

    if ( dottes === undefined ){
      return;
    }

    var shadows = "";
    var if_first = true;

    //var cellsMax = Scene.oneSide * Scene.oneSide;

    for (var hpos = 0; hpos < Scene.oneSide + 1; hpos++) {
      for (var vpos = 0; vpos < Scene.oneSide + 1; vpos++) {

        var dot = dottes[hpos][vpos];

        var hpos_px = dot.hpos * Scene.dotSize + "px";
        var vpos_px = dot.vpos * Scene.dotSize + "px";
        var color = Color.transparent;


        if ( dot.color !== Color.transparent ) {
          color = dot.color;
        }

        if ( if_first ){
          if_first = false;
        }
        else {
          shadows += ", ";
        }

        shadows += hpos_px + " " + vpos_px + " 0 0 " + color;

      }
    }

    if ( !is_value ){
      shadows = "box-shadow: " + shadows + ";";
    }

    return shadows;
  };

  // -----------------------------------------

  this.deleteKeyframes = function() {

    var rules = Anim.rules;
    var keyTexts = [];

    if ( rules.length > 0 ){
      for ( var r = 0; r < rules.length; r++){
        var keyText = rules[r].keyText;
        keyTexts.push(keyText);
      }

      for (var i = 0; i < keyTexts.length; i++) {
        Anim.keyframes.deleteRule(keyTexts[i]);
      }
    }
  };

  // -----------------------------------------

  this.replaceAnimation = function(animation){

    Output.Animation = "";
    this.deleteKeyframes();

    if ( Anim.steps === 1 ){
      this.restartAnimation();
      return;
    }

    for ( var step = 0; step < Anim.steps; step++){

      var anim_dottes = Frames[step];
      var anim_shadows = this.createShadow( anim_dottes );

      var frameRule = animation.perc*step + "% {" + anim_shadows + "}";

      Anim.keyframes.appendRule(frameRule);

      Output.Animation += frameRule + "\n";
    }

    this.restartAnimation();

  };

  // -----------------------------------------

  this.restartAnimation  = function (){
    var resultDot = doc.querySelector(classNames.resultDot);
    resultDot.classList.remove(classIsRunning);
    resultDot.offsetWidth = resultDot.offsetWidth;
    resultDot.classList.add(classIsRunning);
  };

  // -----------------------------------------

  this.createPalette = function () {

    Elems.palette.innerHTML += "<h4 class='b-title'>Colors</h4> ";
    Elems.palette.innerHTML += "<ul class=\"items items--colors\"></ul>";
    Elems.palette.innerHTML += "<ul class=\"items items--colors-controls\">" + this.createControls( Color.upDown ) +"</ul>";

    this.fillPalette();
    this.addEvents( Color.inputClass, this.onClickColor );

    var first = doc.querySelector( checkDot(Color.inputClass) );
    first.checked = true;

    this.addEvents( Color.controlClass, this.onClickColorControl );
  };

  // -----------------------------------------

  this.fillPalette = function () {
    var output = "";

    var colorsItems = doc.querySelector(".items--colors");

    Styles.colors.innerHTML = "";

    for (var i = 0; i < Color.list.length; i++) {
      var replacements = {
        "{i}": i,
        "{color}": Color.list[i]
      };
      var colorItem = fillTemplate( Color.template, replacements );
      var colorStyle = fillTemplate( Color.StyleTempl, replacements );
      Styles.colors.innerHTML += colorStyle;
      output += colorItem;
    }

    colorsItems.innerHTML = output;

  };

  // -----------------------------------------

  this.reFillPalette = function () {

    var colorsItems = doc.querySelectorAll(checkDot(Color.inputClass));

    Styles.colors.innerHTML = "";

    for (var i = 0; i < Color.list.length; i++) {

      colorsItems[i].setAttribute("data-color", Color.list[i]);
      var replacements = {
        "{i}": i,
        "{color}": Color.list[i]
      };
      var colorStyle = fillTemplate( Color.StyleTempl, replacements );
      Styles.colors.innerHTML += colorStyle;
    }
  };

  // -----------------------------------------

  this.onClickColor = function( elem ){

    Color.current = elem.getAttribute("data-color");
    Color.currentNum = elem.getAttribute("data-color-num");
    Color.classCurrent = Color.className + "--" + Color.currentNum;
  };

  // -----------------------------------------

  this.onClickColorControl = function( elem ){
    var direct = elem.getAttribute("data-direction");
    var max = Palettes.length - 1;

    if ( direct === "up" ){
      if ( Color.currentListNum < max ){
        Color.currentListNum++;
        }
      else {
        Color.currentListNum = 0;
      }
    }
    else {
      if ( Color.currentListNum > 0 ){
        Color.currentListNum--;
        }
      else {
        Color.currentListNum = max;
      }
    }
    Color.list = Palettes[Color.currentListNum];
    Color.current = Color.list[Color.currentNum];
    Color.classCurrent = Color.className + "--" + Color.currentNum;
    this.reFillPalette();
  };
  // -----------------------------------------

  this.createSteps = function(){
    var output = "";

    Elems.steps.innerHTML += "<h4 class='b-title'>" + this.createControls( Step.plusMinus ) + "</h4> ";


    for (var i = 0; i < Anim.stepsMax; i++) {
      var customClass = i < Anim.steps ? "" : " " + Step.hiddenClass;

      var replacements = {
        "{i}": i,
        "{i+1}": i+1,
        "{customClass}": customClass
      };

      var stepItem = fillTemplate( Step.template, replacements );
      output += stepItem;
    }

    Elems.steps.innerHTML += "<ul class=\"items items--steps\">" + output + "</ul>";

    Elems.steps.innerHTML += this.createControls( Step.clearFrames );

    var first = doc.querySelector(checkDot (Step.inputClass) );
    first.checked = true;

    this.addEvents( Step.inputClass, this.onClickStep );
    this.addEvents( Step.controlClass, this.onClickStepControl );
    this.addEvents( Step.clearFramesClass, this.onClickClearFrames );

  };

  // -----------------------------------------

  this.onClickStep = function( elem ){
    currentFrame = elem.getAttribute("data-step-num");
    this.paintShadow();
    this.updateCells();
  };

  // -----------------------------------------

  this.onClickStepControl = function( elem ){

    var action = elem.getAttribute("data-action");
    var stepsItems = doc.querySelectorAll(checkDot(Step.className));
    var division = stepsItems[Anim.steps - 1];

    if ( action === "plus" && Anim.steps < Anim.stepsMax) {

       Anim.steps++;

       division.nextSibling.classList.remove(Step.hiddenClass);
       this.paintShadow();

       if ( Anim.steps === Anim.stepsMax ){
          elem.classList.add(Step.disabledClass);
       }
       else if ( Anim.steps === 2 ){
          this.enableControls();
       }
    }
    else if ( action === "minus"
              && Anim.steps > 1) {

       Anim.steps--;
       division.classList.add(Step.hiddenClass);
       this.paintShadow();

       if (Anim.steps === currentFrame ){
        currentFrame--;
        var prevInput = doc.querySelectorAll(checkDot (Step.inputClass) )[currentFrame];
        prevInput.checked = true;
        }

       if ( Anim.steps === 1 ){
          elem.classList.add(Step.disabledClass);
       }
       else if ( Anim.steps === Anim.stepsMax - 1 ){
          this.enableControls();
       }
    }
  };

  // -----------------------------------------

  this.enableControls = function() {
    var disabledItem = doc.querySelector(checkDot(Step.disabledClass));
    if ( disabledItem ){
     disabledItem.classList.remove(Step.disabledClass);
    }
  };

  // -----------------------------------------

  this.onClickClearFrames = function( elem ){

    var action = elem.getAttribute("data-action");

    if ( action === "all" ){
      this.createFramesSet();
      this.paintShadow();
      this.updateCells();
    }
    else {
      this.resetCurrentFrame();
      this.paintShadow();
      this.updateCells();
    }

  };

  // -----------------------------------------

  this.updateSteps = function () {
    var radio = Elems.steps.querySelectorAll("input");

    for (var i = 0; i < radio.length; i++) {
      if ( Frames[i].active > 0){
        radio[i].classList.add("is--filled");
      }
      else {
        radio[i].classList.remove("is--filled");
      }
    }

  };

  // -----------------------------------------

  this.updateCells = function() {
    var checkboxes = Elems.paintBox.querySelectorAll("input");
    var frameCells = Frames[currentFrame];
    var colored = 0;

    for (var i = 0; i < checkboxes.length; i++) {
      var cell = checkboxes[i];
      var hpos = cell.getAttribute("data-hpos");
      var vpos = cell.getAttribute("data-vpos");
      var color = frameCells[hpos][vpos].color;

      if ( color === Color.transparent ){
        cell.checked = false;
      }
      else {
        colored++;
        cell.checked = true;
      }
    }

  };

  // -----------------------------------------

  this.createCodes = function() {
    this.addEvents( classNames.codesToggle, this.onClickCodes);
  };

  // -----------------------------------------

  this.onClickCodes = function() {
      var textInit = Elems.codesToggle.getAttribute("data-init");
      var textClose = Elems.codesToggle.getAttribute("data-opened");
      var text = textInit;

      if ( is_opened ){
        is_opened = false;
      }
      else {
        is_opened = true;
        text = textClose;
      }

      Elems.codesToggle.innerHTML = text;

      Elems.codes.classList.toggle("is-open");

      Output.HtML = "<!-- " + Output.comment + " -->\n<div class='box'><span class='dot'></span></div>";

      Elems.codesCss.innerHTML = "/*-- " + Output.comment + " */\n" + this.createOutputCss();
      Elems.codesHtml.innerHTML = Output.HtML;

  };

  // -----------------------------------------

  this.createOutputCss = function(){
   var styles = "";

   var dottes = Frames[0];
   var shadows = this.createShadow( dottes, true );

   this.setOutputParams();
   this.outputElemParams[".dot"]["box-shadow"] = shadows;

   for ( var elem in this.outputElemParams ){
      var className = elem;
      var elemStyles = "";
      var params = this.outputElemParams[elem];
      for (var item in params){
        var value = addUnits( params[item], item );
        elemStyles += item + ": " + value + ";\n";
      }
      styles += className + " {\n" + elemStyles + "}\n";
    }

    styles += "\n/* Keyframes */\n";

    var animation = "\n@-webkit-keyframes shadows {\n" + Output.Animation + "\n}\n";
    animation += "@keyframes shadows {\n" + Output.Animation + "\n}\n";
    styles += animation;

    return styles;
  };

  // -----------------------------------------

  this.createDurationInp = function(){

    var durationInt = Anim.duration.split("s").join("");
    Elems.durationInp.value = durationInt;

    this.addDataDefautlt(Elems.durationInp, durationInt);

    this.addOnChangeEvents( classNames.durationInp, this.onChangeDuration);
  };

  // -----------------------------------------

  this.onChangeDuration = function( elem ){
    Anim.duration = elem.value + "s";
    this.paintShadow();
  };

  // -----------------------------------------

  this.createSizeInp = function(){

    Elems.sizeInp.value = Scene.size;
    this.addDataDefautlt(Elems.sizeInp, Scene.size);

    this.addOnChangeEvents( classNames.sizeInp, this.onChangeSize);
  };

  // -----------------------------------------

  this.onChangeSize = function(elem){

    Scene.size = +elem.value;

    this.addConfig();
    this.paintShadow();
  };

  // -----------------------------------------

  this.createDotsInp = function(){

    Elems.dotsInp.value = Scene.oneSide;
    this.addDataDefautlt(Elems.dotsInp, Scene.oneSide);

    this.addOnChangeEvents( classNames.dotsInp, this.onChangeDots);
  };

  // -----------------------------------------

  this.onChangeDots = function(elem){

    Scene.oneSide = +elem.value;

    this.addConfig();
    this.createInputsSet();
    this.paintShadow();
  };

}// End Pixelator

// Common
// -----------------------------------------

function out ( data, is_style, color ) {
  var style;

  if ( is_style ){
    color = color || "orangered";
    style = "color: " + color + "; padding-left: 20px;";
    data = "%c" + data;
    console.log( data, style );
  }
  else {
    console.log( data );
  }

}

function checkDot ( className ){

  if ( className.indexOf(".") < 0 ){
    className = "." + className;
  }
  return className;
}

function strIsNAN(str){

  str = str.replace(/-|\./g,"");
  str = str.split(" ").join("");
  return isNaN(str);
}

function addUnits( str ){
  str = String(str);
  var arr = str.split(" ");

  if ( strIsNAN(str) ){
    return str;
  }

  if ( arr.length > 1
      && arr[0].indexOf("px") < 0
      && arr[0].indexOf("em") < 0
      && arr[0].indexOf("%") < 0 ){
      str = arr.join("px ") + "px";
      return str;
  }

  if ( str.indexOf("px") < 0
      && str.indexOf("em") < 0
      && arr[0].indexOf("%") < 0 ) {
    str += "px";
  }

  return str;
}


function getValByKeyCode(elem, key, isShift ) {
  var value = +elem.value;
  var min = elem.getAttribute("data-min");
  var max = elem.getAttribute("data-max");

  var step = isShift ? 10 : 1;

  if ( key === 38 ) {
    if ( value >= 0
         && value < 1
         && min < 1 ){

      step = 0.1;
    }
    value += step;
  }
  else if ( key === 40 ) {
    if ( value > 0
         && value <= 1
         && min < 1 ){

      step = 0.1;
    }
    value -= step;
  }

  if ( value < min ) {
    value = min;
    }
  else if ( max !== null && value > max ) {
    value = max;
    }
  else {
    if ( value > 0 && value < 1 ){
      value = value.toFixed(1);
    }
    else {
      value = value.toFixed();
    }
  }

  return value;
}

function valueSetDefaultIfNAN(elem){
  var value = elem.value;
  var defaultValue = elem.getAttribute("data-default");
  if ( isNaN( value ) ){
     return defaultValue;
  }

  return false;
}

function minMaxDef(elem) {
   var min = elem.getAttribute("data-min");
   min = min === null ? 0 : +min;

   var max = elem.getAttribute("data-max");
   max = max === null ? 100 : +max;

   var value = elem.value;

   var out = value > max ? max : value < min ? min : false;
   return out;
}

function fillTemplate( dataStr, replacements ) {
  for ( var key in replacements ){
    var findStr = key;
    var replaceWithStr = replacements[key];

    dataStr = dataStr.split(findStr).join(replaceWithStr);
  }
  return dataStr;
}

function objLength( obj ) {
  var count = 0;
  for ( var key in obj ){
    count++;
  }
  return count;
}

// Init
// -----------------------------------------
var painter = new shadowPainter();

painter.init();



