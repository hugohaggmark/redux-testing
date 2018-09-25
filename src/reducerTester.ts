import 'jest';
import { AnyAction, Reducer } from 'redux';

export interface IGiven<State> {
  givenReducer: (reducer: Reducer, state?: State) => IWhen<State>;
}

export interface IWhen<State> {
  whenActionIsDispatched: (action: AnyAction) => IThen<State>;
}

export interface IThen<State> {
  expectStateToEqual: (state: State) => IThen<State>;
}

interface IObject extends Object {
  [key: string]: any;
}

const deepFreeze = <T>(obj: T): T => {
  Object.freeze(obj);

  const isNotException = (object: any, propertyName: any) =>
    typeof object === 'function'
      ? propertyName !== 'caller' &&
        propertyName !== 'callee' &&
        propertyName !== 'arguments'
      : true;
  const hasOwnProp = Object.prototype.hasOwnProperty;

  if (obj && obj instanceof Object) {
    const object: IObject = obj;
    Object.getOwnPropertyNames(object).forEach((propertyName) => {
      const objectProperty: any = object[propertyName];
      if (
        hasOwnProp.call(object, propertyName) &&
        isNotException(object, propertyName) &&
        objectProperty &&
        (typeof objectProperty === 'object' ||
          typeof objectProperty === 'function') &&
        Object.isFrozen(objectProperty) === false
      ) {
        deepFreeze(objectProperty);
      }
    });
  }

  return obj;
};

interface IReducerTester<State>
  extends IGiven<State>,
    IWhen<State>,
    IThen<State> {}

export const reducerTester = <State>(): IGiven<State> => {
  let reducerUnderTest: Reducer<State, AnyAction>;
  let resultingState: State;
  let initialState: State;

  const givenReducer = (
    reducer: Reducer<State, AnyAction>,
    state?: State,
  ): IWhen<State> => {
    reducerUnderTest = reducer;
    initialState = state === undefined ? ({} as State) : state;
    initialState = deepFreeze(initialState);

    return instance;
  };

  const whenActionIsDispatched = (action: AnyAction): IThen<State> => {
    resultingState = reducerUnderTest(initialState, action);

    return instance;
  };

  const expectStateToEqual = (state: State): IThen<State> => {
    expect(state).toEqual(resultingState);

    return instance;
  };

  const instance: IReducerTester<State> = {
    expectStateToEqual,
    givenReducer,
    whenActionIsDispatched,
  };

  return instance;
};
