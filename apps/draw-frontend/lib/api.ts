import axios from "axios";

const api= axios.create({
    baseURL:process.env.NEXT_PUBLIC_HTTP_BACKEND,
    withCredentials:true
})

api.interceptors.request.use((config)=>{
    return config
})


export default api