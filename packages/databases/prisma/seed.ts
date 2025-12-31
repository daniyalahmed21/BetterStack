import { prisma } from "../src/client";

async function main() {
  const users = [
    { email: "alice@example.com", name: "Alice" },
    { email: "bob@example.com", name: "Bob" },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
  }

  console.log("Seeding regions...");

  const regions = [
    { name: "US-East" },
    { name: "US-West" },
    { name: "EU-Central" },
    { name: "Asia-East" },
  ];

  for (const region of regions) {
    await prisma.region.upsert({
      where: { name: region.name },
      update: {},
      create: region,
    });
  }

  console.log("Seeding websites...");

 const websites = [
  { url: "https://example.com", userEmail: "alice@example.com" },
  { url: "https://test.com", userEmail: "bob@example.com" },
];

for (const w of websites) {
  const user = await prisma.user.findUnique({ where: { email: w.userEmail } });
  if (!user) throw new Error(`User not found: ${w.userEmail}`);

  await prisma.website.upsert({
    where: { id: crypto.randomUUID() }, // or another unique identifier
    update: {},
    create: {
      url: w.url,
      userId: user.id,
    },
  });
}


  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
