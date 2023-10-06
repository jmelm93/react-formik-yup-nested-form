export type DataModel = {
    [key: string]: DataModelItem[];
};

export type DataModelItem = {
    label: string;
    name: string | null;
    type?: string;
};