import React, { useEffect, useState } from 'react';
import { Box, Spinner } from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CryptoGraph = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.coincap.io/v2/assets/bitcoin/history?interval=d1');
        const data = await response.json();
        const prices = data.data.map(entry => ({
          time: new Date(entry.time).toLocaleDateString(),
          price: parseFloat(entry.priceUsd)
        }));

        setChartData({
          labels: prices.map(entry => entry.time),
          datasets: [
            {
              label: 'Bitcoin Price (USD)',
              data: prices.map(entry => entry.price),
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
            }
          ]
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching the crypto data', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box width="100%" height="400px" display="flex" justifyContent="center" alignItems="center">
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      )}
    </Box>
  );
};

export default CryptoGraph;