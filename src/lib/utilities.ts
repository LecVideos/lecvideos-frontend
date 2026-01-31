export const levels = [100, 200, 300, 400, 500, 600]

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

export const logout = async (router: any) => {
  try {
    // Call your backend to clear HttpOnly cookie
  
    await apiFetcher(`${process.env.NEXT_PUBLIC_ServerHost}/logout`, {method: "DELETE"})
  } catch (err) {
    console.error("Logout request failed", err);
  }
  if (typeof window !== "undefined") {
    // Clear other client-side stuff
    localStorage.clear();

    // Redirect to login
    router.push("/auth");
  }
};
