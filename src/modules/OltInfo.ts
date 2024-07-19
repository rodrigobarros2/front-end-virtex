import { backendClient } from "../services/api";

export interface IOltData {
  slot: string;
  port: string;
  ont_id: string;
  sn: string;
  state: string;
}

export interface IOltDataForCreate {
  data: IOltData[];
}

export const fetchOlt = async () => {
  try {
    const { data } = await backendClient.get("/oltoutput");
    return data;
  } catch (error) {
    console.error("Erro ao buscar dados da OLT:", error);
    throw error;
  }
};

export const createOlt = async (data: IOltDataForCreate) => {
  try {
    const response = await backendClient.post("/oltoutput", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao enviar dados para a OLT:", error);
    throw error;
  }
};
