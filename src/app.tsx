import { useState } from "react";
import { Input } from "./Input";
import styled from "styled-components";

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
};

const Form = styled.div`
  max-width: 800px;
  position: absolute;
  border: solid 1px #999;
  padding: 1rem;
  margin: 1rem;
  background-color: #cccccccc;
`;

const Button = styled.button`
  width: 100%;
`;

export function App() {
  const [formData, setFormData] = useState(defaultFormData);
  return (
    <div>
      <Form>
        <div className="row">
          <div className="col">
            {" "}
            <Input
              label="Canvas width"
              type="number"
              value={formData.canvasWidth.toString()}
              onChange={(v) =>
                setFormData({ ...formData, canvasWidth: parseInt(v) })
              }
            />
          </div>
          <div className="col">
            {" "}
            <Input
              label="Background color"
              value={formData.bgColor}
              onChange={(v) => setFormData({ ...formData, bgColor: v })}
            />
          </div>
          <div className="col">
            <Input
              label="Iterations"
              type="number"
              value={formData.iterations.toString()}
              onChange={(v) =>
                setFormData({ ...formData, iterations: parseInt(v) })
              }
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            {" "}
            <Input
              label="Canvas height"
              type="number"
              value={formData.canvasHeight.toString()}
              onChange={(v) =>
                setFormData({ ...formData, canvasHeight: parseInt(v) })
              }
            />
          </div>
          <div className="col">
            {" "}
            <Input
              label="Foreground color"
              value={formData.foreColor}
              onChange={(v) => setFormData({ ...formData, foreColor: v })}
            />
          </div>
          <div className="col">
            {" "}
            <Input
              label="Angle"
              type="number"
              value={formData.angle.toString()}
              onChange={(v) => setFormData({ ...formData, angle: parseInt(v) })}
            />
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
          <div className="col">
            <Button className="btn btn-primary btn-sm">Render</Button>
          </div>
          <div className="col">
            <Button className="btn btn-primary btn-sm">Randomize</Button>
          </div>
        </div>

        <div className="collapse" id="collapseExample">
          <div className="row">
            <div className="col">
              <Input
                label="Constants"
                value={formData.constants}
                onChange={(v) => setFormData({ ...formData, constants: v })}
              />
            </div>
            <div className="col">
              <Input
                label="Rule 1"
                value={formData.rule1}
                onChange={(v) => setFormData({ ...formData, rule1: v })}
              />
            </div>
            <div className="col">
              <Input
                label="Rule 2"
                value={formData.rule2}
                onChange={(v) => setFormData({ ...formData, rule2: v })}
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Input
                label="Rule 3"
                value={formData.rule3}
                onChange={(v) => setFormData({ ...formData, rule3: v })}
              />
            </div>
            <div className="col">
              <Input
                label="Rule 4"
                value={formData.rule4}
                onChange={(v) => setFormData({ ...formData, rule4: v })}
              />
            </div>
            <div className="col">
              <Input
                label="Rule 5"
                value={formData.rule5}
                onChange={(v) => setFormData({ ...formData, rule5: v })}
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
