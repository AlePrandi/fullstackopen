import { create } from 'zustand'

const useCounterStore = create(set => ({
    counters: {
        goodCounter: 0,
        badCounter: 0,
        neutralCounter: 0,
        avgCounter: 0,
        totCounter: 0
    },
    actions: {
        incrementGood: () => set(state => ({
            counters: {
                ...state.counters,
                goodCounter: state.counters.goodCounter + 1,
                avgCounter: state.counters.avgCounter + 1,
                totCounter: state.counters.totCounter + 1
            }
        })),
        incrementBad: () => set(state => ({
            counters : {
                ...state.counters,
                badCounter: state.counters.badCounter + 1,
                avgCounter: state.counters.avgCounter - 1,
                totCounter: state.counters.totCounter + 1
            }
        })),
        incrementNeutral: () => set(state => ({
            counters: {
                ...state.counters,
                neutralCounter: state.counters.neutralCounter + 1,
                totCounter: state.counters.totCounter + 1
            }
        }))
    }
}))

export const useCounter = () => useCounterStore(state => state.counters)
export const useCounterControls = () => useCounterStore(state => state.actions)
