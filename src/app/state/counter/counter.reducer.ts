import { createReducer, on } from "@ngrx/store";
import { initialCounterState } from "./counter.state";
import * as CounterActions from '../counter/counter.actions';


export const counterReducer = createReducer(
    initialCounterState,

    on(CounterActions.increment, (state) => ({
        ...state,
        count: state.count + 1,
        lastUpdated: new Date().toISOString()
    })),

    on(CounterActions.decrement, (state) => ({
        ...state,
        count: state.count - 1,
        lastUpdated: new Date().toISOString()
    })),

    on(CounterActions.reset, (state) => ({
        ...state,
        count: 0,
        lastUpdated: new Date().toISOString()
    })),

    on(CounterActions.incrementBy, (state, { amount }) => ({
        ...state,
        count: state.count + amount,
        lastUpdated: new Date().toISOString()
    })),

    on(CounterActions.decrementBy, (state, { amount }) => ({
        ...state,
        count: state.count - amount,
        lastUpdated: new Date().toISOString()
    })),
)