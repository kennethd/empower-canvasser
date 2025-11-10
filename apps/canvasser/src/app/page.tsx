import { log } from "@repo/logger";
import { Link } from "@repo/ui/link";
import { ActivitiesServerComponent } from "@repo/ui/activity";

export const metadata = {
  title: "Empower Canvasser",
};

export default function Canvasser() {
  log("Welcome to Empower Canvasser!");

  return (
    <div className="container">
      <h1 className="title">
        Empower Canvasser
      </h1>

      <ActivitiesServerComponent />

      <p className="description">
        Built With{" "}
        <Link href="https://turborepo.com" newTab>
          Turborepo
        </Link>
        {" & "}
        <Link href="https://nextjs.org/" newTab>
          Next.js
        </Link>
        {" & "}
        <Link href="https://expressjs.org/" newTab>
          express.js
        </Link>
        {" & "}
        <Link href="https://sequelize.org/" newTab>
          Sequelize
        </Link>
      </p>
    </div>
  );
}
