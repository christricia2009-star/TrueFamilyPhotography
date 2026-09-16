import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Photographers } from "./pages/Photographers";
import { Photographer } from "./pages/Photographer";
import { Book } from "./pages/Book";
import { Galleries } from "./pages/Galleries";
import { Gallery } from "./pages/Gallery";
import { Studio } from "./pages/Studio";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/photographers" element={<Photographers />} />
        <Route path="/photographers/:id" element={<Photographer />} />
        <Route path="/book" element={<Book />} />
        <Route path="/book/:id" element={<Book />} />
        <Route path="/galleries" element={<Galleries />} />
        <Route path="/galleries/:id" element={<Gallery />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
