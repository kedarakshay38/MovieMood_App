import {Link} from  "react-router-dom"
function NavBar(){

    return(
       <nav className="flex justify-between items-center p-4 bg-slate-900 text-white">
        <span>MovieMood</span>
        <div className="flex gap-6">
            <Link to="/">Home</Link>
             <Link to="/search">Search</Link>
              <Link to="/watchlist">Watchlist</Link>
               <Link to="/stats">Stats</Link>
                <Link to="/settings">Settings</Link>


        </div>
       </nav>
    )
}

export default NavBar;