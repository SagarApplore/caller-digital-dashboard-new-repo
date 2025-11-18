"use client";
import { useRouter, usePathname } from "next/navigation";
import {
  HelpCircle,
  User,
  LogOut,
  Coins,
  Key,
  SquareUser,
  BriefcaseBusiness,
  Settings
} from "lucide-react";
import { useAuth } from "./providers/auth-provider";
import { updateActiveRoute } from "@/lib/sidebar-routes";
import { CreditDisplay } from "./credit-display";
import { useState, useEffect } from "react";
import { ResetPasswordModal } from "./reset-password-modal";
import { LogoutConfirmation } from "@/components/logout-confirmation";
import { AddConfigurationModal } from "@/components/add-configuration-modal"; 
import apiRequest from "@/utils/api";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
    const [showAddConfiguration, setShowAddConfiguration] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Update routes with active state based on current path
  const activeRoutes = updateActiveRoute(pathname);

  // Filter routes by user role
  const filteredRoutes = activeRoutes.filter(
    (route) =>
      !route.roles || (user && user.role && route.roles.includes(user.role))
  );

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    const fetchLogoUrl = async () => {
      if (user?.companyLogo) {
        try {
          // const res = await fetch(
          //   `/s3KeyExtraction?s3Uri=${encodeURIComponent(user.companyLogo)}`
          // );

           const signedUrlRes = await apiRequest(
                `/s3KeyExtraction?s3Uri=${encodeURIComponent(user.companyLogo)}`,
                "GET"
              );
        
          if (signedUrlRes?.data.url) {
            setLogoUrl(signedUrlRes?.data?.url);
          }
        } catch (error) {
          console.error("Failed to fetch logo URL:", error);
        }
      }
    };

    fetchLogoUrl();
  }, [user?.companyLogo]);

  return (
    <>
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
        {/* Logo */}
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-sm"></div>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col space-y-2">
          {filteredRoutes.map((route) => (
            <button
              key={route.id}
              onClick={() => handleNavigation(route.path)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                route.isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
              title={route.name}
            >
              <route.icon className="w-5 h-5" />
            </button>
          ))}
        </div>

        {/* Bottom Items */}
        <div className="flex-1"></div>
        <div className="flex flex-col space-y-2">
          {/* Credit Icon with Hover Tooltip */}
          <div className="relative">
            <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors peer">
              <Coins className="w-5 h-5" />
            </button>

            {/* Hover Tooltip */}
            <div
              className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-3 opacity-0 invisible peer-hover:opacity-100 peer-hover:visible hover:opacity-100 hover:visible transition-all duration-200 z-50"
              style={{ marginBottom: "8px" }}
            >
              <CreditDisplay />
            </div>
          </div>

          {/* <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50">
            <HelpCircle className="w-5 h-5" />
          </button> */}
          {/* User Profile with Hover Dropdown */}
          <div className="relative">
            <button className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center peer">
              <User className="w-4 h-4 text-purple-600" />
            </button>

            {/* User Profile Dropdown */}
            <div
              className="absolute bottom-full left-0 mb-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-3 opacity-0 invisible peer-hover:opacity-100 peer-hover:visible hover:opacity-100 hover:visible transition-all duration-200 z-50"
              style={{ marginBottom: "8px" }}
            >
              <div className="flex flex-col space-y-3">
                {/* User Info */}
                {/* <div className="flex flex-col space-y-1 border-b border-gray-100 pb-3">
                  <span className="text-sm font-medium text-gray-900">{user?.name || 'User'}</span>
                  <span className="text-xs text-gray-500">{user?.email || 'No email'}</span>
                </div> */}
                <div className="flex items-center space-x-3 border-b border-gray-100 pb-3">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Company Logo"
                      className="w-8 h-8 rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center text-xs font-bold text-gray-600">
                      {user?.companyName?.charAt(0) || "C"}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {user?.name || "User"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {user?.email || "No email"}
                    </span>
                  </div>
                </div>

                {/* Actions */}

                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600 transition-colors">
                    <BriefcaseBusiness className="w-4 h-4" />
                    <span>{`Org Name: ${user?.companyName}`}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600 transition-colors">
                    <SquareUser className="w-4 h-4" />
                    <span>{`Account Type: ${
                      user?.DIY ? "DIY" : "NON-DIY"
                    }`}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600 transition-colors">
                    <User className="w-4 h-4" />
                    <span>{`Role: ${user?.role}`}</span>
                  </div>
                  <button
                    onClick={() => setShowResetPassword(true)}
                    className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Key className="w-4 h-4" />
                    <span>Reset Password</span>
                  </button>

                    {/* ➕ Add Configuration */}
                  <button
                    onClick={() => setShowAddConfiguration(true)}
                    className="flex items-center space-x-2 text-sm text-gray-700 hover:text-green-600"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Add Configuration</span>
                  </button>

                  <button
                    onClick={() => setShowLogoutConfirmation(true)}
                    className="flex items-center space-x-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetPassword && (
        <ResetPasswordModal
          isOpen={showResetPassword}
          onClose={() => setShowResetPassword(false)}
        />
      )}

     
      {showAddConfiguration && (
        <AddConfigurationModal
          isOpen={showAddConfiguration}
          onClose={() => setShowAddConfiguration(false)}
          clientId={user?.id || user?.clientId}  
        />
      )}



      {/* Logout Confirmation */}
      <LogoutConfirmation
        isOpen={showLogoutConfirmation}
        onClose={() => setShowLogoutConfirmation(false)}
        onConfirm={logout}
      />
    </>
  );
}
