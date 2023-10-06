const getNestedValue = (obj: any, path: string) => {
    // Helper function to get nested field value when you have a string path
    // e.g., "schemaList[0].secondLevel[0].name"
    return (
        path.split(/[\[\].]+/).reduce((o, k) => (o || {})[k], obj) || undefined
    );
};

export default getNestedValue;