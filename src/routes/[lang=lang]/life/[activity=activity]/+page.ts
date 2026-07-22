import { languages } from "$lib/dictionaries";
import { activities } from "../../../../params/activity";
import type { EntryGenerator } from "./$types";

export const entries: EntryGenerator = () =>
  activities.flatMap((activity) => languages.map((lang) => ({ lang, activity })));
