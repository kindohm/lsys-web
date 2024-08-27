import { useEffect, useState } from "react";
import { Input } from "./components/Input";
import styled from "styled-components";
import { run } from "./lsys";
import { Checkbox } from "./components/Checkbox";
import { randInt } from "./util/randInt";
import { getRandomRules } from "./util/getRandomRules";
import { randColor } from "./util/randColor";

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

const initialRules = getRandomRules();

const defaultFormData: FormData = {
  angle: 45,
  constants: "",
  iterations: 3,
  axiom: initialRules.axiom,
  rule1: initialRules.rule1,
  rule2: initialRules.rule2,
  rule3: initialRules.rule3,
  rule4: initialRules.rule4,
  rule5: initialRules.rule5,
  bgColor: randColor(),
  foreColor: randColor(),
  canvasWidth: 600,
  canvasHeight: 600,
  lineWeight: 1,
  randomizeColors: true,
  randomizeLineWeight: false,
};

const Form = styled.div`
  max-width: 400px;
  position: absolute;
  right: 0;
  top: 0;
  border: solid 1px #999;
  padding: 1rem;
  margin: 1rem;
  background-color: #cccccccc;
  font-size: 0.75rem;
`;

const Button = styled.button`
  width: 100%;
  font-size: 0.75rem;
`;

export function App() {
  const [formData, setFormData] = useState(defaultFormData);
  const [firstRender, setFirstRender] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (firstRender) {
      return;
    }
    setFirstRender(true);
    render();
  }, [firstRender]);

  const render = (data?: FormData) => {
    setBusy(true);
    run(data ? data : formData);
    setBusy(false);
  };

  const randomize = () => {
    const { randomizeLineWeight, randomizeColors } = formData;
    const newRules = getRandomRules();
    const newFormData = {
      ...formData,
      ...newRules,
      bgColor: randomizeColors ? randColor() : formData.bgColor,
      foreColor: randomizeColors ? randColor() : formData.foreColor,
      iterations: randInt(1, 6),
      angle: randInt(0, 364),
      lineWeight: randomizeLineWeight ? randInt(1, 4) : formData.lineWeight,
    };
    setFormData(newFormData);
    render(newFormData);
  };

  return (
    <div>
      <Form>
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
              randomize={() => {
                const newFormData = { ...formData, bgColor: randColor() };
                setFormData(newFormData);
                render(newFormData);
              }}
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
              randomize={() => {
                const newFormData = { ...formData, foreColor: randColor() };
                setFormData(newFormData);
                render(newFormData);
              }}
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
