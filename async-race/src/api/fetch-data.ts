export async function fetchData<T>(url: string, options?: RequestInit): Promise<T | undefined> {
  try {
    const response: Response = await fetch(url, options);

    if (!response.ok) {
      return undefined;
    }

    const text = await response.text();
    const data: T = JSON.parse(text || '{}');
    return data;
  } catch (error) {
    console.error(`Error processing ${url}:`, error);
    return undefined;
  }
}
