import {
  ReactElement,
  createContext,
  useEffect,
  useState,
} from "react";

export type User = {
  name: string;
  email: string;
};

export type AuthState = {
  token: string | null;
  user: User | null;
  colorScheme: 'dark' | 'light'
};

const initialAuthState: AuthState = {
  token: null,
  user: null,
  colorScheme: 'dark'
};

export const useAuthContext = (initialAuthState: AuthState) => {
  const [auth, setAuth] = useState<AuthState>(initialAuthState);
  const isLoggedIn = auth.token != null;

  const login = (authState: AuthState) => {
    localStorage.setItem("auth", JSON.stringify(authState));
    setAuth(authState);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setAuth(initialAuthState);
  };

  useEffect(() => {
    const initialAuthState = localStorage.getItem("auth");
    if (!initialAuthState) {
      return;
    }
    setAuth(JSON.parse(initialAuthState));
  }, []);

  return { isLoggedIn, auth, login, logout };
};

export type UseAuthContext = ReturnType<typeof useAuthContext>;

const initialAuthContextState = {
  auth: initialAuthState,
  isLoggedIn: false,
  login: () => {},
  logout: () => {}
}

export const AuthContext = createContext<UseAuthContext>(initialAuthContextState);

type PropType = {
  children?: ReactElement | ReactElement[];
};

/**
 * Provider to pass auth state to the React application
 */
export const AuthProvider = ({ children }: PropType) => {
  return (
    <AuthContext.Provider value={useAuthContext(initialAuthState)}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
