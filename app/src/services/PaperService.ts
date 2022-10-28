import axios from "./axios";
import { AxiosResponse } from "axios";
import { Paper } from "@/interfaces/Paper";

export const getPapers = async (): Promise<AxiosResponse<Paper[]>> => {
  const res = await axios.get("/papers");
  return res;
};

export const getPaper = async (id: string): Promise<AxiosResponse<Paper>> => {
  const res = await axios.get("/paper/" + id);
  return res;
};

export const createPaper = async (paper: Paper) => {
  await axios.post("/papers", paper);
};

export const updatePaper = async (
  id: string,
  paper: Paper
): Promise<AxiosResponse<Paper>> => {
  const res = await axios.put("/paper/" + id, paper);
  return res;
};

export const deletePaper = async (
  id: string
): Promise<AxiosResponse<Paper>> => {
  const res = await axios.delete("/paper/" + id);
  return res;
};
