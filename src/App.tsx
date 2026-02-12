import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import TodaysOutlook from './pages/Dashboard/TodaysOutlook';
import DataBuilder from './pages/DataBuilder/DataBuilder';
import Donors from './pages/Donors/Donors';
import Campaigns from './pages/Campaigns/Campaigns';
import Playbooks from './pages/Playbooks/Playbooks';
import RollingRealtime from './pages/RollingRealtime/RollingRealtime';
import Volunteers from './pages/Volunteers/Volunteers';
import Workspace from './pages/Workspace/Workspace';
import Metrics from './pages/Metrics/Metrics';
import Settings from './pages/Settings/Settings';
import './styles/theme.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TodaysOutlook />} />
          <Route path="data-builder" element={<DataBuilder />} />
          <Route path="donors" element={<Donors />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="playbooks" element={<Playbooks />} />
          <Route path="rolling-realtime" element={<RollingRealtime />} />
          <Route path="volunteers" element={<Volunteers />} />
          <Route path="workspace" element={<Workspace />} />
          <Route path="metrics" element={<Metrics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
