import NavBar from './components/navbar';
import BodySection from './components/Bodysection' 
import Fotter from './components/fotter';

function App() {
  return (
    <div className="flex justify-center bg-slate-200 flex-col">
      <NavBar />
      <div className='flex justify-center w-full'>
      <BodySection />
      </div>
    </div>
  );
}

export default App;
