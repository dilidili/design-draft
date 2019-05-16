import { ReactChildren } from 'react';
import { connect } from 'dva';
import useSocket from '@/hooks/useSocket';

type AppProps = {
  dispatch: any;
  children: ReactChildren;
}

let App = (props: AppProps) => {
  useSocket(props);

  return props.children;
}

App = connect()(App);

export default App;