export type SortOrder = 'asc' | 'desc';
export type SortField<T> = keyof T;

export function filterByField<T>(data: T[], field: keyof T, value: string | undefined) {
    if (!value) return data;
    return data.filter(item => {
        const v = (item[field] as string | undefined);
        return v && v.toLowerCase() === value.toLowerCase();
    });
}

export function sortByField<T>(data: T[], field: keyof T, order: SortOrder = 'asc') {
    return [...data].sort((a, b) => {
        const aVal = (a[field] as string) || '';
        const bVal = (b[field] as string) || '';
        const res = aVal.localeCompare(bVal);
        return order === 'asc' ? res : -res;
    });
}

export function paginate<T>(data: T[], page: number, limit: number) {
    const start = (page - 1) * limit;
    return data.slice(start, start + limit);
}

export function assertInList<T extends string>(value: string, validList: T[], paramName: string) {
    if (!validList.includes(value as T)) {
        throw new Error(`El valor "${value}" no es válido para el parámetro "${paramName}". Valores válidos: ${JSON.stringify(validList)}.`);
    }
}
