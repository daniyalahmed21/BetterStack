Navigate to the project root and run the following command to automatically migrate our database:
pnpm turbo db:migrate

To generate the types from Prisma schema, from the project root run:
pnpm turbo db:generate


pnpm prisma studio

Import the database package in the web app
The turborepo-prisma project should have an app called web at apps/web. Add the database dependency to apps/web/package.json:

{
  // ...
  "dependencies": {
    "@repo/db": "*"
    // ...
  }
  // ...
} 


apps/web/app/page.tsx


import styles from "./page.module.css";
import { prisma } from "@repo/db";

export default async function Home() {
  const user = await prisma.user.findFirst() 
  return (
    <div className={styles.page}>
      {user?.name ?? "No user added yet"}
    </div>
  );
}


Then, create a .env file in the web directory and copy into it the contents of the .env file from the /database directory containing the DATABASE_URL:

apps/web/.env
DATABASE_URL="Same database url as used in the database directory"