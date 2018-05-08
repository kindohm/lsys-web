/**
 * L-Systems
 * 
 * JavaScript Canvas 04/03/09
 * @author Kevin Roast  kevtoast at yahoo.com
 * Updated: 16th July 2012
 * 
 * TODO:
 * . more colour options
 * . inc/dec iterations buttons
 */

/**
 * Globals and helper functions
 */
var HEIGHT;
var WIDTH;
var FORECOLOR;
var BGCOLOR;
var LINEWIDTH;
var g_renderer;
var g_commands;

var colorBits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

// var randomColorPairs = [
//     { a: '#333333', b: '#eeeeee' },
//     { a: '#501e00', b: '#5375b7' },
//     { a: '#f0c7b2', b: '#08364e' },
//     { a: '#bcf01f', b: '#410ce6' },
//     { a: '#fad635', b: '#0126ce' },
//     { a: '#151367', b: '#f3f098' },
//     { a: '#2fef7b', b: '#d80b84' },
//     { a: '#700033', b: '#528a73' },
//     { a: '#006f0d', b: '#ff8ee9' },
//     { a: '#654648', b: '#42aca0' },
//     { a: '#3a4b35', b: '#fa36e7' },
//     { a: '#702424', b: '#95dbdb' },
//     { a: '#9918fa', b: '#6af706' },
//     { a: '#2f0798', b: '#d6ff67' },
//     { a: '#fcfcfc', b: '#7d8af4' },
//     { a: '#89fbbe', b: '#790040' },
//     { a: '#284d12', b: '#ddb5f5' },
//     { a: '#363636', b: '#d85161' },
//     { a: '#000c1f', b: '#86503d' },
//     { a: '#a1391b', b: '#0fbbef' },
//     { a: '#383838', b: '#df2eca' },
//     { a: '#38e2f3', b: '#de1907' },
//     { a: '#004dbd', b: '#f7854b' },
//     { a: '#9716eb', b: '#6bfb14' },
//     { a: '#185239', b: '#f4afca' }
// ];


/**
 * Window body onload handler
 */
window.addEventListener('load', onloadHandler, false);
function onloadHandler() {
    // bind ENTER key handler to Start button
    document.onkeyup = function (event) {
        var keyCode = (event === null ? window.event.keyCode : event.keyCode);
        if (keyCode === 13) {
            startHandler();
        }
    };

    setInputsFromUrl();
}

