import UserProfile from "@/components/profile/UserProfile";

export default async function ProfilePage({ params }) {
  const { username } = await params;
  return <UserProfile username={username} />;
}
