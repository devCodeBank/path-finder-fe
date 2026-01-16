import { LoadingSpinner } from "@components/loading";
import { checkAuthStatus } from "@redux/slices/authSlice";
import type { AppDispatch } from "@redux/store";
import React, { Suspense, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "./components/layout/authLayout/AuthLayout";
import PlatformLayout from "./components/layout/platformLayout/PlatformLayout";

// Dynamic imports for route-based code splitting
const LoginPage = React.lazy(() => import("./pages/authentication/login/Login"));
const SignupPage = React.lazy(() => import("./pages/authentication/signup/Signup"));
const EmailVerificationPage = React.lazy(() => import("./pages/authentication/emailVerification/EmailVerification"));
const ForgotPasswordPage = React.lazy(() => import("./pages/authentication/forgotPassword/ForgotPassword"));
const ResetPasswordPage = React.lazy(() => import("./pages/authentication/resetPassword/ResetPassword"));
const DashboardPage = React.lazy(() => import("./pages/dashboard/Dashboard"));
const CandidatesPage = React.lazy(() => import("./pages/candidates/Candidates"));
const JobsPage = React.lazy(() => import("./pages/jobs/Jobs"));
const CompaniesPage = React.lazy(() => import("./pages/companies/Companies"));
const ContactsPage = React.lazy(() => import("./pages/contacts/Contacts"));
const MailPage = React.lazy(() => import("./pages/mail/Mail"));
const FoldersPage = React.lazy(() => import("./pages/folders/Folders"));
const ReportsPage = React.lazy(() => import("./pages/reports/Reports"));
const ActivitiesPage = React.lazy(() => import("./pages/activities/Activities"));
const ChatPage = React.lazy(() => import("./pages/chat/Chat"));

// Settings Layout and Pages
const SettingsLayout = React.lazy(() => import("./components/layout/settingsLayout/SettingsLayout"));

// User Settings Pages
const ProfilePage = React.lazy(() => import("./pages/settings/userSettings/Profile"));
const NotificationsPage = React.lazy(() => import("./pages/settings/userSettings/Notifications"));
const PrivacySecurityPage = React.lazy(() => import("./pages/settings/userSettings/PrivacySecurity"));
const EmailPage = React.lazy(() => import("./pages/settings/userSettings/Email"));
const CalendarPage = React.lazy(() => import("./pages/settings/userSettings/Calendar"));
const MeetingAppsPage = React.lazy(() => import("./pages/settings/userSettings/MeetingApps"));

// Admin Settings Pages
const CompanyDetailsPage = React.lazy(() => import("./pages/settings/adminSettings/CompanyDetails"));
const UsersPage = React.lazy(() => import("./pages/settings/adminSettings/Users"));
const AddUserPage = React.lazy(() => import("./pages/settings/adminSettings/AddUser"));
const RolesPermissionsPage = React.lazy(() => import("./pages/settings/adminSettings/RolesPermissions"));
const SystemRolesPage = React.lazy(() => import("./pages/settings/adminSettings/rolesPermissions/SystemRoles/SystemRoles"));
const CreateCustomRolePage = React.lazy(() => import("./pages/settings/adminSettings/rolesPermissions/CustomRole/CreateCustomRole"));
const TeamsPage = React.lazy(() => import("./pages/settings/adminSettings/Teams"));
const CreateTeamPage = React.lazy(() => import("./pages/settings/adminSettings/teams/CreateTeam"));
const LocationsPage = React.lazy(() => import("./pages/settings/adminSettings/Locations"));
const BillingPage = React.lazy(() => import("./pages/settings/adminSettings/Billing"));
const AuditLogPage = React.lazy(() => import("./pages/settings/adminSettings/AuditLog"));

// Job Settings Pages
const LayoutPage = React.lazy(() => import("./pages/settings/jobSettings/Layout"));
const FieldsPage = React.lazy(() => import("./pages/settings/jobSettings/Fields"));
const StatusPage = React.lazy(() => import("./pages/settings/jobSettings/Status"));
const TagsPage = React.lazy(() => import("./pages/settings/jobSettings/Tags"));
const SkillSetPage = React.lazy(() => import("./pages/settings/jobSettings/SkillSet"));
const PagePage = React.lazy(() => import("./pages/settings/jobSettings/Page"));

const LoadingFallback: React.FC = () => <LoadingSpinner isLoading />;

const App: React.FC = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const checkAuth = async () => {
      await dispatch(checkAuthStatus());
      setAuthChecked(true);
    };

    checkAuth();
  }, [dispatch]);

  if (!authChecked) {
    return <LoadingFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* AUTH FLOW - No authentication required */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="auth/login" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="verify-email" element={<EmailVerificationPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* PROTECTED ROUTES - Authentication handled by PlatformLayout */}
        <Route path="/" element={<PlatformLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          {/* <Route index element={<Navigate to="/dashboard" replace />} /> */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="candidates" element={<CandidatesPage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="companies" element={<CompaniesPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="mail" element={<MailPage />} />
          <Route path="folders" element={<FoldersPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="activities" element={<ActivitiesPage />} />
          <Route path="chat" element={<ChatPage />} />

          {/* Settings Routes with nested structure */}
          <Route path="settings" element={<SettingsLayout />}>
            {/* <Route index element={<Navigate to="/settings/user/profile" replace />} /> */}
            <Route index element={<Navigate to="/settings/user/profile" replace />} />
            {/* <Route path="user/profile" element={<ProfilePage />} /> */}

            {/* User Settings Routes */}
            <Route path="user/profile" element={<ProfilePage />} />
            <Route path="user/notifications" element={<NotificationsPage />} />
            <Route path="user/privacy-security" element={<PrivacySecurityPage />} />
            <Route path="user/email" element={<EmailPage />} />
            <Route path="user/calendar" element={<CalendarPage />} />
            <Route path="user/meeting-apps" element={<MeetingAppsPage />} />

            {/* Admin Settings Routes */}
            <Route path="admin/company-details" element={<CompanyDetailsPage />} />
            <Route path="admin/users" element={<UsersPage />} />
            <Route path="admin/users/add" element={<AddUserPage />} />
            <Route path="admin/users/edit/:userId" element={<AddUserPage />} />
            <Route path="admin/roles-permissions" element={<RolesPermissionsPage />} />
            <Route path="admin/roles-permissions/system-roles" element={<SystemRolesPage />} />
            <Route path="admin/roles-permissions/create-custom" element={<CreateCustomRolePage />} />
            <Route path="admin/teams" element={<TeamsPage />} />
            <Route path="admin/teams/create" element={<CreateTeamPage />} />
            <Route path="admin/teams/create/:teamId" element={<CreateTeamPage />} />
            <Route path="admin/locations" element={<LocationsPage />} />
            <Route path="admin/billing" element={<BillingPage />} />
            <Route path="admin/audit-log" element={<AuditLogPage />} />

            {/* Job Settings Routes */}
            <Route path="job/layout" element={<LayoutPage />} />
            <Route path="job/fields" element={<FieldsPage />} />
            <Route path="job/status" element={<StatusPage />} />
            <Route path="job/tags" element={<TagsPage />} />
            <Route path="job/skill-set" element={<SkillSetPage />} />
            <Route path="job/page" element={<PagePage />} />
          </Route>
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
