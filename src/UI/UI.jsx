import { Html } from "@react-three/drei"
import Header from "./Header"
import Footer from "./Footer"
import AOS from "aos"
import 'aos/dist/aos.css';

AOS.init()

function UI() {
  return (
    <Html
      style={{
        color: 'white',
        display: 'block'
      }}>
      <Header />
      <Footer />
      <div style={{width: '100vw', marginTop: '100vh'}}>
        <h1>Hello World</h1>

      </div>
    </Html>
  )
}

export default UI