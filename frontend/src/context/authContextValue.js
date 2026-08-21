import { createContext } from "react";

const AuthContext = createContext({
  admin: null,
  isAdmin: false,
  isChecking: true,
  login: async () => {},
  logout: () => {},
  refreshAuth: async () => {},
});

export default AuthContext;