function setInputsFromUrl() {
    const params = getParamsFromUrl();

    var canvas = document.getElementById('canvas');
    var foreColorInput = document.getElementById("foreColorInput");
    var bgColorInput = document.getElementById("bgColorInput");
    var lineWidthInput = document.getElementById("lineWidthInput");
    var iterationsInput = document.getElementById("iterations");
    var angleInput = document.getElementById("angle");
    var axiomInput = document.getElementById("axiom");
    var rule1Input = document.getElementById("rule1");
    var rule2Input = document.getElementById("rule2");
    var rule3Input = document.getElementById("rule3");
    var rule4Input = document.getElementById("rule4");
    var rule5Input = document.getElementById("rule5");
    var canvasWidthInput = document.getElementById("canvasWidthInput");
    var canvasHeightInput = document.getElementById("canvasHeightInput");

    foreColorInput.value = params.foreColor || foreColorInput.value;
    bgColorInput.value = params.bgColor || bgColorInput.value;
    lineWidthInput.value = params.lineWidth || lineWidthInput.value;
    canvasWidthInput.value = params.canvasWidth || canvasWidthInput.value;
    canvasHeightInput.value = params.canvasHeight || canvasHeightInput.value;

    iterationsInput.value = params.iterations || iterationsInput.value;
    angleInput.value = params.angle || angleInput.value;
    axiomInput.value = params.axiom || axiomInput.value;
    rule1Input.value = params.rule1 || rule1Input.value;
    rule2Input.value = params.rule2 || rule2Input.value;
    rule3Input.value = params.rule3 || rule3Input.value;
    rule4Input.value = params.rule4 || rule4Input.value;
    rule5Input.value = params.rule5 || rule5Input.value;

    canvas.width = canvasWidthInput.value;
    canvas.height = canvasHeightInput.value;

    console.log(canvas.width);
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function getRandomAngle(){
    return getRandomIntInclusive(1,360);
    // const angles = [5,10,15,20,30,45,60,90,120,150,160];
    // return angles[getRandomIntInclusive(0,angles.length-1)];
}

function getRandomColor(){
    let color = '#';
    for (let i = 0; i < 6; i++){
        color += colorBits[getRandomIntInclusive(0, colorBits.length-1)];
    }
    return color;
}

function randomize() {

    var iterationsInput = document.getElementById("iterations");
    var angleInput = document.getElementById("angle");
    var axiomInput = document.getElementById("axiom");
    var rule1Input = document.getElementById("rule1");
    var rule2Input = document.getElementById("rule2");
    var rule3Input = document.getElementById("rule3");
    var rule4Input = document.getElementById("rule4");
    var rule5Input = document.getElementById("rule5");
    var foreColorInput = document.getElementById("foreColorInput");
    var bgColorInput = document.getElementById("bgColorInput");
    var lineWidthInput = document.getElementById("lineWidthInput");

    iterationsInput.value = getRandomIntInclusive(3, 5);


    angleInput.value = getRandomAngle(); // getRandomIntInclusive(1, 360);
        
    lineWidthInput.value = getRandomIntInclusive(1, 3);

    var possibleLetters = ['J', 'K', 'L', 'M', 'N'];
    var letters = [];
    var count = getRandomIntInclusive(2, 5);
    while (letters.length < count) {
        var index = getRandomIntInclusive(0, possibleLetters.length - 1);
        letters.push(possibleLetters[index]);
        possibleLetters.splice(index, 1);
    }

    var newAxiom = createString(letters);
    var newRule1 = letters.length >= 1 ? letters[0] + '=' + createString(letters) : '';
    var newRule2 = letters.length >= 2 ? letters[1] + '=' + createString(letters) : '';
    var newRule3 = letters.length >= 3 ? letters[2] + '=' + createString(letters) : '';
    var newRule4 = letters.length >= 4 ? letters[3] + '=' + createString(letters) : '';
    var newRule5 = letters.length >= 5 ? letters[4] + '=' + createString(letters) : '';

    axiomInput.value = newAxiom;
    rule1Input.value = newRule1;
    rule2Input.value = newRule2;
    rule3Input.value = newRule3;
    rule4Input.value = newRule4;
    rule5Input.value = newRule5;

    // var randomColor = randomColorPairs[getRandomIntInclusive(0, randomColorPairs.length - 1)];
    // if (Math.random() > 0.5) {
    //     foreColorInput.value = randomColor.a;
    //     bgColorInput.value = randomColor.b;
    // } else {
    //     foreColorInput.value = randomColor.b;
    //     bgColorInput.value = randomColor.a;
    // }

    foreColorInput.value = getRandomColor();
    bgColorInput.value = getRandomColor();

    startHandler();
}


function createString(letters, depth) {
    depth = depth || 1;
    if (depth > 3) return '';

    var letterCount = 0;
    var final = '';
    var rand = Math.random();
    while (true) {

        if (letterCount > 10) {
            letterCount = 0;
            final = '';
        }

        if (rand < 0.1) {
            final += '+';
        } else if (rand < 0.2) {
            final += '-';
        } else if (rand < 0.26) {
            final += '[' + createString(letters, depth + 1) + ']'
        } else if (rand > 0.26 && rand < 0.6) {
            letterCount++;
            final += letters[getRandomIntInclusive(0, letters.length - 1)];
        } else if (letterCount > 1 && rand > 0.6) {
            if (final.length > 30) {
                console.warn('way too big');
                return createString(letters, depth);
            }
            return final;
        }

        rand = Math.random();
    }
    return final;
}

function renderImage() {
    var canvas = document.getElementById('canvas');
    var img = canvas.toDataURL("image/png");
    var imgElement = document.getElementById('img');
    imgElement.setAttribute('src', img);
}

function getUrl() {
    var canvasWidth = parseInt(document.getElementById("canvasWidthInput").value);
    var canvasHeight = parseInt(document.getElementById("canvasHeightInput").value);
    var foreColor = document.getElementById("foreColorInput").value;
    var bgColor = document.getElementById("bgColorInput").value;
    var lineWidth = parseInt(document.getElementById("lineWidthInput").value);
    var axiom = document.getElementById("axiom").value;
    var angle = document.getElementById("angle").value;
    var iterations = document.getElementById("iterations").value;
    var rule1 = document.getElementById("rule1").value;
    var rule2 = document.getElementById("rule2").value;
    var rule3 = document.getElementById("rule3").value;
    var rule4 = document.getElementById("rule4").value;
    var rule5 = document.getElementById("rule5").value;

    return `index.html?canvasWidth=${encodeURIComponent(canvasWidth)}&canvasHeight=${encodeURIComponent(canvasHeight)}&foreColor=${encodeURIComponent(foreColor)}&bgColor=${encodeURIComponent(bgColor)}&lineWidth=${encodeURIComponent(lineWidth)}&iterations=${iterations}&angle=${angle}&axiom=${encodeURIComponent(axiom)}&rule1=${encodeURIComponent(rule1)}&rule2=${encodeURIComponent(rule2)}&rule3=${encodeURIComponent(rule3)}&rule4=${encodeURIComponent(rule4)}&rule5=${encodeURIComponent(rule5)}`;
}

function getParamsFromUrl() {
    return {
        canvasWidth: getParameterByName('canvasWidth'),
        canvasHeight: getParameterByName('canvasHeight'),
        foreColor: getParameterByName('foreColor'),
        bgColor: getParameterByName('bgColor'),
        lineWidth: getParameterByName('lineWidth'),
        iterations: getParameterByName('iterations'),
        angle: getParameterByName('angle'),
        axiom: getParameterByName('axiom'),
        rule1: getParameterByName('rule1'),
        rule2: getParameterByName('rule2'),
        rule3: getParameterByName('rule3'),
        rule4: getParameterByName('rule4'),
        rule5: getParameterByName('rule5')
    };
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function saveUrl() {
    const url = getUrl();
    history.pushState({}, "blasdf", url);
}

/**
 * Form button Start handler
 */
function startHandler() {
    saveUrl();

    var canvasWidth = parseInt(document.getElementById("canvasWidthInput").value);
    var canvasHeight = parseInt(document.getElementById("canvasHeightInput").value);

    var canvas = document.getElementById('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    HEIGHT = canvas.height;
    WIDTH = canvas.width;
    FORECOLOR = document.getElementById("foreColorInput").value;
    BGCOLOR = document.getElementById("bgColorInput").value;
    LINEWIDTH = parseInt(document.getElementById("lineWidthInput").value);

    document.getElementById('start').disabled = true;
    document.getElementById('randomize').disabled = true;
    document.getElementById('lsystems').style.cursor = "wait";

    updateStatus("Generating command string...", generateCmdString);
}

/**
 * L-Systems processing steps
 */
function generateCmdString() {
    // collect up Form input data required by the processor
    try {
        var lsys = new LSystems.LSystemsProcessor();
        lsys.iterations = parseInt(document.getElementById('iterations').value);
        lsys.axiom = document.getElementById('axiom').value;
        for (var i = 1; i <= 5; i++) {
            var rule = document.getElementById('rule' + i).value;
            if (rule && rule.length !== 0) {
                lsys.addRule(rule);
            }
        }

        // generate the cmd string
        var before = new Date();
        g_commands = lsys.generate();
        var after = new Date();

        updateStatus("Commands: " + g_commands.length + " in " + (after - before) + "ms. Calculating offsets...", calcOffsets);
    }
    catch (e) {
        alert("Error during LSystemsProcessor.generate()\n" + e);
        resetUI("Press Start to begin.");
    }
}

function calcOffsets() {
    try {
        // calc offset bounding box before render
        g_renderer = new LSystems.TurtleRenderer(WIDTH, HEIGHT);
        g_renderer.setAngle(parseInt(document.getElementById('angle').value));
        g_renderer.setConstants(document.getElementById('constants').value);
        g_renderer.setRenderLineWidths(false);
        var before = new Date();
        g_renderer.process(g_commands, false);
        var after = new Date();

        updateStatus("Calculated boundry in " + (after - before) + "ms. Rendering...", renderCmds);
    }
    catch (e) {
        alert("Error during TurtleRenderer.process()\n" + e);
        resetUI("Press Start to begin.");
    }
}

function renderCmds() {
    try {
        // calc new distance based on screen res
        var oldDistance = 10.0;
        var newDistance;
        var dim = g_renderer.getMinMaxValues();;
        if (dim.maxx - dim.minx > dim.maxy - dim.miny) {
            // X has the largest delta - use that
            newDistance = (WIDTH / (dim.maxx - dim.minx)) * oldDistance;
        }
        else {
            // Y has the largest delta - use that
            newDistance = (HEIGHT / (dim.maxy - dim.miny)) * oldDistance;
        }

        // calc rendering offsets

        // scale min/max values by new distance
        dim.minx *= (newDistance / oldDistance);
        dim.maxx *= (newDistance / oldDistance);
        dim.miny *= (newDistance / oldDistance);
        dim.maxy *= (newDistance / oldDistance);

        var xoffset = (WIDTH / 2) - (((dim.maxx - dim.minx) / 2) + dim.minx);
        var yoffset = (HEIGHT / 2) - (((dim.maxy - dim.miny) / 2) + dim.miny);

        // reprocess...
        g_renderer.setOffsets(xoffset, yoffset);
        g_renderer.setAngle(parseInt(document.getElementById('angle').value));
        g_renderer.setDistance(newDistance);
        var before = new Date();
        g_renderer.process(g_commands, true);
        var after = new Date();

        // completed
        resetUI("Finished rendering in " + (after - before) + "ms.");
        renderImage();

    }
    catch (e) {
        alert("Error during TurtleRenderer.process(draw)\n" + e);
        resetUI("Press Start to begin.");
    }
}

function resetUI(msg) {
    g_renderer = null;
    g_commands = null;
    updateStatus(msg);
    document.getElementById('lsystems').style.cursor = "";
    document.getElementById('start').disabled = false;
    document.getElementById('randomize').disabled = false;
}

function updateStatus(msg, fn) {
    document.getElementById('status').innerHTML = msg;
    if (fn) {
        setTimeout(fn, 0);
    }
}

var examples =
    [
        [
            // Heighway Dragon
            12, 90, "", "FX", "X=X+YF+", "Y=-FX-Y"
        ],
        [
            // Koch Curve
            4, 90, "", "-F", "F=F+F-F-F+F"
        ],
        [
            // Kevs Tree
            5, 22, "", "F", "F=C0FF-[C1-F+F+F]+[C2+F-F-F]"
        ],
        [
            // Kevs Wispy Tree
            5, 25, "", "FX", "F=C0FF-[C1-F+F]+[C2+F-F]", "X=C0FF+[C1+F]+[C3-F]"
        ],
        [
            // Kevs Pond Weed
            5, 27, "", "F", "F=C0FF[C1-F++F][C2+F--F]C3++F--F"
        ],
        [
            // Sierpinski triangle (curves)
            7, 60, "", "A", "A=B-A-B", "B=A+B+A"
        ],
        [
            // Sierpinski triangle (triangles)
            6, 120, "", "F-G-G", "F=F-G+F+G-F", "G=GG"
        ],
        [
            // Dragon Curve
            10, 90, "F", "FX", "X=X+YF", "Y=FX-Y"
        ],
        [
            // Fractal Plant
            6, 25, "X", "X", "X=C0F-[C2[X]+C3X]+C1F[C3+FX]-X", "F=FF"
        ],
        [
            // Koch Snowflake
            4, 60, "X", "F++F++F", "F=F-F++F-F", "X=FF"
        ],
        [
            // Pleasant Error
            4, 72, "", "F-F-F-F-F", "F=F-F++F+F-F-F"
        ],
        [
            // Sierpinski's Carpet
            4, 90, "", "F", "F=F+F-F-F-G+F+F+F-F", "G=GGG"
        ],
        [
            // Space Filling Curve
            6, 90, "XY", "X", "X=-YF+XFX+FY-", "Y=+XF-YFY-FX+"
        ],
        [
            // Sierpinski Median Curve
            8, 45, "", "L--F--L--F", "L=+R-F-R+", "R=-L+F+L-"
        ],
        [
            // Lace
            6, 30, "", "W", "W=+++X--F--ZFX+", "X=---W++F++YFW-", "Y=+ZFX--F--Z+++", "Z=-YFW++F++Y---"
        ],
        [
            // Joined Cross Curves
            3, 90, "F", "XYXYXYX+XYXYXYX+XYXYXYX+XYXYXYX", "F=", "X=FX+FX+FXFY-FY-", "Y=+FX+FXFY-FY-FY"
        ],
        [
            // Penrose Tiling
            5, 36, "6 7 8 9", "[7]++[7]++[7]++[7]++[7]", "6=81++91----71[-81----61]++", "7=+81--91[---61--71]+", "8=-61++71[+++81++91]-", "9=--81++++61[+91++++71]--71", "1="
        ]
    ];

function example(i) {
    if (!document.getElementById('start').disabled) {
        document.getElementById('iterations').value = examples[i][0];
        document.getElementById('angle').value = examples[i][1];
        document.getElementById('constants').value = examples[i][2];
        document.getElementById('axiom').value = examples[i][3];
        for (var n = 1; n <= 5; n++) {
            var rule = examples[i][3 + n];
            document.getElementById('rule' + n).value = (rule ? rule : "");
        }
        startHandler();
    }
}


/**
 * LSystems root namespace.
 * 
 * @namespace LSystems
 */
if (typeof LSystems == "undefined" || !LSystems) {
    var LSystems = {};
}

// Public constants
const ANTICLOCK = '+';
const CLOCKWISE = '-';
const PUSH = '[';
const POP = ']';
const COLOUR = 'C';

const RAD = Math.PI / 180.0;


/**
 * TurtleRenderer class
 * 
 * @namespace LSystems
 * @class LSystems.TurtleRenderer
 */
(function () {
    LSystems.TurtleRenderer = function (width, height) {
        if (width !== undefined && width !== null) {
            this._width = width;
        }
        if (height !== undefined && height !== null) {
            this._height = height;
        }

        //this._colourList = ["rgba(140, 80, 60, 0.75)", "rgba(24, 180, 24, 0.75)", "rgba(48, 220, 48, 0.5)", "rgba(64, 255, 64, 0.5)"];
        this._colourList = ["#2e2e2e"];
        this._constants = [];

        return this;
    };

    LSystems.TurtleRenderer.prototype =
        {
            /**
             * Rendering area width
             * 
             * @property _width
             * @type number
             */
            _width: 0,

            /**
             * Rendering area height
             * 
             * @property _height
             * @type number
             */
            _height: 0,

            /**
             * Rendering X coordinate offset
             * 
             * @property _xOffset
             * @type number
             */
            _xOffset: 0,

            /**
             * Rendering Y coordinate offset
             * 
             * @property _yOffset
             * @type number
             */
            _yOffset: 0,

            /**
             * Rendering distance units per forward turtle movement (default 10)
             * 
             * @property _distance
             * @type number
             */
            _distance: 10,

            /**
             * Turning angle in degrees to use per turtle rotation (default 30.0)
             * 
             * @property _angle
             * @type number
             */
            _angle: 30,

            /**
             * Minimum X coordinate reached during last processing phase
             * 
             * @property _minx
             * @type number
             */
            _minx: 0,

            /**
             * Minimum Y coordinate reached during last processing phase
             * 
             * @property _miny
             * @type number
             */
            _miny: 0,

            /**
             * Maximum X coordinate reached during last processing phase
             * 
             * @property _maxx
             * @type number
             */
            _maxx: 0,

            /**
             * Maximum Y coordinate reached during last processing phase
             * 
             * @property _maxy
             * @type number
             */
            _maxy: 0,

            /**
             * The maximum stack depth reached during processing
             * 
             * @property _maxStackDepth
             * @type number
             */
            _maxStackDepth: 0,

            /**
             * Rendering stack
             * 
             * @property _stack
             * @type object
             */
            _stack: null,

            /**
             * Colour list
             * 
             * @property _colourList
             * @type object
             */
            _colourList: null,

            /**
             * Constant values to ignore during turtle rendering
             * 
             * @property _constants
             * @type Array
             */
            _constants: null,

            /**
             * Render line width based on stack depth
             * 
             * @property _renderLineWidths
             * @type boolean
             */
            _renderLineWidths: true,

            /**
             * Set rendering distance units per forward turtle movement.
             *
             * @method setDistance
             * @param distance {number} Distance units per forward turtle movement
             * @return {LSystems.TurtleRenderer} returns 'this' for method chaining
             */
            setDistance: function setDistance(distance) {
                this._distance = distance;
                return this;
            },

            /**
             * Set turning angle in degrees to use per turtle rotation.
             *
             * @method setDistance
             * @param angle {number} Turning angle in degrees to use per turtle rotation
             * @return {LSystems.TurtleRenderer} returns 'this' for method chaining
             */
            setAngle: function setAngle(angle) {
                this._angle = angle;
                return this;
            },

            setRenderLineWidths: function setRenderLineWidths(val) {
                this._renderLineWidths = val;
            },

            /**
             * Return the min/max coordinate values reached during last processing run.
             *
             * @method getMinMaxValues
             * @return {LSystems.Dimension} representing the min/max coordinate values.
             */
            getMinMaxValues: function getMinMaxValues() {
                return new LSystems.Dimension(this._minx, this._miny, this._maxx, this._maxy);
            },

            /**
             * Set the x/y coordinate offsets for coordinate translation during rendering.
             * 
             * @method setOffsets
             * @param xOffset {number} x coord offset
             * @param yOffset {number} y coord offset
             */
            setOffsets: function (xOffset, yOffset) {
                if (xOffset !== undefined && xOffset !== null) {
                    this._xOffset = xOffset;
                }
                if (yOffset !== undefined && yOffset !== null) {
                    this._yOffset = yOffset;
                }
            },

            setConstants: function (constants) {
                this._constants = [];
                if (constants && constants.length !== 0) {
                    for (var i = 0; i < constants.length; i++) {
                        var c = constants.charAt(i);
                        if (c != ' ' && c != ',') {
                            this._constants[c] = true;
                        }
                    }
                }
            },

            /*
             * Process the command string and render
             * 
             * @method process
             * @param cmds {string}    string of valid command characters
             * @param draw {boolean}   True if the turtle should draw, false otherwise
             */
            process: function process(cmds, draw) {
                this._stack = [];

                var angle = this._angle;
                var distance = this._distance;
                var lastX;
                var lastY;

                var bg = BGCOLOR;
                var fg = FORECOLOR;

                if (draw) {
                    var canvas = document.getElementById('canvas');
                    var ctx = canvas.getContext('2d');

                    // clear the background 
                    ctx.save();
                    //ctx.fillStyle = "rgb(255,255,255)";
                    ctx.fillStyle = bg;
                    ctx.fillRect(0, 0, WIDTH, HEIGHT);

                    // offset as required
                    ctx.translate(this._xOffset, 0);

                    // initial colour if specific colouring not used
                    //ctx.strokeStyle = "rgb(0,0,0)";
                    ctx.strokeStyle = fg;
                }

                // start at grid 0,0 facing north with no colour index
                var pos = new LSystems.Location(0.0, 0.0, 90.0, -1);

                // process each command in turn
                var yOffset = this._yOffset, maxStackDepth = this._maxStackDepth;
                var colourList = this._colourList, stack = this._stack;
                var renderLineWidths = this._renderLineWidths;
                var rad, width, colour, lastColour = null;
                var c, len = cmds.length;
                for (var i = 0; i < len; i++) {
                    c = cmds.charAt(i);

                    switch (c) {
                        case COLOUR:
                            {
                                // get colour index from next character
                                pos.colour = (cmds.charAt(++i) - '0');
                                break;
                            }

                        case ANTICLOCK:
                            {
                                pos.heading += angle;
                                break;
                            }

                        case CLOCKWISE:
                            {
                                pos.heading -= angle;
                                break;
                            }

                        case PUSH:
                            {
                                stack.push(new LSystems.Location(pos.x, pos.y, pos.heading, pos.colour));
                                break;
                            }

                        case POP:
                            {
                                pos = stack.pop();
                                break;
                            }

                        default:
                            {
                                if (!this._constants[c]) {
                                    lastX = pos.x;
                                    lastY = pos.y;

                                    // move the turtle
                                    rad = pos.heading * RAD;
                                    pos.x += distance * Math.cos(rad);
                                    pos.y += distance * Math.sin(rad);

                                    if (draw) {
                                        // render this element
                                        if (renderLineWidths) {
                                            width = (maxStackDepth - stack.length);
                                            ctx.lineWidth = width >= 1 ? width : 1;
                                        }
                                        else {
                                            ctx.lineWidth = LINEWIDTH;
                                        }
                                        colour = colourList[pos.colour];
                                        if (colour && lastColour !== colour) {
                                            // ctx.strokeStyle = colour;
                                            // ctx.strokeStyle = fg;
                                            lastColour = colour;
                                        }
                                        ctx.strokeStyle = fg;
                                        ctx.beginPath();
                                        ctx.moveTo(lastX, HEIGHT - (lastY + yOffset));
                                        ctx.lineTo(pos.x, HEIGHT - (pos.y + yOffset));
                                        ctx.closePath();
                                        ctx.stroke();
                                    }
                                    else {
                                        // remember min/max position
                                        if (pos.x < this._minx) this._minx = pos.x;
                                        else if (pos.x > this._maxx) this._maxx = pos.x;
                                        if (pos.y < this._miny) this._miny = pos.y;
                                        else if (pos.y > this._maxy) this._maxy = pos.y;
                                        if (stack.length > this._maxStackDepth) this._maxStackDepth = stack.length;
                                    }
                                }
                                break;
                            }
                    }
                }

                // finalise rendering
                if (draw) {
                    ctx.restore();
                }
            }
        };
})();

/**
 * LSystemsProcessor class
 * 
 * @namespace LSystems
 * @class LSystems.LSystemsProcessor
 */
(function () {
    LSystems.LSystemsProcessor = function () {
        this.rules = [];
        return this;
    };

    LSystems.LSystemsProcessor.prototype =
        {
            /**
             * Number of iterations to perform
             * 
             * @property iterations
             * @type number
             */
            iterations: 1,

            /**
             * Root axiom
             * 
             * @property axiom
             * @type string
             */
            axiom: null,

            /**
             * Array of rules to process
             * 
             * @property rules
             * @type Array
             */
            rules: null,

            /**
             * Add a rule to the processor.
             * 
             * @method process
             * @param rule {string}  Rules must be of form: F=FX
             */
            addRule: function addRule(rule) {
                if (rule.length < 2 || rule.charAt(1) !== '=') {
                    throw "Rule must be of form: F=FX";
                }
                var rulePart = "";
                if (rule.length > 2) {
                    rulePart = rule.substring(2);
                }

                this.rules[rule.charAt(0)] = rulePart;
            },

            /**
             * Generate the l-system command string based on the axiom, rules and number of iterations to perform.
             * 
             * @method process
             */
            generate: function generate() {
                var ruleCount = this.rules.length;
                var axiom = null;
                var result = null;

                // process for each iteration
                for (var i = 0; i < this.iterations; i++) {
                    if (i == 0) {
                        // start with user defined root axiom
                        axiom = this.axiom;
                    }
                    else {
                        // use last result as new axiom
                        axiom = result.toString();
                    }

                    result = new StringBuffer();

                    // process each character of the Axiom
                    for (var c, len = axiom.length, rule, rules = this.rules, n = 0; n < len; n++) {
                        c = axiom.charAt(n);

                        // TODO: try array/strings etc.
                        rule = rules[c];
                        result.append(rule != null ? rule : c);

                        if (result.length() > 100000000) {
                            throw "Generated command string too large! 100,000,000 commands max.";
                        }
                    }
                }

                return result.toString();
            }
        };
})();


/**
 * Location structure class - all fields are public.
 * 
 * @namespace LSystems
 * @class LSystems.Location
 */
(function () {
    LSystems.Location = function (x, y, heading, colour) {
        this.x = x;
        this.y = y;
        this.heading = heading;
        this.colour = colour;

        return this;
    };

    LSystems.Location.prototype =
        {
            /**
             * X coordinate
             * 
             * @property x
             * @type number
             */
            x: 0,

            /**
             * Y coordinate
             * 
             * @property y
             * @type number
             */
            y: 0,

            /**
             * Heading angle
             * 
             * @property heading
             * @type number
             */
            heading: 0,

            /**
             * Colour index
             * 
             * @property colour
             * @type number
             */
            colour: 0
        };
})();


/**
 * Dimension structure class - all fields are public.
 * 
 * @namespace LSystems
 * @class LSystems.Dimension
 */
(function () {
    LSystems.Dimension = function (minx, miny, maxx, maxy) {
        this.minx = minx;
        this.miny = miny;
        this.maxx = maxx;
        this.maxy = maxy;

        return this;
    };

    LSystems.Dimension.prototype =
        {
            /**
             * Minimum X coordinate
             * 
             * @property minx
             * @type number
             */
            minx: 0,

            /**
             * Minimum Y coordinate
             * 
             * @property miny
             * @type number
             */
            miny: 0,

            /**
             * Maximum X coordinate
             * 
             * @property heading
             * @type number
             */
            maxx: 0,

            /**
             * Maximum Y coordinate
             * 
             * @property miny
             * @type number
             */
            maxy: 0
        };
})();


/**
 * StringBuffer object
 */
function StringBuffer(len) {
    this.buffer = len ? new Array(len) : [];
    this.count = 0;
    return this;
}

StringBuffer.prototype.append = function append(s) {
    this.buffer.push(s);
    this.count += s.length;
    return this;
};

StringBuffer.prototype.length = function length() {
    return this.count;
};

StringBuffer.prototype.toString = function toString() {
    return this.buffer.join("");
};