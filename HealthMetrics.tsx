import React from 'react';
import {
  Box,
  LinearProgress,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
} from '@mui/material';
import {
  SentimentVeryDissatisfied,
  SentimentDissatisfied,
  SentimentNeutral,
  SentimentSatisfied,
  SentimentVerySatisfied,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface HealthMetricsProps {
  stressLevel: number;
  healthScore: number;
  riskFactors: number[];
}

export const HealthMetrics: React.FC<HealthMetricsProps> = ({
  stressLevel,
  healthScore,
  riskFactors,
}) => {
  const getStressIcon = (level: number) => {
    if (level >= 0.8) return <SentimentVeryDissatisfied color="error" />;
    if (level >= 0.6) return <SentimentDissatisfied color="warning" />;
    if (level >= 0.4) return <SentimentNeutral color="info" />;
    if (level >= 0.2) return <SentimentSatisfied color="success" />;
    return <SentimentVerySatisfied color="success" />;
  };

  const getHealthStatus = (score: number) => {
    if (score >= 0.8) return { text: 'Excellent', color: 'success.main' };
    if (score >= 0.6) return { text: 'Good', color: 'success.light' };
    if (score >= 0.4) return { text: 'Fair', color: 'warning.main' };
    if (score >= 0.2) return { text: 'Poor', color: 'error.light' };
    return { text: 'Critical', color: 'error.main' };
  };

  const healthStatus = getHealthStatus(healthScore);

  const healthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Blood Pressure',
        data: [120, 118, 122, 119, 121, 120],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Heart Rate',
        data: [72, 70, 75, 73, 71, 72],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Health Metrics Over Time',
      },
    },
  };

  const metrics = [
    {
      title: 'Blood Pressure',
      value: '120/80',
      status: 'Normal',
      color: 'text-green-600',
    },
    {
      title: 'Heart Rate',
      value: '72 BPM',
      status: 'Normal',
      color: 'text-green-600',
    },
    {
      title: 'Oxygen Saturation',
      value: '98%',
      status: 'Normal',
      color: 'text-green-600',
    },
    {
      title: 'Body Temperature',
      value: '37.2°C',
      status: 'Normal',
      color: 'text-green-600',
    },
  ];

  return (
    <div className="space-y-6">
      <Typography variant="h4" className="text-primary mb-6">
        Health Metrics Dashboard
      </Typography>

      <Grid container spacing={3}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.title}>
            <Card className="p-4">
              <Typography variant="h6" className="text-gray-600">
                {metric.title}
              </Typography>
              <Typography variant="h4" className="mt-2">
                {metric.value}
              </Typography>
              <Typography className={`mt-2 ${metric.color}`}>
                {metric.status}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card className="p-6">
        <Box className="h-[400px]">
          <Line options={options} data={healthData} />
        </Box>
      </Card>

      <Card className="p-6">
        <Typography variant="h6" className="mb-4">
          Health Recommendations
        </Typography>
        <ul className="list-disc pl-5 space-y-2">
          <li>Maintain regular exercise routine</li>
          <li>Follow a balanced diet</li>
          <li>Stay hydrated throughout the day</li>
          <li>Get adequate sleep (7-9 hours)</li>
          <li>Manage stress levels</li>
          <li>Schedule regular health check-ups</li>
        </ul>
      </Card>
    </div>
  );
};

export default HealthMetrics; 