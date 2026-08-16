import { useContext } from "react";
import PublicContentContext from "../context/publicContentContextValue";

export function usePublicShellContent() {
  const value = useContext(PublicContentContext);
  if (!value) {
    throw new Error("usePublicShellContent must be used within PublicContentProvider");
  }
  return value;
}
