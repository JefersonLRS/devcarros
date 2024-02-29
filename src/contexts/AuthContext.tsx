import { ReactNode, createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseConnection";

type AuthContextType = {
  signed: boolean;
  loadingAuth: boolean;
  handleInfoUser: ({ displayName, email, uid, favorites }: UserProps) => void;
  user: UserProps | null;
  setUser: React.Dispatch<React.SetStateAction<UserProps | null>>;
};

interface AuthProviderProps {
  children: ReactNode;
}

interface UserProps {
  uid: string;
  displayName: string | null;
  email: string | null;
  favorites: string[];
}

export const AuthContext = createContext({} as AuthContextType);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        //se tem usuário logado
        setUser({
          uid: userAuth.uid,
          displayName: userAuth.displayName,
          email: userAuth.email,
          favorites: [],
        });

        setLoadingAuth(false);
      } else {
        //se não tem usuário logado
        setUser(null);
        setLoadingAuth(false);
      }
    });

    return () => {
      unsub();
    };
  }, []);

  function handleInfoUser({ displayName, email, uid, favorites }: UserProps) {
    setUser({ displayName, email, uid, favorites });
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, loadingAuth, handleInfoUser, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
