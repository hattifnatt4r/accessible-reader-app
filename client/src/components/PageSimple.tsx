import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { post } from '../utils/query';
import { NavBackButton, NavModal } from './Nav';
import { Button } from './Button';
import { Icon } from './Icon';
import { ModalLogin } from '../containers/ModalLogin';
import './PageSimple.css';


export const PageSimple = observer((props : { className?: string, children: React.ReactNode, controls?: boolean }) => {
  const { children, className, controls } = props;

  const appStore = window.app;
  const isLoggedIn = appStore.getIsLoggedIn();
  
  async function handleLogout() {
    await post('logout', { token: appStore.token });
    appStore.setSession(null, null)
  }

  const cl = {
    'page-simple': 1,
    'page-simple_w-controls': controls,
    [className || '']: !!className,
  };
  return (
    <div className={classNames(cl)}>
      <div className="page-simple__topbar">
        <div className="page-simple__topbar-in">
          <div className="about-link">
            <a href="https://github.com/hattifnatt4r/accessible-reader-app" target="_blank" rel="noreferrer">
              <i className="fab fa-github"></i> GitHub
            </a>
          </div>
          {!isLoggedIn && (
            <div className='page-simple__logout'>
              <ModalLogin>
                <Button linkButton><Icon name="person" /> Sign In</Button>
              </ModalLogin>
            </div>
          )}
          {isLoggedIn && (
            <div className='page-simple__logout' onClick={handleLogout}>
              <Button linkButton><Icon name="logout" /> Sign Out </Button>
            </div>
          )}
        </div>
      </div>

      <div className="page-simple__main">
        <div className="page-simple__left">
          <div className="page-simple__content">
            {children}
          </div>

          <div className="page-simple__footer"></div>
        </div>
        {controls && (
          <div className="page-simple__controls">
            <NavBackButton />
            <NavModal />
          </div>
        )}
      </div>
    </div>
  );
});