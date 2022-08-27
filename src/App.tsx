import React, { useEffect, useState } from 'react';
import AppBody from './components/page/AppBody';
import AppHeader from './components/page/AppHeader';
import './style/App.scss';

function App() {
  const [menuSelected, setMenuSelected] = useState("");

  const handleMenu = (pvalue: any) => {
    setMenuSelected(pvalue); 
  }

  return (
    <div id='body-main'>
      <AppHeader getMenuSelected={handleMenu} />
      <AppBody setMenuSelected={menuSelected} />
    </div>
  );
}

export default App;
