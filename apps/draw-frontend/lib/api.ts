import axios from "axios";

const api= axios.create({
    baseURL:"http://localhost:3001",
    withCredentials:true
})

api.interceptors.request.use((config)=>{
    return config
})


export default api