import express from "express";
import * as trpc from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { number, object, string } from "zod";
import cors from "cors";
import { Message } from "./models/Message";

const appRouter = trpc.router()
  .query("hello", {
    input: string().optional(),
    resolve: ({ input }) => {
      return `Hello ${input}`;
    }
  })
  .query("getMessages", {
    input: number().default(10),
    resolve: ({ input }) => {
      return messages.slice(-input);
    },
  })
  .mutation("addMessage", {
    input: object({
      user: string(),
      message: string(),
    }),
    resolve({ input }) {
      messages.push(input);
      return input;
    }
  })

export type AppRouter = typeof appRouter;

const app = express();

app.use(cors());

const port = 8080;

app.use("/trpc", trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext() { return null }
}));

const messages: Message[] = [
  { user: "user1", message: "Hello" },
  { user: "user2", message: "Hi" },
];

app.get("/", (req, res) => {
  res.send("Hello from api-server");
});

app.listen(port, () => {
  console.log(`api-server listening at http://localhost:${port}`);
});

