import githubLogo from '../../assets/icons/github-mark-white.png'
import packageJson from '../../release/app/package.json'

function About(AboutVisibility) {


  return (
    <div className="AboutBody" style={{
      width: AboutVisibility.AboutVisibility ? '280px' : '0px',
    }}>
      <div className='LogoSection'>
        <h3>About</h3>
        <p>TimeTablez {packageJson.version}</p>
        <p id='AppDescription'>{packageJson.description}</p>
      </div>

      <div className='AboutItem'>
      <img src={githubLogo} height={'20px'} style = {{marginRight:'6px'}}/>
      <td onClick={()=> window.open("https://www.google.com/", "_blank")} className='AboutLink'>Repository Link</td>
      </div>

    </div>
  )
}

export default About
