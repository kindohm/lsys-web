import { useState } from "react";
import { Input } from "./Input";
import styled from "styled-components";
import { startHandler } from "./lsys";
import { Checkbox } from "./Checkbox";

type FormData = {
  angle: number;
  constants: string;
  iterations: number;
  axiom: string;
  rule1: string;
  rule2: string;
  rule3: string;
  rule4: string;
  rule5: string;
  bgColor: string;
  foreColor: string;
  canvasWidth: number;
  canvasHeight: number;
  lineWeight: number;
  randomizeColors: boolean;
  randomizeLineWeight: boolean;
};

const defaultFormData: FormData = {
  angle: 45,
  constants: "",
  iterations: 3,
  axiom: "FX",
  rule1: "X=X+YF+",
  rule2: "Y=-FX-Y",
  rule3: "",
  rule4: "",
  rule5: "",
  bgColor: "#eee",
  foreColor: "#666",
  canvasWidth: 800,
  canvasHeight: 512,
  lineWeight: 1,
  randomizeColors: true,
  randomizeLineWeight: true,
};

const Form = styled.div`
  max-width: 400px;
  position: absolute;
  border: solid 1px #999;
  padding: 1rem;
  margin: 1rem;
  background-color: #cccccccc;
  font-size: 0.75rem;
`;

const colorBits = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
];

const Button = styled.button`
  width: 100%;
  font-size: 0.75rem;
`;

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function getRandomColor() {
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += colorBits[getRandomIntInclusive(0, colorBits.length - 1)];
  }
  return color;
}

function createString(letters: string[], depth?: number) {
  depth = depth || 1;
  if (depth > 3) return "";

  var letterCount = 0;
  var final = "";
  var rand = Math.random();
  while (true) {
    if (letterCount > 10) {
      letterCount = 0;
      final = "";
    }

    if (rand < 0.1) {
      final += "+";
    } else if (rand < 0.2) {
      final += "-";
    } else if (rand < 0.26) {
      final += "[" + createString(letters, depth + 1) + "]";
    } else if (rand > 0.26 && rand < 0.6) {
      letterCount++;
      final += letters[getRandomIntInclusive(0, letters.length - 1)];
    } else if (letterCount > 1 && rand > 0.6) {
      if (final.length > 30) {
        // console.warn("way too big");
        return createString(letters, depth);
      }
      return final;
    }

    rand = Math.random();
  }
  return final;
}

const getRandomRules = () => {
  const possibleLetters = ["J", "K", "L", "M", "N"];
  const letters = [];
  const count = getRandomIntInclusive(2, 5);
  while (letters.length < count) {
    var index = getRandomIntInclusive(0, possibleLetters.length - 1);
    letters.push(possibleLetters[index]);
    possibleLetters.splice(index, 1);
  }

  const rule1 =
    letters.length >= 1 ? letters[0] + "=" + createString(letters) : "";
  const rule2 =
    letters.length >= 2 ? letters[1] + "=" + createString(letters) : "";
  const rule3 =
    letters.length >= 3 ? letters[2] + "=" + createString(letters) : "";
  const rule4 =
    letters.length >= 4 ? letters[3] + "=" + createString(letters) : "";
  const rule5 =
    letters.length >= 5 ? letters[4] + "=" + createString(letters) : "";

  const axiom = createString(letters);
  return { axiom, rule1, rule2, rule3, rule4, rule5 };
};

