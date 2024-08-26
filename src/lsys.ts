// @ts-nocheck

type StartArgs = {
  canvasWidth: number;
  canvasHeight: number;
  foreColor: string;
  bgColor: string;
  lineWeight: number;
  iterations: number;
  axiom: string;
  rule1: string;
  rule2: string;
  rule3: string;
  rule4: string;
  rule5: string;
  angle: number;
  constants: string;
};

var HEIGHT;
var WIDTH;
var FORECOLOR;
var BGCOLOR;
var LINEWIDTH;
var g_renderer;
var g_commands;

export function startHandler({
  canvasWidth,
  canvasHeight,
  foreColor,
  bgColor,
  lineWeight,
  iterations,
  axiom,
  rule1,
  rule2,
  rule3,
  rule4,
  rule5,
  angle,
  constants,
}: StartArgs) {
  var canvas = document.getElementById("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  HEIGHT = canvas.height;
  WIDTH = canvas.width;
  FORECOLOR = foreColor;
  BGCOLOR = bgColor;
  LINEWIDTH = lineWeight;

  generateCmdString({
    iterations,
    axiom,
    rule1,
    rule2,
    rule3,
    rule4,
    rule5,
    angle,
    constants,
  });
}

function generateCmdString({
  iterations,
  axiom,
  rule1,
  rule2,
  rule3,
  rule4,
  rule5,
  angle,
  constants,
}: {
  iterations: number;
  axiom: string;
  rule1: string;
  rule2: string;
  rule3: string;
  rule4: string;
  rule5: string;
  angle: number;
  constants: string;
}) {
  // collect up Form input data required by the processor
  try {
    var lsys = new LSystems.LSystemsProcessor();
    lsys.iterations = iterations;
    lsys.axiom = axiom;

    rule1 && lsys.addRule(rule1);
    rule2 && lsys.addRule(rule2);
    rule3 && lsys.addRule(rule3);
    rule4 && lsys.addRule(rule4);
    rule5 && lsys.addRule(rule5);

    // generate the cmd string
    var before = new Date();
    g_commands = lsys.generate();
    var after = new Date();

    calcOffsets({ angle, constants });
  } catch (e) {
    console.error(e);
  }
}

function calcOffsets({
  angle,
  constants,
}: {
  angle: number;
  constants: string;
}) {
  try {
    g_renderer = new LSystems.TurtleRenderer(WIDTH, HEIGHT);
    g_renderer.setAngle(angle);
    // g_renderer.setConstants(document.getElementById("constants").value);
    g_renderer.setRenderLineWidths(false);
    var before = new Date();
    g_renderer.process(g_commands, false);
    var after = new Date();

    renderCmds({ angle });
  } catch (e) {
    console.error(e);
  }
}

function renderCmds({ angle }: { angle: number }) {
  try {
    // calc new distance based on screen res
    var oldDistance = 10.0;
    var newDistance;
    var dim = g_renderer.getMinMaxValues();
    if (dim.maxx - dim.minx > dim.maxy - dim.miny) {
      // X has the largest delta - use that
      newDistance = (WIDTH / (dim.maxx - dim.minx)) * oldDistance;
    } else {
      // Y has the largest delta - use that
      newDistance = (HEIGHT / (dim.maxy - dim.miny)) * oldDistance;
    }

    // calc rendering offsets

    // scale min/max values by new distance
    dim.minx *= newDistance / oldDistance;
    dim.maxx *= newDistance / oldDistance;
    dim.miny *= newDistance / oldDistance;
    dim.maxy *= newDistance / oldDistance;

    var xoffset = WIDTH / 2 - ((dim.maxx - dim.minx) / 2 + dim.minx);
    var yoffset = HEIGHT / 2 - ((dim.maxy - dim.miny) / 2 + dim.miny);

    // reprocess...
    g_renderer.setOffsets(xoffset, yoffset);
    g_renderer.setAngle(angle);
    g_renderer.setDistance(newDistance);
    g_renderer.process(g_commands, true);
  } catch (e) {
    console.error(e);
  }
}

function renderImage() {
  var canvas = document.getElementById("canvas");
  var img = canvas.toDataURL("image/png");
  var imgElement = document.getElementById("img");
  imgElement.setAttribute("src", img);
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
const ANTICLOCK = "+";
const CLOCKWISE = "-";
const PUSH = "[";
const POP = "]";
const COLOUR = "C";

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

  LSystems.TurtleRenderer.prototype = {
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
      return new LSystems.Dimension(
        this._minx,
        this._miny,
        this._maxx,
        this._maxy
      );
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
          if (c != " " && c != ",") {
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
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");

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
      var yOffset = this._yOffset,
        maxStackDepth = this._maxStackDepth;
      var colourList = this._colourList,
        stack = this._stack;
      var renderLineWidths = this._renderLineWidths;
      var rad,
        width,
        colour,
        lastColour = null;
      var c,
        len = cmds.length;
      for (var i = 0; i < len; i++) {
        c = cmds.charAt(i);

        switch (c) {
          case COLOUR: {
            // get colour index from next character
            pos.colour = cmds.charAt(++i) - "0";
            break;
          }

          case ANTICLOCK: {
            pos.heading += angle;
            break;
          }

          case CLOCKWISE: {
            pos.heading -= angle;
            break;
          }

          case PUSH: {
            stack.push(
              new LSystems.Location(pos.x, pos.y, pos.heading, pos.colour)
            );
            break;
          }

          case POP: {
            pos = stack.pop();
            break;
          }

          default: {
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
                  width = maxStackDepth - stack.length;
                  ctx.lineWidth = width >= 1 ? width : 1;
                } else {
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
              } else {
                // remember min/max position
                if (pos.x < this._minx) this._minx = pos.x;
                else if (pos.x > this._maxx) this._maxx = pos.x;
                if (pos.y < this._miny) this._miny = pos.y;
                else if (pos.y > this._maxy) this._maxy = pos.y;
                if (stack.length > this._maxStackDepth)
                  this._maxStackDepth = stack.length;
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
    },
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

  LSystems.LSystemsProcessor.prototype = {
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
      if (rule.length < 2 || rule.charAt(1) !== "=") {
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
        } else {
          // use last result as new axiom
          axiom = result.toString();
        }

        result = new StringBuffer();

        // process each character of the Axiom
        for (
          var c, len = axiom.length, rule, rules = this.rules, n = 0;
          n < len;
          n++
        ) {
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
    },
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

  LSystems.Location.prototype = {
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
    colour: 0,
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

  LSystems.Dimension.prototype = {
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
    maxy: 0,
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
