import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AssetsPage from './pages/AssetsPage'
import { Provider } from 'react-redux'
import { store } from './store';
import NavBar from './components/NavBar'
import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material'
import { blue } from '@mui/material/colors'

const theme = createTheme({
  palette: {
    primary: {
      main: blue[500],
    },
    tonalOffset: {
      light: 0.1,
      dark: 0.9,
    },
  },
})

function App() {
  return (
    <main className="bg-slate-100">
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Router>
            <NavBar />
            <Routes>
              <Route path="/assets" element={<AssetsPage />} />
            </Routes>
          </Router>
        </Provider>
      </ThemeProvider>
    </main>
  )
}

export default App
