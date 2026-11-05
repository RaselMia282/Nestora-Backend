import { prisma } from "../../src/lib/prisma";
import { Role, Gender } from "../../src/generated/prisma/enums";

const seedRoommates = async () => {
  const users = await prisma.user.findMany({
    take: 5,
    where: {
      role: Role.TENANT,
    },
  });

  if (users.length === 0) {
    console.log("❌ No tenant users found.");
    return;
  }

  const dummyProfiles = [
    {
      role: Role.TENANT,
      gender: Gender.MALE,
      occupation: "Software Developer",
      budget: 15000,
      preferredArea: "Uttara, Dhaka",
      lifestyle: ["Non-Smoker", "Clean", "Friendly"],
      bio: "I am a software developer looking for a clean and friendly roommate.",
      profileImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
      profileImgPublicId: "dummy_public_id_1", // Added
    },
    {
      role: Role.TENANT,
      gender: Gender.FEMALE,
      occupation: "Student",
      budget: 8000,
      preferredArea: "Dhanmondi, Dhaka",
      lifestyle: ["Pet Lover", "Early Bird"],
      bio: "Looking for a female roommate to share a flat in Dhanmondi.",
      profileImg: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
      profileImgPublicId: "dummy_public_id_2", // Added
    },
    {
      role: Role.OWNER,
      gender: Gender.MALE,
      occupation: "Businessman",
      budget: 25000,
      preferredArea: "Gulshan, Dhaka",
      lifestyle: ["Non-Smoker", "Professional"],
      bio: "I have a spare room in Gulshan and looking for a professional roommate.",
      profileImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      profileImgPublicId: "dummy_public_id_3", // Added
    },
    {
      role: Role.TENANT,
      gender: Gender.FEMALE,
      occupation: "Graphic Designer",
      budget: 12000,
      preferredArea: "Banani, Dhaka",
      lifestyle: ["Creative", "Social"],
      bio: "A calm designer looking for a friendly female roommate.",
      profileImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
      profileImgPublicId: "dummy_public_id_4", // Added
    },
  ];

  console.log("⏳ Creating roommate profiles...");

  for (let i = 0; i < Math.min(users.length, dummyProfiles.length); i++) {
    const user = users[i];
    const profileData = dummyProfiles[i];

    await prisma.roommateProfile.upsert({
      where: { userId: user.id },
      update: {
        ...profileData,
      },
      create: {
        ...profileData,
        userId: user.id, // Directly setting userId
      },
    });

    console.log(`✅ Created profile for user ID: ${user.id} (${profileData.occupation})`);
  }

  console.log("🎉 All roommate profiles created successfully!");
};

seedRoommates()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });