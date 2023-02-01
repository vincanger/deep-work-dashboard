// import waspLogo from './waspLogo.png';
import React from 'react';
import './Main.css';
import getTotalWork from '@wasp/queries/getTotalWork';
import { useQuery } from '@wasp/queries';
import Chart from './Chart';

const MainPage = () => {
  const { data: work, isError, error } = useQuery(getTotalWork);

  if (isError) return <p>Error: {error.message}</p>;

  if (work)
    return (
      <main>
        {/* <img src={waspLogo} alt='Wasp Logo' width={'40px'}/> */}
        <div>
          <Chart work={work} />
        </div>
      </main>
    );

  return <p>Loading...</p>;
};
export default MainPage;
