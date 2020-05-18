import * as React from 'react';
import { IonLoading } from '@ionic/react';

interface ILoadingProps {
}

const Loading: React.FunctionComponent<ILoadingProps> = (props) => {
  return (
    <IonLoading
      isOpen={true}
      message={'Please wait...'}
    />
  );
};

export default Loading;
