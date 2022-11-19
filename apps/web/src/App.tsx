import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import DefaultLayout from './layouts/DefaultLayout';
import routes from './routes';

function App() {
	return (
		<Routes>
			<Route path="/" element={<DefaultLayout />}>
				{routes.map((route) => (
					<Route key={route.name} path={route.path} element={route.element} index={route.index} />
				))}
				<Route path="*" element={<Navigate replace to="/" />} />
			</Route>
		</Routes>
	);
}

export default App;
