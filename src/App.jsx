import React from 'react';
import content from './content/content.json';
import { TopBar, SiteFooter, SkipLink } from './components/Layout.jsx';
import Hero from './sections/Hero.jsx';
import LayerModel from './sections/LayerModel.jsx';
import Matrix from './sections/Matrix.jsx';
import Criteria from './sections/Criteria.jsx';
import Prices from './sections/Prices.jsx';
import Profiles from './sections/Profiles.jsx';
import Konstellationen from './sections/Konstellationen.jsx';
import Quiz from './sections/Quiz.jsx';
import Regulatorik from './sections/Regulatorik.jsx';
import Markt from './sections/Markt.jsx';
import Pruefauftraege from './sections/Pruefauftraege.jsx';
import Transparenz from './sections/Transparenz.jsx';
import Quellen from './sections/Quellen.jsx';

export default function App() {
  return (
    <>
      <SkipLink />
      <TopBar stand={content.meta.stand} />
      <main>
        <Hero content={content} />
        <LayerModel content={content} />
        <Matrix content={content} />
        <Criteria content={content} />
        <Prices content={content} />
        <Profiles content={content} />
        <Konstellationen content={content} />
        <Quiz content={content} />
        <Regulatorik content={content} />
        <Markt content={content} />
        <Pruefauftraege content={content} />
        <Transparenz content={content} />
        <Quellen content={content} />
      </main>
      <SiteFooter stand={content.meta.stand} />
    </>
  );
}
