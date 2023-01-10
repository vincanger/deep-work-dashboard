import waspLogo from './waspLogo.png';
import React from 'react';
import { Link } from 'react-router-dom';
import './Main.css';
import getWork from '@wasp/queries/getWork';
import { useQuery } from '@wasp/queries';
import Chart from './Chart';

const MainPage = () => {
  const { data: work, isError, error } = useQuery(getWork);

  if (isError) return <p>Error: {error.message}</p>;

  if (work)
    return (
      <main>
        <div>
          <Chart work={work} />
        </div>
        {work.map((x) => (
          <p>
            {JSON.stringify(x)}
            <br />
          </p>
        ))}
      </main>
    );

  return <p>Loading...</p>;
};
export default MainPage;
