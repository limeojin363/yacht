import type { AlterOption } from "../../status";
import AlterOptionMap from "../maps";

const getRandomItemFromArray = <T>(arr: T[]) => {
  if (arr.length === 0) {
    return undefined;
  }

  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

export const generateAlterOptions = (): AlterOption[] => {
  const dependencies: string[] = [];
  const ret: AlterOption[] = [];

  const name1 = getRandomItemFromArray(Object.keys(AlterOptionMap))!;
  AlterOptionMap[name1]?.handDependencies.forEach((dep) => {
    dependencies.push(dep);
  });

  ret.push({
    name: name1,
    revealed: false,
    turn: 2,
  });

  const name2 = getRandomItemFromArray(
    Object.keys(AlterOptionMap).filter((name) =>
      AlterOptionMap[name]!.handDependencies.every(
        (dep) => !dependencies.includes(dep)
      )
    )
  );

  ret.push({
    name: name2!,
    revealed: false,
    turn: 4,
  });

  const name3 = getRandomItemFromArray(
    Object.keys(AlterOptionMap).filter((name) =>
      AlterOptionMap[name]!.handDependencies.every(
        (dep) => !dependencies.includes(dep)
      )
    )
  );

  ret.push({
    name: name3!,
    revealed: false,
    turn: 6,
  });

  return ret;
};
