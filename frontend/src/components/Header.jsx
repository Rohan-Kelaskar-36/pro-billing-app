import { Route,Routes } from 'react-router-dom'
import Navbar from './Navbar'
import About from '../pages/About'
import Home from '../pages/Home'

function Header() {
  return (
    <div>
      <Navbar/> 
      <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/about" element={<About/>}/>
      </Routes>
    </div>
  )
}

export default Header
