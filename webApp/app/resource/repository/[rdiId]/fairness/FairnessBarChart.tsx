'use client';

import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';

interface ChartProps {
  fairnessData: any; // Expects the flattened `fairnessAssessment` object
}

export default function FairnessBarChart({ fairnessData }: ChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getPillarPercentage = (pillarKey: string) => {
    const pillar = fairnessData?.[pillarKey];
    if (!pillar || typeof pillar !== 'object') return 0;

    let total = 0;
    let yesCount = 0;

    // List of structural metadata properties to filter out from calculations
    const reservedKeys = ['description', 'display_name', 'title', 'type'];

    Object.entries(pillar).forEach(([key, field]: [string, any]) => {
      // Ignore schema definitions so they don't break the percentage mathematics
      if (reservedKeys.includes(key)) return;

      const val = field?.value;

      // Evaluates native boolean states provided by your updated API pipeline
      if (typeof val === 'boolean') {
        total++;
        if (val === true) yesCount++;
      }
      // Note: 'null' (missing data) is explicitly ignored, preserving your baseline denominator
    });

    return total > 0 ? Math.round((yesCount / total) * 100) : 0;
  };

  const data = [
    { name: 'Findability', score: getPillarPercentage('findability'), color: '#0f9884' },
    { name: 'Accessibility', score: getPillarPercentage('accessibility'), color: '#0f9884' },
    { name: 'Interoperability', score: getPillarPercentage('interoperability'), color: '#0f9884' },
    { name: 'Reusability', score: getPillarPercentage('reusability'), color: '#0f9884' }
  ];

  if (!isMounted) {
    return <Box sx={{ width: '100%', height: 350, mt: 2, bgcolor: '#fafafa', borderRadius: 2 }} />;
  }

  return (
    <Box sx={{ width: '100%', height: 350, mt: 2, display: 'flex', justifyContent: 'center' }}>
      {/* Wrapped in ResponsiveContainer to protect rendering accuracy across varying display targets */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#555', fontWeight: 500 }}
            axisLine={{ stroke: '#e0e0e0' }}
          />
          <YAxis 
            domain={[0, 100]} 
            tick={{ fill: '#777' }}
            axisLine={{ stroke: '#e0e0e0' }}
            unit="%"
          />
          <Tooltip 
            formatter={(value: any) => [`${value}%`, 'Compliance Rating']}
            contentStyle={{ backgroundColor: '#fff', borderRadius: 8, border: '1px solid #e0e0e0' }}
          />
          <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={60}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}