import { Provider } from "react-redux";
import { makeStore } from "../store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

console.log(2222222222)
export default function MyApp({ Component, pageProps }) {
    const store = makeStore(pageProps.initialReduxState || {});
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </Provider>
  );
}
