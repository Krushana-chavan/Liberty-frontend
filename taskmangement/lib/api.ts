import axios from "axios"

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

interface ApiRequestOptions {
  url: string                 
  method?: Method              
  data?: any                   
  params?: any                
  token?: string               
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:7000",
  headers: {
    "Content-Type": "application/json",
  },
})


export const apiRequest = async ({
  url,
  method = "GET",
  data = {},
  params = {},
  token,
}: ApiRequestOptions) => {
  try {
   const rawToken = token || localStorage.getItem("accessToken") || ""
const authToken = rawToken.replace(/^"|"$/g, "") 

    const response = await axiosInstance.request({
      url,
      method,
      data: ["POST", "PUT","DELETE", "PATCH"].includes(method) ? data : undefined,
      params,
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
    })

    return response.data
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message)
    throw new Error(error.response?.data?.message || "API request failed")
  }
}
