import React from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { trpc } from "./trpc"

import "./index.scss";

const queryClient = new QueryClient();

const AppContent = () => {
  const hello = trpc.useQuery(["hello", "Jasper"]);
  const response = trpc.useQuery(["getMessages"]);

  const addMessage = trpc.useMutation("addMessage");
  const handleAddMessage = React.useCallback(() => {
    addMessage.mutate({
      message: "Hello world",
      user: "Jasper",
    });
  }, [])
  const { data: messages } = response;
  return (
    <div className="mt-10 text-3xl mx-auto max-w-6xl flex-row space-x-2">
      <div className="flex flex-row items-center space-x-10">
        <h1>{hello.data}</h1>
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={handleAddMessage}
        >Add
        </button>
      </div>
      <br />
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
