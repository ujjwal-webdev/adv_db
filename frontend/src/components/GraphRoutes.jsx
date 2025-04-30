import { useEffect, useState } from 'react';
import api from '../services/api';
import ForceGraph2D from 'react-force-graph-2d';

const GraphRoutes = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await api.get('/flights/busiest');
        const flights = res.data;

        const nodesSet = new Set();
        const links = [];

        flights.forEach(route => {
          nodesSet.add(route.origin);
          nodesSet.add(route.destination);

          links.push({
            source: route.origin,
            target: route.destination,
            value: route.count
          });
        });

        const nodes = Array.from(nodesSet).map(airport => ({ id: airport }));

        setGraphData({ nodes, links });
      } catch (err) {
        console.error('Error fetching busiest routes:', err);
      }
    };

    fetchRoutes();
  }, []);

  return (
    <div className="h-screen">
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="id"
        nodeAutoColorBy="id"
        linkWidth={link => Math.log(link.value + 1)}
        linkDirectionalArrowLength={6}
        linkDirectionalArrowRelPos={1}
      />
    </div>
  );
};

export default GraphRoutes;
