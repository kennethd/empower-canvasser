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
    <div>

      <table>
          <tr>
            <th>canvassee name</th>
            <th>canvassee email</th>
            <th>canvassee mobile</th>
            <th>canvasser name</th>
          </tr>
        {activities.map((activity) => (
          <tr id={ 'activity_' + activity.id }>
            <td>{activity.canvassee.name}</li>
            <td>{activity.canvassee.email}</li>
            <td>{activity.canvassee.mobile}</li>
            <td>{activity.canvasser.name}</li>
          </tr>
          <tr>
            <td colspan="4">{activity.notes}</td>
          </tr>
        ))}
      </table>

    </div>
  );
}
