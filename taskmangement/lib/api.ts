import axios from "axios"

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

interface ApiRequestOptions {
  url: string                 
  method?: Method              
  data?: string | object                  
  params?: string | object               
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
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message)
      throw new Error(error.response?.data?.message || "API request failed")
    } else if (error instanceof Error) {
      console.error("API Error:", error.message)
      throw new Error(error.message || "API request failed")
    } else {
      console.error("API Error:", error)
      throw new Error("API request failed")
    }
  }
}
