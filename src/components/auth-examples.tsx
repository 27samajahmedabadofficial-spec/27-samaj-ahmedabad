/**
 * Example Usage of Authentication System
 * 
 * This file demonstrates how to use the AuthContext and profileService
 * to access user information and manage authentication.
 */

import { useAuth } from "@/contexts/AuthContext";
import { profileService } from "@/services/profileService";
import { Button } from "@/components/ui/button";

/**
 * Example 1: Display current user information
 */
export const UserInfoDisplay = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div>Loading user info...</div>;
  }

  if (!user) {
    return <div>Not logged in</div>;
  }

  return (
    <div className="space-y-2">
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Name:</strong> {profile?.full_name || "Not set"}</p>
      <p><strong>Phone:</strong> {profile?.phone || "Not set"}</p>
      <p><strong>City:</strong> {profile?.city || "Not set"}</p>
      <p><strong>Member Since:</strong> {profile?.created_at}</p>
    </div>
  );
};

/**
 * Example 2: Update user profile
 */
export const UpdateProfileExample = () => {
  const { user } = useAuth();

  const handleUpdateCity = async () => {
    if (!user) return;

    // Update user's city in database
    const updated = await profileService.updateProfileField(
      user.id,
      "city",
      "Ahmedabad"
    );

    if (updated) {
      alert("City updated successfully!");
      // Note: The AuthContext will automatically refresh the profile
    }
  };

  return (
    <div className="space-y-4">
      <h3>Update Your Profile</h3>
      <Button onClick={handleUpdateCity}>Set City to Ahmedabad</Button>
    </div>
  );
};

/**
 * Example 3: Logout button
 */
export const LogoutButton = () => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    // User will be redirected to /auth by ProtectedRoute component
  };

  return (
    <Button 
      onClick={handleLogout}
      variant="outline"
    >
      Logout
    </Button>
  );
};

/**
 * Example 4: Conditional rendering based on authentication
 */
export const ConditionalContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.email}!</h2>
          <p>You are logged in.</p>
        </div>
      ) : (
        <div>
          <h2>Please login to continue</h2>
          <p>You need to be authenticated to access this content.</p>
        </div>
      )}
    </div>
  );
};

/**
 * Example 5: Check if user has completed their profile
 */
export const ProfileCompletionCheck = () => {
  const { profile } = useAuth();

  const isProfileComplete = !!(
    profile?.full_name &&
    profile?.phone &&
    profile?.city
  );

  return (
    <div>
      {!isProfileComplete && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          ⚠️ Please complete your profile by adding your phone number and city.
        </div>
      )}
    </div>
  );
};

/**
 * Usage in a React component:
 * 
 * import { UserInfoDisplay, LogoutButton } from "@/components/auth-examples";
 * 
 * export const MyPage = () => {
 *   return (
 *     <div>
 *       <UserInfoDisplay />
 *       <LogoutButton />
 *     </div>
 *   );
 * };
 */
