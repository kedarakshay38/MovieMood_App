import axios from "axios";


const  movieApi= axios.create({
    baseURL:import.meta.env.VITE_OMDB_BASE_URL
})

movieApi.interceptors.request.use(
    (config)=>{

        config.params={
            ...config.params,
            apikey:import.meta.env.VITE_OMDB_API_KEY
        }

        return config;
    }
)

movieApi.interceptors.response.use(
    (response)=>{
        return response;
    }
,
    (error)=>{
        if(error.response?.status===401){
            console.log('unauthorized');
        }
            return Promise.reject(error);
    }


)

export default movieApi;