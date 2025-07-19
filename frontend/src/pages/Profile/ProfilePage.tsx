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
import { useAuth } from "@/hooks/useAuth";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import Editor, { type ContentEditableEvent } from "react-simple-wysiwyg";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface Profile {
  bio: string;
  url: string;
  user: { email: string; username: string };
  user_id: number;
}

function ProfilePage() {
  const [saving, setSaving] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [profileLoading, setProfileLoading] = useState<boolean>(true);

  const { user, loading: authLoading } = useAuth();
  const userId = user?.user_id;

  const loading = authLoading || profileLoading;

  const updateProfile = useCallback(async () => {
    if (!userId) return;

    setSaving(true);
    try {
      const response = await apiClient.put(`/api/profiles/${userId}/`, {
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
      toast.error("An error occurred during profile update.");
    } finally {
      setSaving(false);
    }
  }, [bio, email, userId, username]);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;

    setProfileLoading(true);
    try {
      const response = await apiClient.get<Profile>(`/api/profiles/${userId}/`);
      const data = response.data;
      setUsername(data.user.username);
      setEmail(data.user.email);
      setBio(data.bio);
    } catch (err) {
      console.error("Fetch profile error:", err);
      toast.error("Failed to load profile data.");
    } finally {
      setProfileLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [fetchProfile, userId]);

  const handleBioChange = (e: ContentEditableEvent) => {
    setBio(e.target.value);
  };

  if (loading) {
    return <ProfilePageSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-gray-100 p-4 font-sans"
    >
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
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUsername(e.target.value)
                }
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                placeholder="your.email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Editor
                value={bio}
                onChange={handleBioChange}
                containerProps={{ style: { height: "200px", width: "100%" } }}
                className="rounded-md border border-input bg-background text-sm ring-offset-background"
              />
            </div>
            <Button
              type="button"
              onClick={updateProfile}
              className="w-full"
              disabled={saving || loading}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ProfilePageSkeleton() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 font-sans">
      <Card className="w-full max-w-md rounded-xl shadow-lg">
        <CardHeader>
          <Skeleton className="h-7 w-2/4 mx-auto" />
          <Skeleton className="h-5 w-3/4 mx-auto mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-40 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfilePage;
