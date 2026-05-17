
import movieApi from "./apiClient";

export async function searchMovies(query){
 
const response= await movieApi.get('/',{params:{s:query}});

return response.data;

}
export async function getMovieById(id){
    const response=await movieApi.get('/',{params:{i:id,plot:'full'}});
    return response.data;

}