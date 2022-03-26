import logo from './logo.svg';
import './App.css';
import './module/element.js';
import Title,{MainContent,InputBar} from './module/element.js';

function App() {
  return (
    <div className="App">
      <Title/>
      <MainContent/>
    </div>
  );
}

export default App;
