import React from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { trpc } from "./trpc"

import "./index.scss";

const queryClient = new QueryClient();

const AppContent = () => {
  const hello = trpc.useQuery(["hello", "Jasper"]);
  const response = trpc.useQuery(["getMessages"]);
  const { data: messages } = response;
  return (
    <div className="mt-10 text-3xl mx-auto max-w-6xl">
      <h1>{hello.data}</h1>
      {messages?.map((msg) => (<p>
        { msg.message }
      </p>))}
    </div>
  );
};

const App = () => {
  const [trpcClient] = React.useState(() =>
    trpc.createClient({
      url: "http://localhost:8080/trpc",
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </trpc.Provider>
  )
}
ReactDOM.render(<App />, document.getElementById("app"));
