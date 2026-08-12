import { useContext } from "solid-js";
import { BlogContext } from "./blogContext";

/**
 * @returns the enclosing BlogProvider's read-only recipe.
 * @throws if called outside a BlogProvider
 */
export function useBlog() {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error("useBlog must be used inside BlogProvider");
  return ctx;
}
