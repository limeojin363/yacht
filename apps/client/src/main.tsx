import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createRouter({
  routeTree,
  context: {
    auth: {
      isLoaded: false,
      user: null,
      login: async () => {},
      logout: async () => {},
      signup: async () => {},
    },
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const Inner = () => {
  return <RouterProvider router={router}  />;
};

export const queryClient = new QueryClient();

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <Inner />
        </QueryClientProvider>
    </StrictMode>
  );
}
