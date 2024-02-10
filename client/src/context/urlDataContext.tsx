import { createContext, useReducer, ReactElement } from "react";

export type URLData = {
    id: string;
    url: string;
    shortUrl: string;
    description?: string;
    createdAt: Date;
};

export type URLDataState = { urls: URLData[] };

export const initialURLDataState: URLDataState = { urls: [] };

export enum URL_ACTION_KIND {
    ADD = "ADD",
    DELETE = "DELETE",
    UPDATE = "UPDATE",
    ADD_MANY = "ADD_MANY"
}

export type URLAction = {
    type: URL_ACTION_KIND;
    payload: URLData;
} | {
    type: URL_ACTION_KIND.ADD_MANY;
    payload: URLData[];
};

const reducer = (state: URLDataState, action: URLAction): URLDataState => {
    switch (action.type) {
        case URL_ACTION_KIND.ADD_MANY: {
            if (Array.isArray(action.payload))
                return { urls: action.payload };
            else return state;
        }

        case URL_ACTION_KIND.ADD: {
            return { urls: [...state.urls, action.payload] };
        }

        case URL_ACTION_KIND.DELETE: {
            const { id } = action.payload;
            const filteredURLs = state.urls.filter((todo) => todo.id !== id);
            return { urls: filteredURLs };
        }

        case URL_ACTION_KIND.UPDATE: {
            const updatedURLs = state.urls.map((todo) =>
                todo.id === action.payload.id ? action.payload : todo
            );
            return { urls: updatedURLs };
        }

        default:
            throw new Error("Unidentified reducer action type!");
    }
};

/*
 * This is the preferred way to using React's context API along with useReducer Hook
 * To create two separate context each for the state and dispatch.
 * SEE:
 * https://www.nielskrijger.com/posts/2021-02-16/use-reducer-and-use-context
 */
export const URLStateContext = createContext<URLDataState>(initialURLDataState);
export const URLDispatchContext = createContext<React.Dispatch<URLAction>>(
    () => { }
);

type PropType = {
    children?: ReactElement | ReactElement[];
    initialURLDataState: URLDataState;
};

const URLDataProvider = ({
    children,
    initialURLDataState: initialURLDataState,
}: PropType): ReactElement => {
    const [state, dispatch] = useReducer(reducer, initialURLDataState);

    return (
        <URLStateContext.Provider value={state}>
            <URLDispatchContext.Provider value={dispatch}>
                {children}
            </URLDispatchContext.Provider>
        </URLStateContext.Provider>
    );
};

export default URLDataProvider;
