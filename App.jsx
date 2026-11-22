import Home from './Home.jsx';
import {BrowserRouter , Routes , Route} from "react-router-dom";
import Dashboard from './Dashboard.jsx';
import Profile from './Profile.jsx';
import LeadManagement from './LeadManagement.jsx';


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path="/leads" element={<LeadManagement />} />
        <Route path='/profile' element={<Profile/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
