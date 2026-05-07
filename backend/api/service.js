import fs from "fs";
import jwt from "jsonwebtoken";
import { AccessError, InputError } from "./error.js";

const JWT_SECRET = "llamallamaduck";
const DATABASE_FILE = "./database.json";
const { KV_REST_API_URL, KV_REST_API_TOKEN, USE_VERCEL_KV } = process.env;
const useKV = !!USE_VERCEL_KV;

/***************************************************************
                       Storage Layer
***************************************************************/

const loadAdmins = async () => {
  if (useKV) {
    if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
      throw new Error("USE_VERCEL_KV is set but KV_REST_API_URL/TOKEN are missing");
    }
    const response = await fetch(`${KV_REST_API_URL}/get/admins`, {
      headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` },
    });
    if (!response.ok) {
      throw new Error("Reading from Vercel KV failed");
    }
    const data = await response.json();
    if (!data.result) return {};
    const parsed =
      typeof data.result === "string" ? JSON.parse(data.result) : data.result;
    return parsed.admins || {};
  }
  try {
    const raw = fs.readFileSync(DATABASE_FILE, "utf8");
    return JSON.parse(raw).admins || {};
  } catch (error) {
    return {};
  }
};

const saveAdmins = async (admins) => {
  if (useKV) {
    const response = await fetch(`${KV_REST_API_URL}/set/admins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KV_REST_API_TOKEN}`,
      },
      body: JSON.stringify({ admins }),
    });
    if (!response.ok) {
      throw new Error("Writing to Vercel KV failed");
    }
    return;
  }
  fs.writeFileSync(DATABASE_FILE, JSON.stringify({ admins }, null, 2));
};

export const reset = () => saveAdmins({});

/***************************************************************
                       Auth Functions
***************************************************************/

export const getEmailFromAuthorization = async (authorization) => {
  try {
    const token = (authorization || "").replace("Bearer ", "");
    const { email } = jwt.verify(token, JWT_SECRET);
    const admins = await loadAdmins();
    if (!(email in admins)) {
      throw new AccessError("Invalid Token");
    }
    return email;
  } catch (error) {
    throw new AccessError("Invalid token");
  }
};

export const login = async (email, password) => {
  const admins = await loadAdmins();
  if (admins[email] && admins[email].password === password) {
    return jwt.sign({ email }, JWT_SECRET, { algorithm: "HS256" });
  }
  throw new InputError("Invalid username or password");
};

export const logout = async (email) => {
  const admins = await loadAdmins();
  if (admins[email]) {
    admins[email].sessionActive = false;
    await saveAdmins(admins);
  }
};

export const register = async (email, password, name) => {
  const admins = await loadAdmins();
  if (email in admins) {
    throw new InputError("Email address already registered");
  }
  admins[email] = { name, password, store: {} };
  await saveAdmins(admins);
  return jwt.sign({ email }, JWT_SECRET, { algorithm: "HS256" });
};

/***************************************************************
                       Store Functions
***************************************************************/

export const getStore = async (email) => {
  const admins = await loadAdmins();
  return (admins[email] && admins[email].store) || {};
};

export const setStore = async (email, store) => {
  const admins = await loadAdmins();
  if (!admins[email]) {
    throw new AccessError("Invalid user");
  }
  admins[email].store = store;
  await saveAdmins(admins);
};
