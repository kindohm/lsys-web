// import preactLogo from './assets/preact.svg'
// import viteLogo from '/vite.svg'
// import './app.css'
import { useState } from "react";

import { Input } from "./Input";

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
  bgColor: "#fff",
  foreColor: "#666"
};

export function App() {
  const [formData, setFormData] = useState(defaultFormData);
  return (
    <div>
      <div>
        <Input
          label="Iterations"
          type="number"
          value={formData.iterations.toString()}
          onChange={(v) =>
            setFormData({ ...formData, iterations: parseInt(v) })
          }
        />
        <Input
          label="Angle"
          type="number"
          value={formData.angle.toString()}
          onChange={(v) => setFormData({ ...formData, angle: parseInt(v) })}
        />
        <Input
          label="Constants"
          value={formData.constants}
          onChange={(v) => setFormData({ ...formData, constants: v })}
        />
        <Input
          label="Rule 1"
          value={formData.rule1}
          onChange={(v) => setFormData({ ...formData, rule1: v })}
        />
        <Input
          label="Rule 2"
          value={formData.rule2}
          onChange={(v) => setFormData({ ...formData, rule2: v })}
        />
        <Input
          label="Rule 3"
          value={formData.rule3}
          onChange={(v) => setFormData({ ...formData, rule3: v })}
        />
        <Input
          label="Rule 4"
          value={formData.rule4}
          onChange={(v) => setFormData({ ...formData, rule4: v })}
        />
        <Input
          label="Rule 5"
          value={formData.rule5}
          onChange={(v) => setFormData({ ...formData, rule5: v })}
        />
        <Input
          label="Background color"
          value={formData.bgColor}
          onChange={(v) => setFormData({ ...formData, bgColor: v })}
        />
        <Input
          label="Foreground color"
          value={formData.foreColor}
          onChange={(v) => setFormData({ ...formData, foreColor: v })}
        />
      </div>
      <canvas
        id="canvas"
        width="800"
        height="800"
        style={{backgroundColor: formData.bgColor}}
      />
    </div>
  );
}
