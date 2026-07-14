import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import EditProfileModal from "./EditProfileModal";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      trips: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const totalTrips = user.trips.length;

  const totalBudget = user.trips.reduce(
    (sum, trip) => sum + trip.budget,
    0
  );

  const averageBudget =
    totalTrips > 0
      ? Math.round(totalBudget / totalTrips)
      : 0;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">
        My Profile
      </h1>
<EditProfileModal
  name={user.name}
  email={user.email}
  mobileNumber={user?.mobileNumber}
  profilePicture={user?.profilePicture}
/>
      <div className="border rounded-xl p-6 shadow space-y-4">
        <div>
          <h2 className="text-gray-500">
            Name
          </h2>
          <p className="text-xl font-semibold">
            {user.name}
          </p>
        </div>

        <div>
          <h2 className="text-gray-500">
            Email
          </h2>
          <p>{user.email}</p>
        </div>

        <div>
          <h2 className="text-gray-500">
            Joined
          </h2>
          <p>
            {user.createdAt.toLocaleDateString()}
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="border rounded-xl p-6 shadow">
          <h3 className="text-gray-500">
            Total Trips
          </h3>

          <p className="text-3xl font-bold">
            {totalTrips}
          </p>
        </div>

        <div className="border rounded-xl p-6 shadow">
          <h3 className="text-gray-500">
            Total Budget
          </h3>

          <p className="text-3xl font-bold">
            ₹{totalBudget}
          </p>
        </div>

        <div className="border rounded-xl p-6 shadow">
          <h3 className="text-gray-500">
            Average Budget
          </h3>

          <p className="text-3xl font-bold">
            ₹{averageBudget}
          </p>
        </div>
      </div>
    </div>
  );
}