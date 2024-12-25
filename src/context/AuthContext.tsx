// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react'

interface AuthContextType {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {}
})

export const useAuth = () => useContext(AuthContext)

