import express from "express";
import expressWebsocets from "express-ws";
import { Hocuspocus } from "@hocuspocus/server";
import { Logger } from "@hocuspocus/extension-logger";
import { slateNodesToInsertDelta } from "@slate-yjs/core";
import * as Y from "yjs";

import config from "./config/env.js";

const initialValue = [{ type: "paragraph", children: [{ text: "" }] }];

const hocuspocus = new Hocuspocus({
  name: "slate-yjs-demo",
  port: config.port,
  timeout: 30000,
  debounce: 5000,
  maxDebounce: 30000,
  extensions: [new Logger()],

  async onLoadDocument(data) {
    if (data.document.isEmpty("content")) {
      const insertDelta = slateNodesToInsertDelta(initialValue);
      const sharedRoot = data.document.get("content", Y.XmlText);
      sharedRoot.applyDelta(insertDelta);
    }

    return data.document;
  },
});

const { app } = expressWebsocets(express());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.send("Hello World");
});

app.ws("/collaboration", (websocket, request) => {
  const context = {
    user: {
      id: 1234,
      name: "Jane",
    },
  };

  hocuspocus.handleConnection(websocket, request, context);
});

app.use((req, res, next) => {
  res.status(404).json({ message: "아무것도 없습니다." });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;
