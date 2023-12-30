import { ProjectModel } from "../models/ProjectModel";

export const filterArrayOfObjectByArrayOfObject = <T extends ProjectModel>(
  array1: T[],
  array2: T[]
): T[] => {
  return array1.filter((el1) => {
    return array2.every((el2) => {
      return el2.project_id !== el1.project_id;
    });
  });
};
