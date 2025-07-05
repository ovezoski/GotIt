import apiClient from "@/api/axiosConfig";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface Profile {
  bio: string;
  url: string;
  user: { email: string; username: string };
  user_id: number;
}

function ProfilePage() {
  const saving = false;
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [profileLoading, setProfileLoading] = useState<boolean>(true);

  const { user, loading: authLoading } = useAuth();
  const userId = user?.user_id;

  const loading = authLoading || profileLoading;

  const updateProfile = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await apiClient.put(`/profiles/${userId}/`, {
        user: {
          email: email,
          username: username,
        },
        bio: bio,
      });

      if (response.status === 200) {
        toast.success("Profile Updated.");
      } else {
        toast.error("Profile Update failed.");
      }
    } catch (e) {
      console.error(e);
    }
  }, [bio, email, userId, username]);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;

    setProfileLoading(true);
    try {
      const response = await apiClient.get<Profile>(`/profiles/${userId}/`);

      const data = response.data;
      setUsername(data.user.username);
      setEmail(data.user.email);
      setBio(data.bio);
    } catch (err) {
      console.error("Fetch profile error:", err);
    } finally {
      setProfileLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile, userId]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 font-sans">
      {profileLoading && "profile"}
      {authLoading && "auth"}
      <Card className="w-full max-w-md rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Edit Profile
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Update your personal information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-gray-500">Loading profile...</div>
          ) : (
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us a little about yourself..."
                  className="min-h-[100px]"
                />
              </div>
              <Button
                type="button"
                onClick={updateProfile}
                className="w-full"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfilePage;
