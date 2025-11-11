'use client'

import axios from 'axios';

import { DataGrid, type Column } from 'react-data-grid';

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

interface Row {
  id: number;
  created: string;
  canvasser_name: string;
  canvassee_name: string;
  canvassee_mobile: string;
  notes: notes;
}

const columns: Column<Row>[] = [
  { key: 'id', name: 'ID' },
  { key: 'created', name: 'Timestamp' },
  { key: 'canvasser_name', name: 'Canvasser' },
  { key: 'canvassee_name', name: 'Canvassee' },
  { key: 'canvassee_mobile', name: 'Phone' },
  //{ key: 'canvassee_email', name: 'Email' },
  { key: 'notes', name: 'Notes' },
];

function rowKeyGetter(row: Row) {
  return row.id;
}

export async function ActivitiesLog() {
  const activities = await fetchActivities();

  const rows = activities.map((activity) => {
    return {
      id: activity.id,
      created: activity.created.split('.')[0].replace('T', ' '),
      //canvasser_id: activity.canvasser.id,
      canvasser_name: activity.canvasser.name,
      //canvasser_mobile: activity.canvasser.mobile,
      //canvasser_email: activity.canvasser.email,
      //canvassee_id: activity.canvassee.id,
      canvassee_name: activity.canvassee.name,
      canvassee_mobile: activity.canvassee.mobile,
      //canvassee_email: activity.canvassee.email,
      //canvassee_sms_ok: activity.canvassee.sms_ok,
      //canvassee_street_address: activity.canvassee.street_address,
      notes: activity.notes,
    } as Row;
  });

  return (
    <DataGrid columns={columns} rows={rows} rowKeyGetter={rowKeyGetter} />
  );
}
