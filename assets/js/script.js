var line = '------------------------';

function ShadowPainter() {
  this.timer;
  this.isMousePressed = false;

  this.classNames = {
    wrapper: '.l-wrapper',
    paintBox: '.b-box--paint',
    resultBox: '.b-box--result',
    resultDot: '.b-box--result .dot',
    palette: '.b-palette',
    steps: '.b-steps',

    codes: '.b-codes',
    codesToggle: '.b-codes__toggle',
    codesCSS: '.textarea--css',
    codesHtml: '.textarea--html',

    durationInp: '.text--duration',
    sizeInp: '.text--size',
    dotsInp: '.text--dots',
    isRunning: 'is-running',
  };

  this.Elems = {};

  this.Cell = {
    className: 'cell',
    inputType: 'checkbox',
    inputClass: 'cell__inp',
    labelClass: 'cell__lbl',
    inputData: 'data-hpos="{hpos}"  data-vpos="{vpos}" ',
    labelContent: '',
    dots: '<span class="dot dot--previous"></span><span class="dot"></span>'
  };

  this.Palettes = [
    ['#3FB8AF','#7FC7AF','#DAD8A7','#FF9E9D','#FF3D7F'],
    ['#468966','#FFF0A5','#FFB03B','#B64926','#8E2800'],
    ['#004358','#1F8A70','#BEDB39','#FFE11A','#FD7400'],
    ['#96CA2D','#B5E655','#EDF7F2','#4BB5C1','#7FC6BC'],
    ['#2E0927','#D90000','#FF2D00','#FF8C00','#04756F'],
    ['#FCFFF5','#D1DBBD','#91AA9D','#3E606F','#193441'],
    ['#332532','#644D52','#F77A52','#FF974F','#A49A87']
  ];

  this.Colors = this.initColors();
  this.Step = this.initStep();

  this.stylesClassNames = {
    config: 'configBox',
    shadows: 'stylesBox',
    colors: 'colorsBox'
  };
  this.Styles = {};

  this.Output = {
    HTML: '',
    CSS: '',
    Animation: '',
    comment: 'Created in shadowPainter : )'
  };

  this.Scene = {
    oneSide: 5,// dottes in line
    oneSideMax: 30,// dottes in line
    size: 250,
    dotSize: 30,// pixels
    padding: 20,// pixels. Don't change it
    border: 1// pixels
  };

  this.Anim = {
    steps: 5,
    stepsMax: 20,
    duration: '1s',
    name: 'shadows',
    keyframes: findKeyFrames('shadows')
  };
  this.Anim.rules = this.Anim.keyframes.cssRules;

  this.isCodeOpened = false;

  this.Frames = {};
  this.currentFrame = 0;

  this.init = function () {
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

} // End ShadowPainter()

// -----------------------------------------

ShadowPainter.prototype.setTimer = function(func, params) {
  if (this.timer) {
    this.clearTimeout(this.timer);
  }
  var execFunc = function () {
    func(params);
  };
  this.timer = this.setTimeout(execFunc , 50);
};

// -----------------------------------------

ShadowPainter.prototype.getAnimStr = function() {
  return `${this.Anim.duration} ${this.Anim.name} linear infinite`;
};

// -----------------------------------------

ShadowPainter.prototype.initElements = function () {
  for (var className in this.classNames) {
    this.Elems[className] = document.querySelector(this.classNames[className]);
  }
};

// -----------------------------------------

ShadowPainter.prototype.setParams = function () {
  let dotSize = (this.Scene.size / this.Scene.oneSide);
  this.Scene.dotSize = dotSize.toFixed();
  this.Scene.size = this.Scene.dotSize * this.Scene.oneSide;

  this.configElemParams = {
    '.l-wrapper': {
      'width': 700, // size * 2 + this.Scene.padding * 3 + border*6
      'height': 490, // size + this.Scene.padding * 2 + border*4
    },
    '.b-boxes': {
      'height': 340
    },
    '.l-zero-gravity': {
      'height': this.Scene.size + this.Scene.border
    },
    '.b-box': {
      'width': this.Scene.size + this.Scene.border,
      'height': this.Scene.size
    },
    '.cell__lbl': {
      'width': this.Scene.dotSize,
      'height': this.Scene.dotSize
    },
    '.dot': {
      'width': this.Scene.dotSize,
      'height': this.Scene.dotSize,
      'top': '-' + this.Scene.dotSize,
      'left': '-' + this.Scene.dotSize
    },
    '.is-running': {
      'animation': this.getAnimStr()
    },
    '.b-box--paint': {
      'background-size': this.Scene.dotSize + ' ' + this.Scene.dotSize
    }
  };
};

// -----------------------------------------

ShadowPainter.prototype.setOutputParams = function () {
  this.outputElemParams = {
    '.box': {
      'position': 'absolute',
      'top': '0',
      'bottom': '0',
      'left': '0',
      'right': '0',
      'margin': 'auto',
      'width': this.Scene.size,
      'height': this.Scene.size,
      'overflow': 'hidden',
      'border': '1px solid #DDD'
    },
    '.dot': {
      'display': 'block',
      'position': 'absolute',
      'width': this.Scene.dotSize,
      'height': this.Scene.dotSize,
      'top': '-' + this.Scene.dotSize,
      'left': '-' + this.Scene.dotSize,
      'animation': this.getAnimStr()
    }
  };
};

// -----------------------------------------

ShadowPainter.prototype.addConfig = function () {
  this.setParams();

  var styles = '';
  for (var elem in this.configElemParams) {
    var className = elem;
    var elemStyles = '';
    var params = this.configElemParams[elem];
    for (var item in params) {
      var value = addUnits(params[item], item);
      elemStyles += item + ': ' + value + ';\n';
    }
    styles += className + ' {\n' + elemStyles + '}\n';
  }

  this.Styles.config.innerHTML = styles;
};

// -----------------------------------------

ShadowPainter.prototype.createStylesBoxes = function () {
  for (var styleBox in this.stylesClassNames) {
    this.Styles[styleBox] = addStylesElem(this.stylesClassNames[styleBox]);
  }
};

// -----------------------------------------

ShadowPainter.prototype.createTemplates = function () {
  var templatesConfig = [this.Cell, this.Colors, this.Step];

  for (var i = 0; i < templatesConfig.length; i++) {
    var item = templatesConfig[i];
    item.template = createTemplate(item);
  }
};

// -----------------------------------------

ShadowPainter.prototype.createControls = function (data) {
  var output = '';

  var counter = 0;
  for (var item in data.list) {
    data.replacements['{action}'] = item;
    data.replacements['{text}'] = data.list[ item ];
    output += fillTemplate(data.template, data.replacements);

    if (counter === 0 && data.insertBetween) {
      output += data.insertBetween;
    }
    counter++;
  }
  return output;
};

// -----------------------------------------

ShadowPainter.prototype.addDataDefautlt = function (elem, defaultValue) {
  var defData = elem.getAttribute('data-default');

  if (defData === null) {
    elem.setAttribute('data-default', defaultValue);
  }
};

// -----------------------------------------

ShadowPainter.prototype.addEvents = function (itemsClass, func) {
  itemsClass = checkClassDot(itemsClass);
  var items = document.querySelectorAll(itemsClass);
  var parent = this;

  for (var i = 0; i < items.length; i++) {
    items[i].onclick = function () {
      func.call(parent, this);
    };
  }
};

// -----------------------------------------

ShadowPainter.prototype.addOverEvents = function (itemsClass, func) {
  itemsClass = checkClassDot(itemsClass);
  var items = document.querySelectorAll(itemsClass);
  var parent = this;

  for (var i = 0; i < items.length; i++) {
    items[i].onmousedown = function () {
      this.isMousePressed = true;
    };

    items[i].onmouseup = function () {
      this.isMousePressed = false;
    };

    items[i].onmouseover = function () {
      if (this.isMousePressed) {
        func.call(parent, this);
      }
    };
  }
};

// -----------------------------------------

ShadowPainter.prototype.checkInputValue = function (params) {
  var elem = params.elem;
  var func = params.func;
  var parent = params.parent;

  var minMax = minMaxDef(elem);
  var isNan = valueSetDefaultIfNAN(elem);

  if (isNan) {
    elem.value = isNan;
  }

  if (minMax) {
    elem.value = minMax;
  }

  func.call(parent, elem);
};

// -----------------------------------------

ShadowPainter.prototype.addOnChangeEvents = function (itemsClass, func) {
  var items = document.querySelectorAll(itemsClass);
  var parent = this;

  var params = {
    func: func,
    parent: parent
  };

  for (var i = 0; i < items.length; i++) {
    items[i].onkeyup = function (event) {
      params.elem = this;

      if (event.keyCode === 38 || event.keyCode === 40) {

        this.value = getValByKeyCode(this, event.keyCode, event.shiftKey);
        func.call(parent, this);
      }
      else {
        this.setTimer(parent.checkInputValue, params);
      }
    };

    items[i].onchange = function () {
      params.elem = this;
      parent.checkInputValue(params);
    };

    items[i].onblur = function () {
      params.elem = this;
      parent.checkInputValue(params);
    };
  }
};

// -----------------------------------------

ShadowPainter.prototype.createInputsSet = function () {
  this.Elems.paintBox.innerHTML = this.Cell.dots;
  var output = '';

  for (var i = 0; i < this.Scene.oneSide * this.Scene.oneSide; i++) {
    var hpos = i % this.Scene.oneSide + 1;
    var vpos = Math.floor(i / this.Scene.oneSide) + 1;

    var replacements = {
      '{i}': i,
      '{hpos}': hpos,
      '{vpos}': vpos
    };
    var checkBox = fillTemplate(this.Cell.template, replacements);
    output += checkBox;
  }

  this.Elems.paintBox.innerHTML += `<ul class="items items--dots">${output}</ul>`;

  this.addOverEvents(this.Cell.labelClass, this.onOverLabel);
  this.addEvents(this.Cell.inputClass, this.onClickCell);
};

// -----------------------------------------

ShadowPainter.prototype.createFramesSet = function () {
  for (var k = 0; k < this.Anim.stepsMax; k++) {
    this.Frames[k] = {active: 0};

    for (var hpos = 0; hpos < this.Scene.oneSideMax; hpos++) { // verticals
      this.Frames[k][hpos] = {};

      for (var vpos = 0; vpos < this.Scene.oneSideMax; vpos++) { // gorizontals

        this.Frames[k][hpos][vpos] = {
          'hpos': hpos,
          'vpos': vpos,
          'color': this.Colors.transparent
        };
      } // End gorizontals
    } // End verticals
  }
};

// -----------------------------------------

ShadowPainter.prototype.resetCurrentFrame = function () {
  var k = this.currentFrame;
  this.Frames[k] = {active: 0};

  for (var hpos = 0; hpos < this.Scene.oneSideMax; hpos++) { // verticals
    this.Frames[k][hpos] = {};

    for (var vpos = 0; vpos < this.Scene.oneSideMax; vpos++) { // gorizontals
      this.Frames[k][hpos][vpos] = {
        'color': this.Colors.transparent
      };
    } // End gorizontals
  } // End verticals
};

// -----------------------------------------

ShadowPainter.prototype.toggleColorClass = function (elem) {
  var findClass = this.Colors.className + '--';
  var classes = elem.classList;

  for (var i = 0; i < classes.length; i++) {

    if (classes[i].indexOf(findClass) >= 0) {
      classes.remove(classes[i]);
      return;
    }
  }

  classes.add(findClass + this.Colors.currentNum);
};

// -----------------------------------------

ShadowPainter.prototype.onClickCell = function (elem) {
  this.updateFrames(elem);
};

// -----------------------------------------

ShadowPainter.prototype.onOverLabel = function (elem) {
  var input = elem.previousSibling;

  if (input.checked === true) {
    input.checked = false;
  }
  else {
    input.checked = true;
  }

  this.updateFrames(input);
};

// -----------------------------------------

ShadowPainter.prototype.updateFrames = function (elem) {
  var hpos = elem.getAttribute('data-hpos');
  var vpos = elem.getAttribute('data-vpos');

  var place = this.Frames[this.currentFrame];
  var color = this.Colors.transparent;

  if (elem.checked) {
    color = this.Colors.current;
    place.active++;
  }
  else {
    place.active--;
  }

  place[hpos][vpos].color = color;
  this.paintShadow();
};

// -----------------------------------------

ShadowPainter.prototype.paintShadow = function () {
  var styles = '';
  var framesLength = this.Anim.steps; // objLength(this.Frames);
  var perc = this.Anim.steps === 1 ? 0 : (100 / framesLength).toFixed(3);
  var dottes = this.Frames[this.currentFrame];
  var shadows = this.createShadow(dottes);

  styles = '.b-box--paint .dot {\n ' + shadows + ' \n}\n';

  dottes = this.Frames[0];
  shadows = this.createShadow(dottes);
  styles += this.classNames.resultDot + ' {\n ' + shadows + ' \nanimation-duration: ' + this.Anim.duration + ';\n}\n';

  if (this.currentFrame > 0) {
    dottes = this.Frames[this.currentFrame - 1];
    shadows = this.createShadow(dottes);

    styles += '.b-box--paint .dot--previous {\n ' + shadows + ' \n}\n';
  }

  this.Styles.shadows.innerHTML = styles;

  this.replaceAnimation({perc: perc});
};

// -----------------------------------------

ShadowPainter.prototype.createShadow = function (dottes, is_value) {
  if (dottes === undefined) {
    return;
  }

  var shadows = '';
  var if_first = true;

  for (var hpos = 0; hpos < this.Scene.oneSide + 1; hpos++) {
    for (var vpos = 0; vpos < this.Scene.oneSide + 1; vpos++) {
      var dot = dottes[hpos][vpos];

      var hpos_px = dot.hpos * this.Scene.dotSize + 'px';
      var vpos_px = dot.vpos * this.Scene.dotSize + 'px';
      var color = this.Colors.transparent;


      if (dot.color !== this.Colors.transparent) {
        color = dot.color;
      }

      if (if_first) {
        if_first = false;
      }
      else {
        shadows += ', ';
      }

      shadows += hpos_px + ' ' + vpos_px + ' 0 0 ' + color;
    }
  }

  if (!is_value) {
    shadows = 'box-shadow: ' + shadows + ';';
  }

  return shadows;
};

// -----------------------------------------

ShadowPainter.prototype.deleteKeyframes = function () {
  var rules = this.Anim.rules;
  var keyFrames = this.Anim.keyframes;
  const max = 1000;
  let counter = 0;

  while (keyFrames.cssRules.length > 0 && counter < max) {
    const {keyText} = keyFrames.cssRules[0];
    keyFrames.deleteRule(keyText);

    counter++;
  }
};

// -----------------------------------------

ShadowPainter.prototype.replaceAnimation = function (animation) {
  this.Output.Animation = '';
  this.deleteKeyframes();

  if (this.Anim.steps === 1) {
    this.restartAnimation();
    return;
  }

  for (var step = 0; step < this.Anim.steps; step++) {
    var anim_dottes = this.Frames[step];
    var anim_shadows = this.createShadow(anim_dottes);
    var stepPercents = +(animation.perc * step).toFixed(3);
    var frameRule = `${stepPercents}% {\n${anim_shadows}\n}`;

    this.Anim.keyframes.appendRule(frameRule);
    this.Output.Animation += frameRule + '\n';
  }

  this.restartAnimation();
};

// -----------------------------------------

ShadowPainter.prototype.restartAnimation = function () {
  var resultDot = document.querySelector(this.classNames.resultDot);
  resultDot.classList.remove(this.classNames.isRunning);
  resultDot.classList.add(this.classNames.isRunning);
};

// -----------------------------------------

ShadowPainter.prototype.createPalette = function () {
  const paletteControls = this.createControls(this.Colors.upDown);
  this.Elems.palette.innerHTML += '<h4 class="b-title">Colors</h4> ';
  this.Elems.palette.innerHTML += '<ul class="items items--colors"></ul>';
  this.Elems.palette.innerHTML += `<ul class="items items--colors-controls">${paletteControls}</ul>`;

  this.fillPalette();
  this.addEvents(this.Colors.inputClass, this.onClickColor);

  var first = document.querySelector(checkClassDot(this.Colors.inputClass));
  first.checked = true;

  this.addEvents(this.Colors.controlClass, this.onClickColorControl);
};

// -----------------------------------------

ShadowPainter.prototype.fillPalette = function () {
  var output = '';
  var colorsItems = document.querySelector('.items--colors');
  this.Styles.colors.innerHTML = '';

  for (var i = 0; i < this.Colors.list.length; i++) {
    var replacements = {
      '{i}': i,
      '{color}': this.Colors.list[i]
    };
    var colorItem = fillTemplate(this.Colors.template, replacements);
    var colorStyle = fillTemplate(this.Colors.StyleTempl, replacements);
    this.Styles.colors.innerHTML += colorStyle;
    output += colorItem;
  }

  colorsItems.innerHTML = output;
};

// -----------------------------------------

ShadowPainter.prototype.reFillPalette = function () {
  var colorsItems = document.querySelectorAll(checkClassDot(this.Colors.inputClass));
  this.Styles.colors.innerHTML = '';

  for (var i = 0; i < this.Colors.list.length; i++) {
    colorsItems[i].setAttribute('data-color', this.Colors.list[i]);
    var replacements = {
      '{i}': i,
      '{color}': this.Colors.list[i]
    };
    var colorStyle = fillTemplate(this.Colors.StyleTempl, replacements);

    this.Styles.colors.innerHTML += colorStyle;
  }
};

// -----------------------------------------

ShadowPainter.prototype.onClickColor = function (elem) {
  this.Colors.current = elem.getAttribute('data-color');
  this.Colors.currentNum = elem.getAttribute('data-color-num');
  this.Colors.classCurrent = this.Colors.className + '--' + this.Colors.currentNum;
};

// -----------------------------------------

ShadowPainter.prototype.onClickColorControl = function (elem) {
  var direct = elem.getAttribute('data-direction');
  var max = this.Palettes.length - 1;

  if (direct === 'up') {
    if (this.Colors.currentListNum < max) {
      this.Colors.currentListNum++;
    }
    else {
      this.Colors.currentListNum = 0;
    }
  }
  else {
    if (this.Colors.currentListNum > 0) {
      this.Colors.currentListNum--;
    }
    else {
      this.Colors.currentListNum = max;
    }
  }

  this.Colors.list = this.Palettes[this.Colors.currentListNum];
  this.Colors.current = this.Colors.list[this.Colors.currentNum];
  this.Colors.classCurrent = this.Colors.className + '--' + this.Colors.currentNum;

  this.reFillPalette();
};

// -----------------------------------------

ShadowPainter.prototype.createSteps = function () {
  var output = '';
  const plusMinusControls = this.createControls(this.Step.plusMinus);
  this.Elems.steps.innerHTML += `<h4 class="b-title">${plusMinusControls}</h4>`;

  for (var i = 0; i < this.Anim.stepsMax; i++) {
    var customClass = i < this.Anim.steps ? '' : ' ' + this.Step.hiddenClass;

    var replacements = {
      '{i}': i,
      '{i+1}': i+1,
      '{customClass}': customClass
    };

    var stepItem = fillTemplate(this.Step.template, replacements);
    output += stepItem;
  }

  this.Elems.steps.innerHTML += `<ul class="items items--steps">${output}</ul>`;

  this.Elems.steps.innerHTML += this.createControls(this.Step.clearFrames);

  var first = document.querySelector(checkClassDot(this.Step.inputClass));
  first.checked = true;

  this.addEvents(this.Step.inputClass, this.onClickStep);
  this.addEvents(this.Step.controlClass, this.onClickStepControl);
  this.addEvents(this.Step.clearFramesClass, this.onClickClearFrames);
};

// -----------------------------------------

ShadowPainter.prototype.onClickStep = function (elem) {
  this.currentFrame = elem.getAttribute('data-step-num');
  this.paintShadow();
  this.updateCells();
};

// -----------------------------------------

ShadowPainter.prototype.onClickStepControl = function (elem) {
  var action = elem.getAttribute('data-action');
  var stepsItems = document.querySelectorAll(checkClassDot(this.Step.className));
  var division = stepsItems[this.Anim.steps - 1];

  if (action === 'plus' && this.Anim.steps < this.Anim.stepsMax) {
    this.Anim.steps++;

    division.nextSibling.classList.remove(this.Step.hiddenClass);
    this.paintShadow();

    if (this.Anim.steps === this.Anim.stepsMax) {
      elem.classList.add(this.Step.disabledClass);
    }
    else if (this.Anim.steps === 2) {
      this.enableControls();
    }
  }
  else if (action === 'minus' && this.Anim.steps > 1) {
    this.Anim.steps--;
    division.classList.add(this.Step.hiddenClass);
    this.paintShadow();

    if (this.Anim.steps === this.currentFrame) {
      this.currentFrame--;
      var prevInput = document.querySelectorAll(checkClassDot(this.Step.inputClass))[this.currentFrame];
      prevInput.checked = true;
    }

    if (this.Anim.steps === 1) {
      elem.classList.add(this.Step.disabledClass);
    }
    else if (this.Anim.steps === this.Anim.stepsMax - 1) {
      this.enableControls();
    }
  }
};

// -----------------------------------------

ShadowPainter.prototype.enableControls = function () {
  var disabledItem = document.querySelector(checkClassDot(this.Step.disabledClass));
  if (disabledItem) {
    disabledItem.classList.remove(this.Step.disabledClass);
  }
};

// -----------------------------------------

ShadowPainter.prototype.onClickClearFrames = function (elem) {
  var action = elem.getAttribute('data-action');

  if (action === 'all') {
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

ShadowPainter.prototype.updateSteps = function () {
  var radio = this.Elems.steps.querySelectorAll('input');

  for (var i = 0; i < radio.length; i++) {
    if (this.Frames[i].active > 0) {
      radio[i].classList.add('is--filled');
    }
    else {
      radio[i].classList.remove('is--filled');
    }
  }
};

// -----------------------------------------

ShadowPainter.prototype.updateCells = function () {
  var checkboxes = this.Elems.paintBox.querySelectorAll('input');
  var frameCells = this.Frames[this.currentFrame];
  var colored = 0;

  for (var i = 0; i < checkboxes.length; i++) {
    var cell = checkboxes[i];
    var hpos = cell.getAttribute('data-hpos');
    var vpos = cell.getAttribute('data-vpos');
    var color = frameCells[hpos][vpos].color;

    if (color === this.Colors.transparent) {
      cell.checked = false;
    }
    else {
      colored++;
      cell.checked = true;
    }
  }
};

// -----------------------------------------

ShadowPainter.prototype.createCodes = function () {
  this.addEvents(this.classNames.codesToggle, this.onClickCodes);
};

// -----------------------------------------

ShadowPainter.prototype.onClickCodes = function () {
  var textInit = this.Elems.codesToggle.getAttribute('data-init');
  var textClose = this.Elems.codesToggle.getAttribute('data-opened');
  var text = textInit;

  if (this.isCodeOpened) {
    this.isCodeOpened = false;
  }
  else {
    this.isCodeOpened = true;
    text = textClose;
  }

  this.Elems.codesToggle.innerHTML = text;
  this.Elems.codes.classList.toggle('is-open');

  this.Output.HTML = `<!-- ${this.Output.comment} -->\n<div class="box"><span class="dot"></span></div>`;

  this.Elems.codesCSS.innerHTML = `/*-- ${this.Output.comment} */\n${this.createOutputCSS()}`;
  this.Elems.codesHtml.innerHTML = this.Output.HTML;
};

// -----------------------------------------

ShadowPainter.prototype.createOutputCSS = function () {
  var styles = '';
  var dottes = this.Frames[0];
  var shadows = this.createShadow(dottes, true);

  this.setOutputParams();
  this.outputElemParams['.dot']['box-shadow'] = shadows;

  for (var elem in this.outputElemParams) {
    var className = elem;
    var elemStyles = '';
    var params = this.outputElemParams[elem];
    for (var item in params) {
      var value = addUnits(params[item], item);
      elemStyles += item + ': ' + value + ';\n';
    }
    styles += `${className} {\n${elemStyles}}\n`;
  }

  styles += '\n/* Keyframes */\n';

  var animation = `@keyframes shadows {\n${this.Output.Animation}\n}\n`;
  styles += animation;

  return styles;
};

// -----------------------------------------

ShadowPainter.prototype.createDurationInp = function () {
  var durationInt = this.Anim.duration.split('s').join('');
  this.Elems.durationInp.value = durationInt;

  this.addDataDefautlt(this.Elems.durationInp, durationInt);
  this.addOnChangeEvents(this.classNames.durationInp, this.onChangeDuration);
};

// -----------------------------------------

ShadowPainter.prototype.onChangeDuration = function (elem) {
  this.Anim.duration = elem.value + 's';
  this.paintShadow();
};

// -----------------------------------------

ShadowPainter.prototype.createSizeInp = function () {
  this.Elems.sizeInp.value = this.Scene.size;

  this.addDataDefautlt(this.Elems.sizeInp, this.Scene.size);
  this.addOnChangeEvents(this.classNames.sizeInp, this.onChangeSize);
};

// -----------------------------------------

ShadowPainter.prototype.onChangeSize = function (elem) {
  this.Scene.size = Number(elem.value);

  this.addConfig();
  this.paintShadow();
};

ShadowPainter.prototype.onChangeDots = function (elem) {
  this.Scene.oneSide = Number(elem.value);

  this.addConfig();
  this.createInputsSet();
  this.paintShadow();
};

// -----------------------------------------

ShadowPainter.prototype.createDotsInp = function () {
  this.Elems.dotsInp.value = this.Scene.oneSide;

  this.addDataDefautlt(this.Elems.dotsInp, this.Scene.oneSide);
  this.addOnChangeEvents(this.classNames.dotsInp, this.onChangeDots);
};

// -----------------------------------------

ShadowPainter.prototype.initColors = function() {
  const colors = {
    className: 'color',
    inputType: 'radio',
    inputClass: 'color__inp',
    inputData: 'data-color="{color}" ',

    labelContent: '',
    controlClass: 'colors-controls__item',
    transparent: 'rgba(255,255,255,0)',
    currentNum: 0,
    currentListNum: 0
  };

  colors.list = this.Palettes[colors.currentListNum];

  colors.current = colors.list[0];
  colors.classCurrent = `${colors.className}--${colors.currentNum}`;

  colors.StyleTempl = `.${colors.className}--{i} {background: {color};}\n`;
  colors.controlTempl = '<li class="{itemsClass} {itemsClass}-{direction}" data-direction="{direction}"></li>';

  colors.upDown = {
    list: {
      'up': '',
      'down': ''
    },
    replacements: {
      '{itemsClass}': colors.controlClass
    },
    template: '<li class="{itemsClass} {itemsClass}--{action}" data-action="{action}"></li>'
  };

  return colors;
};

// -----------------------------------------

ShadowPainter.prototype.initStep = function() {
  const step = {
    className: 'step',
    inputType: 'radio',
    inputClass: 'step__inp',
    inputData: '',
    labelContent: '{i+1}',
    controlClass: 'steps-control',
    clearFramesClass: 'frames-clear',

    currentNum: 0,
    customClass: '{customClass}',
    hiddenClass: 'is-hidden',
    disabledClass: 'is-disabled'
  };
  step.plusMinus = {
    list: {
      'minus': '&ndash;',
      'plus': '+'
    },
    replacements: {
      '{itemsClass}': step.controlClass
    },
    template: '<span class="{itemsClass} {itemsClass}--{action}" data-action="{action}">{text}</span>',
    insertBetween: 'this.Frames'
  };

  step.clearFrames = {
    list: {
      'current': 'Clear current frame',
      'all': 'Clear all frames'
    },
    replacements: {
      '{itemsClass}': step.clearFramesClass
    },
    template: '<span class="{itemsClass} {itemsClass}--{action}" data-action="{action}">{text}</span>'
  };

  return step;
};

// Helpers
// -----------------------------------------

function out(data, is_style, color) {
  var style;

  if (is_style) {
    color = color || 'orangered';
    style = 'color: ' + color + '; padding-left: 20px;';
    style = `color: ${color}; padding-left: 20px;`;
    data = `%c${data}`;
    console.log(data, style);
  }
  else {
    console.log(data);
  }
}

// -----------------------------------------

function addStylesElem(elemClass) {
  var elem = document.createElement('style');
  elem.classList.add(elemClass);
  var head = document.querySelector('head');
  head.appendChild(elem);
  return elem;
}

// -----------------------------------------

function findKeyFrames(name) {
  var keytFrames;
  for (var i = 0; i < document.styleSheets.length; i++) {
    var stylesList = document.styleSheets[i].cssRules;

    for (var k = 0; k < stylesList.length; k++) {
      if (stylesList[k].name === name) {
        keytFrames = stylesList[k];
      }
    }
  }

  return keytFrames;
}

// -----------------------------------------

function checkClassDot(className) {
  if (className.indexOf('.') < 0) {
    className = '.' + className;
  }
  return className;
}

// -----------------------------------------

function strIsNAN(str) {
  str = str.replace(/-|\./g,'');
  str = str.split(' ').join('');
  return isNaN(str);
}

// -----------------------------------------

function addUnits(str) {
  str = String(str);
  var arr = str.split(' ');

  if (strIsNAN(str)) {
    return str;
  }

  if (arr.length > 1 &&
      arr[0].indexOf('px') < 0 &&
      arr[0].indexOf('em') < 0 &&
      arr[0].indexOf('%') < 0) {
    str = arr.join('px ') + 'px';
    return str;
  }

  if (str.indexOf('px') < 0 &&
      str.indexOf('em') < 0 &&
      arr[0].indexOf('%') < 0) {
    str += 'px';
  }

  return str;
}

// -----------------------------------------

function getValByKeyCode(elem, key, isShift) {
  var value = Number(elem.value);
  var min = elem.getAttribute('data-min');
  var max = elem.getAttribute('data-max');

  var step = isShift ? 10 : 1;

  if (key === 38) {
    if (value >= 0 &&
         value < 1 &&
         min < 1) {

      step = 0.1;
    }
    value += step;
  }
  else if (key === 40) {
    if (value > 0 &&
         value <= 1 &&
         min < 1) {

      step = 0.1;
    }
    value -= step;
  }

  if (value < min) {
    value = min;
  }
  else if (max !== null && value > max) {
    value = max;
  }
  else {
    if (value > 0 && value < 1) {
      value = value.toFixed(1);
    }
    else {
      value = value.toFixed();
    }
  }

  return value;
}

// -----------------------------------------

function valueSetDefaultIfNAN(elem) {
  var value = elem.value;
  var defaultValue = elem.getAttribute('data-default');
  if (isNaN(value)) {
    return defaultValue;
  }

  return false;
}

// -----------------------------------------

function minMaxDef(elem) {
  var min = elem.getAttribute('data-min');
  min = min === null ? 0 : Number(min);

  var max = elem.getAttribute('data-max');
  max = max === null ? 100 : Number(max);

  var value = elem.value;

  var out = value > max ? max : value < min ? min : false;
  return out;
}

// -----------------------------------------

function createTemplate(item) {
  var itemType = item.className;
  var inputType = item.inputType;
  var data_attr = item.inputData;
  var lblContent = item.labelContent;
  var itemCustomClass = item.customClass ? item.customClass : '';

  var itemInpClass = itemType + '__inp';
  var itemLblClass = itemType + '__lbl';

  var replacements = {
    '{inputType}': inputType,
    '{itemType}': itemType,
    '{itemClass}': itemType,
    '{itemLblClass}': itemLblClass,
    '{itemInpClass}': itemInpClass,
    '{lblContent}': lblContent
  };

  var itemInputTempl = `<input type="{inputType}" id="{itemType}-{i}" class="${itemInpClass}" name="{itemType}" data-{itemType}-num="{i}" ${data_attr}>`;//
  var itemLabelTempl = `<label for="{itemType}-{i}" class="{itemLblClass} {itemType}--{i}">{lblContent}</label>`;
  var itemTempl = `<li class="{itemType}${itemCustomClass}">${itemInputTempl}${itemLabelTempl}</li>`;

  var result = fillTemplate(itemTempl, replacements);

  return result;
}

// -----------------------------------------

function fillTemplate(dataStr, replacements) {
  for (var key in replacements) {
    var findStr = key;
    var replaceWithStr = replacements[key];

    dataStr = dataStr.split(findStr).join(replaceWithStr);
  }
  return dataStr;
}

// -----------------------------------------

function objLength(obj) {
  var count = 0;
  for (var key in obj) {
    count++;
  }
  return count;
}

// Init
// -----------------------------------------

var painter = new ShadowPainter();

painter.init();

