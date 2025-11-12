import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
// import { Toaster } from "@/components/ui/sonner";
import { RootWrapper } from "./wrapper";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

const App = () => {
  return (
    <Router>
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          classNames: {
            success: "custom-success-toast",
            error: "custom-error-toast",
            loading: "custom-success-toast",
            warning: "custom-warning-toast",
          },
        }}
      />
      <QueryClientProvider client={queryClient}>
        <RootWrapper />
      </QueryClientProvider>
    </Router>
  );
};

export default App;
