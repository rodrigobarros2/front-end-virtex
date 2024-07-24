import { backendClient } from "../services/api";

export interface IOltData {
  olt_type: string;
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
    const { data } = await backendClient.get("/data");
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

export const createOltTxt = async (formData: IOltDataForCreate) => {
  try {
    await backendClient.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    alert("Files uploaded successfully");
  } catch (error) {
    console.error("Error uploading files", error);
    alert("Failed to upload files");
  }
};
