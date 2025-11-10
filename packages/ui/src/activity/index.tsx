import axios from 'axios';

type Activity = {
  id: number;
  canvasser_id: number;
  canvassee_id: number;
  notes: string;
};

async function fetchActivities(): Promise<Post[]> {
  const response = await axios.get('http://192.168.1.9:5001/activities');
  return response.data;
}

export default async function ActivitiesServerComponent() {
  const activities = await fetchActivities();

  return (

    <div id="activity-log-div">
      <table>
        <thead>
          <tr>
            <th>canvassee name</th>
            <th>canvassee email</th>
            <th>canvassee mobile</th>
            <th>canvasser name</th>
          </tr>
        </thead>
        <tbody>

        {activities.map((activity) => (

          <tr id={ 'activity_' + activity.id }>
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
