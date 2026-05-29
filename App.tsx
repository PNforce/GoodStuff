import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage.tsx';
import ArticlePage from './components/ArticlePage.tsx';
import SearchPage from './components/SearchPage.tsx';

const routerBase = import.meta.env.BASE_URL === '/'
  ? undefined
  : import.meta.env.BASE_URL.replace(/\/$/, '');

const App: React.FC = () => {
  return (
    <BrowserRouter basename={routerBase}>
      <div className="min-h-screen w-full bg-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/articles/:bookSlug" element={<ArticlePage />} />
          <Route path="/articles/:bookSlug/:chapterSlug" element={<ArticlePage />} />
          <Route path="/products/:id" element={<div className="p-10 font-serif text-xl">Product View: Tool Loading...</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
