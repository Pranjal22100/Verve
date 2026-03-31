class Env {
  static APP_URL: string = process.env.NEXT_PUBLIC_APP_URL as string;
  static BACKEND_URL: string = process.env.NEXT_PUBLIC_BACKEND_URL as string;

  // ✅ Use internal Docker URL for server-side fetches, fallback to public URL
  static INTERNAL_BACKEND_URL: string = 
    process.env.BACKEND_INTERNAL_URL as string || 
    process.env.NEXT_PUBLIC_BACKEND_URL as string;
}

export default Env;
