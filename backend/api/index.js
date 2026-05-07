import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json" with { type: "json" };
import { put } from "@vercel/blob";
import { AccessError, InputError } from "./error.js";
import {
  getEmailFromAuthorization,
  getStore,
  login,
  logout,
  register,
  setStore,
} from "./service.js";

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));

const catchErrors = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    if (err instanceof InputError) {
      res.status(400).send({ error: err.message });
    } else if (err instanceof AccessError) {
      res.status(403).send({ error: err.message });
    } else {
      console.log(err);
      res.status(500).send({ error: "A system error ocurred" });
    }
  }
};

/***************************************************************
                       Auth Function
***************************************************************/

const authed = (fn) => async (req, res) => {
  const email = await getEmailFromAuthorization(req.header("Authorization"));
  await fn(req, res, email);
};

app.post(
  "/admin/auth/login",
  catchErrors(async (req, res) => {
    const { email, password } = req.body;
    const token = await login(email, password);
    return res.json({ token });
  })
);

app.post(
  "/admin/auth/register",
  catchErrors(async (req, res) => {
    const { email, password, name } = req.body;
    const token = await register(email, password, name);
    return res.json({ token });
  })
);

app.post(
  "/admin/auth/logout",
  catchErrors(
    authed(async (req, res, email) => {
      await logout(email);
      return res.json({});
    })
  )
);

/***************************************************************
                       Store Functions
***************************************************************/

app.get(
  "/store",
  catchErrors(
    authed(async (req, res, email) => {
      const store = await getStore(email);
      return res.json({ store });
    })
  )
);

app.put(
  "/store",
  catchErrors(
    authed(async (req, res, email) => {
      await setStore(email, req.body.store);
      return res.json({});
    })
  )
);

/***************************************************************
                       Update Thumbnail Function
***************************************************************/

app.post(
  "/upload-thumbnail",
  catchErrors(async (req, res) => {
    const { base64Image } = req.body;
    if (!base64Image) {
      return res.status(400).json({ error: "No image provided" });
    }
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res
        .status(500)
        .json({ error: "BLOB_READ_WRITE_TOKEN is not configured" });
    }

    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const filename = `thumbnail-${Date.now()}.jpg`;
    const blob = await put(filename, buffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    res.json({ url: blob.url });
  })
);

/***************************************************************
                       Running Server
***************************************************************/

app.get("/", (req, res) => res.redirect("/docs"));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

if (!process.env.VERCEL) {
  let port = process.env.PORT || 5005;
  try {
    const fileData = fs.readFileSync(
      "../frontend/backend.config.json",
      "utf8"
    );
    const config = JSON.parse(fileData);
    if (config.BACKEND_PORT) {
      port = config.BACKEND_PORT;
    }
  } catch (error) {
    console.log("No local backend.config.json found, using default port");
  }

  app.listen(port, () => {
    console.log(`For API docs, navigate to http://localhost:${port}`);
  });
}

export default app;
