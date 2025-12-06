export interface InitialFormState {
    success: boolean;
    message: string;
    error?: Record<string, string[]>;
}

export const initialFormState: InitialFormState = {
    success: false,
    message: "",
}