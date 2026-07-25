import type { ProjectType } from "@/types";
import { emmaissocial } from "./emmaissocial";
import { metalab } from "./metalab";
import { synthetictheatre } from "./synthetictheatre";
import { voltra } from "./voltra";

export const projects = [
  voltra,
  metalab,
  emmaissocial,
  synthetictheatre,
] as ProjectType[];
