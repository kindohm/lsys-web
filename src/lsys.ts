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

type MinMaxValues = {
  maxx: number;
  maxy: number;
  minx: number;
  miny: number;
};

type Renderer = {
  setOffsets: (xOffset: number, yOffset: number) => void;
  setAngle: (angle: number) => void;
  setDistance: (dist: number) => void;
  getMinMaxValues: () => MinMaxValues;
  process: (
    commands: string[],
    draw: boolean,
    bgColor: string,
    foreColor: string,
    canvasWidth: number,
    canvasHeight: number,
    lineWeight: number
  ) => void;
  setRenderLineWidths: (x: boolean) => void;
};

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
  // var canvas = document.getElementById("canvas");
  // canvas.width = canvasWidth;
  // canvas.height = canvasHeight;
  // HEIGHT = canvas.height;
  // WIDTH = canvas.width;
  // FORECOLOR = foreColor;
  // BGCOLOR = bgColor;
  // LINEWIDTH = lineWeight;

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
    bgColor,
    foreColor,
    canvasHeight,
    canvasWidth,
    lineWeight,
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
  bgColor,
  foreColor,
  canvasWidth,
  canvasHeight,
  lineWeight,
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
  bgColor: string;
  foreColor: string;
  canvasWidth: number;
  canvasHeight: number;
  lineWeight: number;
}) {
  // collect up Form input data required by the processor
  try {
    // @ts-ignore comes from .js file
    const lsys = new LSystems.LSystemsProcessor();
    lsys.iterations = iterations;
    lsys.axiom = axiom;

    rule1 && lsys.addRule(rule1);
    rule2 && lsys.addRule(rule2);
    rule3 && lsys.addRule(rule3);
    rule4 && lsys.addRule(rule4);
    rule5 && lsys.addRule(rule5);

    // generate the cmd string
    const commands: string[] = lsys.generate();

    calcOffsets({
      angle,
      constants,
      bgColor,
      foreColor,
      canvasWidth,
      canvasHeight,
      lineWeight,
      commands,
    });
  } catch (e) {
    console.error(e);
  }
}

function calcOffsets({
  angle,
  constants,
  bgColor,
  foreColor,
  canvasWidth,
  canvasHeight,
  lineWeight,
  commands,
}: {
  angle: number;
  constants: string;
  bgColor: string;
  foreColor: string;
  canvasWidth: number;
  canvasHeight: number;
  lineWeight: number;
  commands: string[];
}) {
  try {
    // @ts-ignore comes from .js file
    const renderer: Renderer = new LSystems.TurtleRenderer(
      canvasWidth,
      canvasHeight
    );
    renderer.setAngle(angle);
    // g_renderer.setConstants(document.getElementById("constants").value);
    renderer.setRenderLineWidths(false);
    renderer.process(
      commands,
      false,
      bgColor,
      foreColor,
      canvasWidth,
      canvasHeight,
      lineWeight
    );

    renderCmds({
      angle,
      bgColor,
      foreColor,
      canvasWidth,
      canvasHeight,
      lineWeight,
      commands,
      renderer,
    });
  } catch (e) {
    console.error(e);
  }
}

function renderCmds({
  angle,
  bgColor,
  foreColor,
  canvasWidth,
  canvasHeight,
  lineWeight,
  commands,
  renderer,
}: {
  angle: number;
  bgColor: string;
  foreColor: string;
  canvasWidth: number;
  canvasHeight: number;
  lineWeight: number;
  commands: string[];
  renderer: Renderer;
}) {
  try {
    // calc new distance based on screen res
    var oldDistance = 10.0;
    var newDistance;
    var dim = renderer.getMinMaxValues();
    if (dim.maxx - dim.minx > dim.maxy - dim.miny) {
      // X has the largest delta - use that
      newDistance = (canvasWidth / (dim.maxx - dim.minx)) * oldDistance;
    } else {
      // Y has the largest delta - use that
      newDistance = (canvasHeight / (dim.maxy - dim.miny)) * oldDistance;
    }

    // calc rendering offsets

    // scale min/max values by new distance
    dim.minx *= newDistance / oldDistance;
    dim.maxx *= newDistance / oldDistance;
    dim.miny *= newDistance / oldDistance;
    dim.maxy *= newDistance / oldDistance;

    var xoffset = canvasWidth / 2 - ((dim.maxx - dim.minx) / 2 + dim.minx);
    var yoffset = canvasHeight / 2 - ((dim.maxy - dim.miny) / 2 + dim.miny);

    // reprocess...
    renderer.setOffsets(xoffset, yoffset);
    renderer.setAngle(angle);
    renderer.setDistance(newDistance);
    renderer.process(
      commands,
      true,
      bgColor,
      foreColor,
      canvasWidth,
      canvasHeight,
      lineWeight
    );
  } catch (e) {
    console.error(e);
  }
}
