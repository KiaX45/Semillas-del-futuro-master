import { writable, Writable } from "svelte/store";
import type { concert } from "../lib/Logic/concerts";


//Para conciertos
export const buyingConcert: Writable < concert | null> = writable(null);
