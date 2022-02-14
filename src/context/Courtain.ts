import { createContext } from "react";

export interface ICourtain {
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export const Courtain = { Context: createContext<ICourtain>({
    loading: false,
    setLoading: () => {},
})}
