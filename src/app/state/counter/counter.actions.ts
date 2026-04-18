import { createAction, props } from "@ngrx/store";


export const increment = createAction('[Counter] Increment');
export const decrement = createAction('[Counter] Decrement');
export const reset = createAction('[Counter] Reset');


export const incrementBy = createAction(
    '[Counter] Increment By',
    props<{ amount: number }>()
);

export const decrementBy = createAction(
    // [Counter] - where it came from, Decrement by - what happend
    '[Counter] Decrement By',
    props<{ amount: number }>()
);