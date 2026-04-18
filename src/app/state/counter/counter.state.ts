
export interface CounterState {
    count: number;
    lastUpdated: string | null;
}

export const initialCounterState: CounterState = {
    count: 0,
    lastUpdated: null
}