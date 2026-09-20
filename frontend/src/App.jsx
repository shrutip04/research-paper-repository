import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <div>
                            <h1>ResearchSphere</h1>
                            <p>Research Paper Repository & Discovery System</p>
                        </div>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;