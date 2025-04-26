import Footer from "./Footer";
import Header from "./Header";



export default function UI({children}) {
  return (
    <div
      style={{
        zIndex: 100,
        color: 'white',
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'auto',
        width: '100%',
        height: '100vh'
      }}
    >
      {children}
      <Header />
      <div style={{ height: '200vh' }}>

      </div>
      <Footer />
    </div>
  )
}