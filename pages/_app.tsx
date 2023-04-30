import "../styles/globals.css";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "../context/useAuth";
import { ThemeProvider } from "next-themes";
import Layout from "../components/Layout";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import React from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <AuthProvider>
          <GoogleOAuthProvider clientId='1026365208293-vrbscj7f5q8r016fvid077jtn6osifmt.apps.googleusercontent.com'>
            <ThemeProvider enableSystem={true} attribute='class'>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ThemeProvider>
          </GoogleOAuthProvider>
        </AuthProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}
