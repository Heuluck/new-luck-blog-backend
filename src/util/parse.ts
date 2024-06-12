export function parseQueryToJSON(query: string) {
    const url = new URL("http://example.com/example?" + query);
    const params = url.searchParams;
    const json = {} as { [key: string]: string };
    params.forEach((value, key) => {
        json[key] = value;
    });
    return json;
}
