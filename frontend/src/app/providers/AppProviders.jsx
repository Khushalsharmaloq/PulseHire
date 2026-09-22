import { AuthProvider } from "../../context/AuthContext";

const AppProviders = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AppProviders;
