export const apiFetcher = async (url: string, options: RequestInit = {}) => {
    try {
      options.credentials = 'include'
      if (url) {
        const data = await fetch(url, options);
        const res = await data.json();
        return res;
      }
    } catch (err: unknown) {
      if (err instanceof Error) console.error("Failed to fetch", err.message);
    }
  };