import githubLogo from '../../assets/icons/github-mark-white.png'
import packageJson from '../../release/app/package.json'
import boilerPackageJson from '../../package.json'
import icon from '../../assets/icon.png'

function About(AboutVisibility) {


  return (
    <div className="AboutBody" style={{
      width: AboutVisibility.AboutVisibility ? '280px' : '0px',
    }}>
      <div className='LogoSection'>
        <h3>About</h3>
        <img src={icon} height={'80px'} style = {{marginRight:'6px'}}/>
        <p>TimeTablez {packageJson.version}</p>
        <p id='AppDescription'>{packageJson.description}</p>
        <p id='AppDescription'>Electron {boilerPackageJson.devDependencies.electron.substring(1)}</p>
        <p id='AppDescription'>React {boilerPackageJson.dependencies.react.substring(1)}</p>
      </div>

      <div className='AboutItem'>
      <img src={githubLogo} height={'20px'} style = {{marginRight:'6px'}}/>
      <td onClick={()=> window.open("https://github.com/zzz-Ricky/time-tablez", "_blank")} className='AboutLink'>Repository Link</td>
      </div>
      <div className='AboutItem'>
      <img src={githubLogo} height={'20px'} style = {{marginRight:'6px'}}/>
      <td onClick={()=> window.open("https://github.com/electron-react-boilerplate/electron-react-boilerplate", "_blank")} className='AboutLink'>Boilerplate Link</td>
      </div>
    </div>
  )
}

export default About
