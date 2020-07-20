import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Session, { User } from '../@types/Session';
import usePersistedState from '../hooks/usePersistedState';
import api from '../services/api';

type CreateSessionResponse = Session;

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthenticationContextData {
  user: Session['user'];
  isSignedIn(): boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthenticationContext = createContext<AuthenticationContextData>(
  {} as AuthenticationContextData,
);

const AuthenticationProvider: React.FC = ({ children }) => {
  const [data, setData] = usePersistedState<Session>('session', {} as Session);

  const location = useLocation();
  const navigate = useNavigate();

  const isSignedIn = useCallback(() => {
    return !!data?.user;
  }, [data]);

  const signIn = useCallback(
    async ({ email, password }) => {
      const response = await api.post<CreateSessionResponse>('sessions', {
        email,
        password,
      });

      setData(response.data);
    },
    [setData],
  );

  const signOut = useCallback(() => {
    setData({} as Session);
    navigate('/');
  }, [setData, navigate]);

  useEffect(() => {
    if (!isSignedIn()) return;

    api.get<User>(`users/${data.user.id}`).then(response => {
      setData({
        ...data,
        user: response.data,
      });
    });
  }, [location]); // eslint-disable-line

  return (
    <AuthenticationContext.Provider
      value={{ user: data?.user, isSignedIn, signIn, signOut }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

function useAuthentication(): AuthenticationContextData {
  const context = useContext(AuthenticationContext);

  if (!context) {
    throw new Error(
      "'useAuthentication' must be used within an 'AuthenticationProvider'",
    );
  }

  return context;
}

export { AuthenticationProvider, useAuthentication };
