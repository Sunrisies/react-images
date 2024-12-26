import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React,{FC} from "react"
const queryClient = new QueryClient()
export const useAppQuery = () => {
  const AppQueryProvider:FC<{ children: React.ReactNode }> = ({children}) => {
    return <QueryClientProvider client={queryClient}>
     {children}
    </QueryClientProvider>
  }
  return {
    AppQueryProvider
  }
}
