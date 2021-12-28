
import React from "react";
import {User} from '@firebase/auth-types';

export const AuthContext = React.createContext<User | null>(null);