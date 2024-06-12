import React, { useEffect, useState } from 'react';
import { Container, Text, VStack } from "@chakra-ui/react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Index = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://api.coincap.io/v2/assets/bitcoin/history?interval=d1')
      .then(response => response.json())
      .then(data => {
        const prices = data.data.map(entry => entry.priceUsd);
        const dates = data.data.map(entry => new Date(entry.time).toLocaleDateString());

        setChartData({
          labels: dates,
          datasets: [
            {
              label: 'Bitcoin Price (USD)',
              data: prices,
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.2)',
              fill: true,
            }
          ]
        });

        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">Cryptocurrency Prices</Text>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text>Error fetching data</Text>
        ) : (
          <Line data={chartData} options={{ responsive: true }} />
        )}
      </VStack>
    </Container>
  );
};

export default Index;