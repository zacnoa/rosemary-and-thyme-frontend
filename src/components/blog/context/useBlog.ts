import { useContext } from "solid-js";
import { BlogContext } from "./blogContext";

/**
 * Provides the useBlog function.
 */
export function useBlog() {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error("useBlog must be used inside BlogProvider");
  return ctx;
}
