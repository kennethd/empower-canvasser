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

      <ul>
        {activities.map((activity) => (
          <li key={activity.id}>{activity}</li>
        ))}
      </ul>
    </div>
  );
}
