@@ .. @@
 import { ProfileHeader } from '../components/profile/ProfileHeader';
 import { DevoteeProfile } from '../components/profile/DevoteeProfile';
 import { PanditProfile } from '../components/profile/PanditProfile';
 import { ProfileActions } from '../components/profile/ProfileActions';
+import { reviewService } from '../services/reviewService';

-export function ProfilePage() {
+export function ProfilePage() {
   const { user, updateProfile } = useAuth();
+  const [stats, setStats] = React.useState({ rating: 0, reviewCount: 0 });
+
+  React.useEffect(() => {
+    if (user?.role === 'pandit') {
+      loadStats();
+    }
+  }, [user]);
+
+  const loadStats = async () => {
+    if (!user?.id) return;
+    const reviewStats = await reviewService.getReviewStats(user.id);
+    setStats({
+      rating: reviewStats.averageRating,
+      reviewCount: reviewStats.totalReviews
+    });
+  };

   if (!user) return null;

   const handleUpdateBio = async (bio: string) => {
@@ .. @@
       <div className="mt-8">
         {user.role === 'pandit' ? (
           <PanditProfile 
-            profile={user.profile} 
+            profile={{
+              ...user.profile,
+              id: user.id,
+              rating: stats.rating,
+              reviewCount: stats.reviewCount
+            }}
             onUpdateBio={handleUpdateBio}
           />
         ) : (