export function App() {
  const [formData, setFormData] = useState(defaultFormData);
  const [, setFormOpen] = useState(true);

  const render = (data?: FormData) => {
    startHandler(data ? data : formData);
  };

  const randomize = () => {
    const { randomizeLineWeight, randomizeColors } = formData;
    const newRules = getRandomRules();
    const newFormData = {
      ...formData,
      ...newRules,
      bgColor: randomizeColors ? getRandomColor() : formData.bgColor,
      foreColor: randomizeColors ? getRandomColor() : formData.foreColor,
      iterations: getRandomIntInclusive(1, 6),
      angle: getRandomIntInclusive(0, 364),
      lineWeight: randomizeLineWeight
        ? getRandomIntInclusive(1, 4)
        : formData.lineWeight,
    };
    setFormData(newFormData);
    // setTimeout(() => render(), 100);
    render(newFormData);
  };

  return (
    <div>
      <Form>
        <div className="row justify-content-end mx-1">
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setFormOpen(false)}
          ></button>
        </div>
        <div className="row">
          <div className="col">
            <Input
              label="Width"
              type="number"
              min={1}
              max={2000}
              value={formData.canvasWidth.toString()}
              onChange={(v) => {
                const newFormData = { ...formData, canvasWidth: parseInt(v) };
                setFormData(newFormData);
                render(newFormData);
              }}
            />
          </div>
          <div className="col">
            <Input
              label="Height"
              type="number"
              min={1}
              max={2000}
              value={formData.canvasHeight.toString()}
              onChange={(v) => {
                const newFormData = { ...formData, canvasHeight: parseInt(v) };
                setFormData(newFormData);
                render(newFormData);
              }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <Input
              label="Background"
              value={formData.bgColor}
              onChange={(v) => {
                const newFormData = { ...formData, bgColor: v };
                setFormData(newFormData);
                render(newFormData);
              }}
            />
          </div>
          <div className="col">
            <Input
              label="Foreground"
              value={formData.foreColor}
              onChange={(v) => {
                const newFormData = { ...formData, foreColor: v };
                setFormData(newFormData);
                render(newFormData);
              }}
            />
          </div>
        </div>

        <div className="row"></div>

        <div className="row">
          <div className="col">
            <Input
              label="Iterations"
              type="number"
              min={1}
              max={6}
              value={formData.iterations.toString()}
              onChange={(v) => {
                const newFormData = { ...formData, iterations: parseInt(v) };
                setFormData(newFormData);
                render(newFormData);
              }}
            />
          </div>
          <div className="col">
            <Input
              label="Line weight"
              type="number"
              min={1}
              max={6}
              value={formData.lineWeight.toString()}
              onChange={(v) => {
                const newFormData = { ...formData, lineWeight: parseInt(v) };
                setFormData(newFormData);
                render(newFormData);
              }}
            />
          </div>
        </div>

        <div className="row mt-1">
          <div className="col">
            <Checkbox
              label="Randomize colors"
              checked={formData.randomizeColors}
              onChange={(checked) =>
                setFormData({ ...formData, randomizeColors: checked })
              }
            />
          </div>

          <div className="col">
            <Checkbox
              label="Randomize line weight"
              checked={formData.randomizeLineWeight}
              onChange={(checked) =>
                setFormData({ ...formData, randomizeLineWeight: checked })
              }
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <Button className="btn btn-primary btn-sm" onClick={() => render()}>
              Render
            </Button>
          </div>
          <div className="col">
            <Button className="btn btn-primary btn-sm" onClick={randomize}>
              Randomize
            </Button>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col">
            <Button
              className="btn btn-primary btn-sm"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseExample"
              aria-expanded="false"
              aria-controls="collapseExample"
            >
              Show advanced
            </Button>
          </div>
        </div>

        <div className="collapse" id="collapseExample">
          <div className="row mt-2">
            <div className="col">
              <Input
                label="Angle"
                type="number"
                min={0}
                max={360}
                value={formData.angle.toString()}
                onChange={(v) => {
                  const newFormData = { ...formData, angle: parseInt(v) };
                  setFormData(newFormData);
                  render(newFormData);
                }}
              />
            </div>
            <div className="col">
              <Input
                disabled={true}
                label="Constants"
                value={formData.constants}
                onChange={(v) => setFormData({ ...formData, constants: v })}
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Input
                label="Rule 1"
                value={formData.rule1}
                onChange={(v) => {
                  const newFormData = { ...formData, rule1: v };
                  setFormData(newFormData);
                  render(newFormData);
                }}
              />
            </div>
            <div className="col">
              <Input
                label="Rule 2"
                value={formData.rule2}
                onChange={(v) => {
                  const newFormData = { ...formData, rule2: v };
                  setFormData(newFormData);
                  render(newFormData);
                }}
              />
            </div>
          </div>
          <div className="row">
            {" "}
            <div className="col">
              <Input
                label="Rule 3"
                value={formData.rule3}
                onChange={(v) => {
                  const newFormData = { ...formData, rule3: v };
                  setFormData(newFormData);
                  render(newFormData);
                }}
              />
            </div>
            <div className="col">
              <Input
                label="Rule 4"
                value={formData.rule4}
                onChange={(v) => {
                  const newFormData = { ...formData, rule4: v };
                  setFormData(newFormData);
                  render(newFormData);
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Input
                label="Rule 5"
                value={formData.rule5}
                onChange={(v) => {
                  const newFormData = { ...formData, rule5: v };
                  setFormData(newFormData);
                  render(newFormData);
                }}
              />
            </div>
            <div className="col">
              <Input
                label="Axiom"
                value={formData.axiom}
                onChange={(v) => {
                  const newFormData = { ...formData, axiom: v };
                  setFormData(newFormData);
                  render(newFormData);
                }}
              />
            </div>
          </div>
        </div>
      </Form>
      <canvas
        id="canvas"
        width={formData.canvasWidth}
        height={formData.canvasHeight}
        style={{ backgroundColor: formData.bgColor, border: "solid 1px #333" }}
      />
    </div>
  );
}
