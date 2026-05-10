import { useState ,useRef} from "react";

function Search() {
const [query,setQuery]=useState("");

function handleSearch(){
  console.log("Searching for ",query);

}

const inputRef=useRef(null);
function handleReport(){
  alert(inputRef.current.value);
}

  return (
  <div className="p-g">
  <h1 className="text-3xl font-bold">Search</h1>
  <input type="search" value={query} onChange= {(e)=>{setQuery(e.target.value)}} placeholder="search for movie"/>

  <button onClick={handleSearch} >Submit</button>
    <p>Searching for {query}</p>
  

    <input  ref={inputRef} placeholder="Describe the issue"/>\

    <button onClick={handleReport}>Submit Report</button>
      </div>
  );
}

export default Search;
