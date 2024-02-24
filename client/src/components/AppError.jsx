import {P} from './Card';
import PopUp from './PopUp';
import React from 'react';
import colors from './colors';
import styled from 'styled-components/macro';

const Red = styled(P)`
    padding-top: 8px;
    color: ${colors.error};
`;

export function ErrorComponent({message}){
    const [popupStatus, setPopupStatus] = React.useState(true);

    return (
        <PopUp
            show={popupStatus}
            close={() => setPopupStatus(!popupStatus)}
            titleText={'Error:'}
            renderContent={() => <Red>{message || 'Oh my. Something went wrong.'}</Red>}
        />
    );
};

export class AppError extends React.Component {
  
  state = {
    hasError: false,
  };

  static getDerivedStateFromError = error => {
    return { hasError: true };
  };

  componentDidCatch = (error, info) => {
    this.setState({ error, info });
  };

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    return hasError ? <ErrorComponent /> : children;
  }
}