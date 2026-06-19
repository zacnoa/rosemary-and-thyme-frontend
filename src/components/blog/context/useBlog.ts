import { useContext } from "solid-js";
import { BlogContext } from "./blogContext";

export function useBlog() {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error("useBlog must be used inside BlogProvider");
  return ctx;
}
