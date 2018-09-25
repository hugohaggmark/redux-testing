import { AnyAction, Reducer } from 'redux';
import { reducerTester } from '../src/reducerTester';

interface ICounterReducerState {
  counter: number;
  mutableArray: number[];
}

const counterReducerInitialState: ICounterReducerState = {
  counter: 0,
  mutableArray: [],
};

const counterReducer: Reducer<ICounterReducerState, AnyAction> = (
  state = counterReducerInitialState,
  action: AnyAction,
) => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        counter: state.counter + 1,
      };
    case 'DECREMENT':
      return {
        ...state,
        counter: state.counter - 1,
      };
    case 'DONT_MUTATE':
      return {
        ...state,
        mutableArray: [...state.mutableArray, state.counter],
      };
    case 'MUTATE':
      state.mutableArray.push(state.counter);
      return state;
    default:
      return state;
  }
};

describe('counterReducer', () => {
  describe('when INCREMENT action is dispatched', () => {
    describe('and counter is 1 in state', () => {
      it('then counter should be 2', () => {
        reducerTester<ICounterReducerState>()
          .givenReducer(counterReducer, { counter: 1, mutableArray: [] })
          .whenActionIsDispatched({ type: 'INCREMENT' })
          .expectStateToEqual({ counter: 2, mutableArray: [] });
      });
    });
  });

  describe('when DECREMENT action is dispatched', () => {
    describe('and counter is 1 in state', () => {
      it('then counter should be 0', () => {
        reducerTester<ICounterReducerState>()
          .givenReducer(counterReducer, { counter: 1, mutableArray: [] })
          .whenActionIsDispatched({ type: 'DECREMENT' })
          .expectStateToEqual({ counter: 0, mutableArray: [] });
      });
    });
  });

  describe('when unknown action is dispatched', () => {
    describe('and counter is 1 in state', () => {
      it('then counter should be 1', () => {
        reducerTester<ICounterReducerState>()
          .givenReducer(counterReducer, { counter: 1, mutableArray: [] })
          .whenActionIsDispatched({ type: 'UNKNOWN' })
          .expectStateToEqual({ counter: 1, mutableArray: [] });
      });
    });
  });

  describe('when DONT_MUTATE action is dispatched', () => {
    describe('and counter is 1 in state', () => {
      describe('then counter should be 1', () => {
        it('and mutableArray should contain 1', () => {
          reducerTester<ICounterReducerState>()
            .givenReducer(counterReducer, { counter: 1, mutableArray: [] })
            .whenActionIsDispatched({ type: 'DONT_MUTATE' })
            .expectStateToEqual({ counter: 1, mutableArray: [1] });
        });
      });
    });
  });

  describe('when MUTATE action is dispatched', () => {
    describe('and counter is 1 in state', () => {
      it('then an TypeError should be thrown', () => {
        expect(() =>
          reducerTester<ICounterReducerState>()
            .givenReducer(counterReducer, { counter: 1, mutableArray: [] })
            .whenActionIsDispatched({ type: 'MUTATE' }),
        ).toThrowError(TypeError);
      });
    });
  });
});
