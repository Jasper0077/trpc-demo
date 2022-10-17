import React from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { trpc } from "./trpc";

import "./index.scss";

const queryClient = new QueryClient();

const AppContent = () => {
  const [user, setUser] = React.useState<string>();
  const [message, setMessage] = React.useState<string>();
  const hello = trpc.useQuery(["hello", "Jasper"]);
  const response = trpc.useQuery(["getMessages"]);

  const addMessage = trpc.useMutation("addMessage");
  const handleAddMessage = React.useCallback(() => {
    addMessage.mutate(
      {
        message: "Hello world",
        user: "Jasper",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["getMessages"]);
        },
      }
    );
  }, []);
  const { data: messages } = response;
  return (
    <div className="mx-auto mt-10 flex-row space-x-2 text-3xl sm:max-w-2xl">
      <div className="grid grid-cols-2 items-center space-x-10">
        <h1>{hello.data}</h1>
        <button
          type="button"
          className="focus:outline-none mr-2 mb-2 w-20 place-self-end rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={handleAddMessage}
        >
          Add
        </button>
      </div>
      <br />
      {messages?.map((msg) => (
        <p>{msg.message}</p>
      ))}
      <div className="mx-auto mt-10 grid grid-cols-1 gap-4">
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="w-full rounded-lg border-2 border-gray-300 p-5"
          placeholder="User"
          aria-label="user"
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg border-2 border-gray-300 p-5"
          placeholder="Message"
          aria-label="message"
        />
      </div>
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
  );
};
ReactDOM.render(<App />, document.getElementById("app"));
