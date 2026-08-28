import logo from '../../logo.svg'
import './Home.css'

import PageContainer from 'src/components/mui/PageContainer'
import JsTestComponent from '../../components/JsTestComponent/index'
import TsTestComponent from '../../components/TsTestComponent/TsTestComponent'

function Home() {
  return (
    <PageContainer sx={{ minHeight: '100%', textAlign: 'center' }}>
       <div style={{margin: 'auto', textAlign:'center'}}>
      <img src={logo} className='home-logo' alt='logo' /> 
      <JsTestComponent />
      <TsTestComponent content='TsTestComponentContentOverwite' />
      </div>
    </PageContainer>
  )
}

export default Home
