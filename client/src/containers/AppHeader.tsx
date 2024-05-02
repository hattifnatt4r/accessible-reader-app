import classNames from 'classnames';
import { Icon } from '../components/Icon';
import { AppLink } from '../components/AppLink';


export function AppHeader() {

  return (
    <div>
      <AppLink to="/home"><Icon name="home" /> Home</AppLink>
      <AppLink to="/login"><Icon name="person" /> Login</AppLink>
      <AppLink to="/reader"><Icon name="book" /> Reader</AppLink>
      <AppLink to="/chat"><Icon name="chat" /> Messages</AppLink>
    </div>
  );
}
