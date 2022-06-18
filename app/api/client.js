import { create } from "apisauce";

const apiClient = create({
  baseURL: "https://iskconmayapur.syscentricdev.com/api/v1",
});

export default apiClient;
