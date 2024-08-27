import { randInt } from "./randInt";

export const getRandomRules = () => {
  const possibleLetters = ["J", "K", "L", "M", "N"];
  const letters = [];
  const count = randInt(2, 5);
  while (letters.length < count) {
    var index = randInt(0, possibleLetters.length - 1);
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

  const constants = getConstants(letters);
  const axiom = createString(letters);
  return { axiom, constants, rule1, rule2, rule3, rule4, rule5 };
};

const getConstants = (letters: string[]) => {
  if (Math.random() < 0.25) return "";
  const howMany = randInt(1, letters.length - 1);
  return letters.slice(0, howMany).join(" ");
};

const createString = (letters: string[], depth?: number) => {
  depth = depth || 1;
  if (depth > 3) return "";

  let letterCount = 0;
  let final = "";
  let rand = Math.random();
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
      final += letters[randInt(0, letters.length - 1)];
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
};
