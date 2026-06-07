import axios from "axios";

const api= axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true
})

api.interceptors.request.use((config)=>{
    return config
})


export default api