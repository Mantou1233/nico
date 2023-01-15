export async function makeFetch<T>(
	url: string,
	options: RequestInit = {},
	meta: "json" | "text" = "json"
) {
	return (await fetch(url, {
		method: "GET",
		...options
	}).then(v => v[meta]())) as T;
}
