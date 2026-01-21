export async function fetchData<T>(url: string, options?: RequestInit): Promise<T | undefined> {
  try {
    const response: Response = await fetch(url, options);

    if (!response.ok) {
      return undefined;
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error(`Error processing ${url}:`, error);
    return undefined;
  }
}
