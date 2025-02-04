import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { IQueryProviderProps } from "./query-provider.interface";

const queryClient = new QueryClient();

export const QueryProvider: React.FC<IQueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
