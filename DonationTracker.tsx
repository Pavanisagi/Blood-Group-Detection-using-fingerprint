import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  LocalHospital,
  AttachMoney,
  History,
  TrendingUp,
} from '@mui/icons-material';

interface Donation {
  date: string;
  location: string;
  amount: string;
  recipient: string;
}

interface DonationTrackerProps {
  donations: Donation[];
}

const DonationTracker: React.FC<DonationTrackerProps> = ({ donations }) => {
  const [cryptoStats] = useState({
    totalEarned: '150 BLOOD',
    currentValue: '$450',
    nextDonation: '2024-04-15',
  });

  return (
    <div className="space-y-6">
      <Typography variant="h4" className="text-primary mb-6">
        Blood Donation Tracker
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card className="p-6">
            <Box className="flex items-center space-x-2 mb-4">
              <AttachMoney className="text-green-500" />
              <Typography variant="h6">Total Earned</Typography>
            </Box>
            <Typography variant="h4" className="text-green-600">
              {cryptoStats.totalEarned}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Current Value: {cryptoStats.currentValue}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className="p-6">
            <Box className="flex items-center space-x-2 mb-4">
              <History className="text-blue-500" />
              <Typography variant="h6">Next Donation</Typography>
            </Box>
            <Typography variant="h4" className="text-blue-600">
              {new Date(cryptoStats.nextDonation).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              You can donate again in 2 weeks
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className="p-6">
            <Box className="flex items-center space-x-2 mb-4">
              <TrendingUp className="text-purple-500" />
              <Typography variant="h6">Donation Streak</Typography>
            </Box>
            <Typography variant="h4" className="text-purple-600">
              3 Months
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Keep up the great work!
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Donation History
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Recipient</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {donations.map((donation, index) => (
                <TableRow key={index}>
                  <TableCell>{donation.date}</TableCell>
                  <TableCell>{donation.location}</TableCell>
                  <TableCell>{donation.amount}</TableCell>
                  <TableCell>{donation.recipient}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Card className="p-6">
        <Typography variant="h6" className="mb-4">
          Crypto Rewards Program
        </Typography>
        <Box className="space-y-4">
          <Typography variant="body1">
            Earn BLOOD tokens for your donations:
          </Typography>
          <ul className="list-disc pl-5 space-y-2">
            <li>50 BLOOD tokens per donation</li>
            <li>Tokens can be used for medical services</li>
            <li>Tokens can be traded on supported exchanges</li>
            <li>Special rewards for regular donors</li>
          </ul>
          <Button
            variant="contained"
            color="primary"
            className="mt-4"
            disabled={new Date(cryptoStats.nextDonation) > new Date()}
          >
            Schedule Next Donation
          </Button>
        </Box>
      </Card>
    </div>
  );
};

export default DonationTracker; 