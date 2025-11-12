'use client'

import axios from 'axios';

import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

const API_SERVER_URL = process.env.API_SERVER_URL || "http://localhost:5001";

// canvas_activity rows with dereferenced INNER JOINs on canvasser, canvassee
type Activity = {
  id: number;
  canvasser_id: number;
  canvassee_id: number;
  notes: string;
  created: string;

  'canvasser.id': number;
  'canvasser.name': string;
  'canvasser.email': string;
  'canvasser.mobile': string;
  'canvasser.created': string;

  'canvassee.id': number;
  'canvassee.name': string;
  'canvassee.email': string;
  'canvassee.mobile': string;
  'canvassee.street_address': string;
  'canvassee.sms_ok': boolean;
  'canvassee.created': string;
};

async function fetchActivities(): Promise<Activity[]> {
  const response = await axios.get(API_SERVER_URL + '/activities');
  return response.data;
}

export async function ActivitiesLog() {
  const activities = await fetchActivities();

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'created', headerName: 'Timestamp' },
    { field: 'canvasser_headerName', name: 'Canvasser' },
    { field: 'canvassee_headerName', name: 'Canvassee' },
    { field: 'canvassee_mobile', headerName: 'Phone' },
    { field: 'notes', headerName: 'Notes' },
  ];

  const rows: GridRowsProp[] = activities.map((activity) => {
    return {
      id: activity.id,
      created: activity.created.split('.')[0].replace('T', ' '),
      canvasser_name: activity.canvasser.name,
      canvassee_name: activity.canvassee.name,
      canvassee_mobile: activity.canvassee.mobile,
      notes: activity.notes,
    };
  });

  console.log(columns);
  console.log(rows);

  return (

  <div id="activities-log-div" style={{ height: 300, width: '100%' }}>
    <DataGrid experimentalFeatures={{ ariaV7: true }}
      columns={columns} rows={rows}
      />
  </div>

  );
}
