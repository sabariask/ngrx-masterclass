import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CounterState } from "./counter.state";


export const selectCounterState = createFeatureSelector<CounterState>('counter');

export const selectCount = createSelector(
    selectCounterState,
    (state) => state.count
);

export const selectLastUpdated = createSelector(
    selectCounterState,
    (state) => state.lastUpdated
);

export const selectIsPositive = createSelector(
    selectCount,
    (count) => count > 0
);

export const selectIsNegative = createSelector(
    selectCount,
    (count) => count < 0
);

export const selectAbsoluteValue = createSelector(
    selectCount,
    (count) => Math.abs(count)
);

export const selectCounterSummary = createSelector(
    selectCount,
    selectIsPositive,
    selectLastUpdated,
    (count, isPositive, lastUpdated) => ({
        count,
        isPositive,
        lastUpdated,
        status: count === 0 ? 'Zero' : isPositive ? 'Positive' : 'Negative'
    })
);