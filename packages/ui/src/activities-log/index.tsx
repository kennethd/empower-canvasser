import axios from 'axios';

// TODO: where to put type defs?
// TODO: where to put constants?
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

  return (

    <div id="activity-log-div">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>canvasser name</th>
            <th>canvassee name</th>
            <th>canvassee contact</th>
            <th>canvassee mobile</th>
          </tr>
        </thead>
        <tbody>

        {activities.map((activity) => (

          <tr id={ 'activity_' + activity.id }>
            <td>{activity.created.split('.')[0].replace('T', ' ')}</td>
            <td>{activity.canvasser.name}</td>
            <td>{activity.canvassee.name}</td>
            <td>
                {activity.canvassee.email} <br />
                {activity.canvassee.mobile}
            </td>
            <td>{activity.notes}</td>
          </tr>

        ))}

        </tbody>
      </table>
    </div>
    
  );
}
