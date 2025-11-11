import { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { rolesConfig, externalRolePermissions } from '../utils/permissionsConfig';

export const usePermissions = () => {
  const [permissionData, setPermissionData] = useState({
    permissions: {},
    roles: [],
    isLoading: true,
    hasPermission: () => false,
  });

  useEffect(() => {
    const fetchUserRole = async () => {
      let userPermissions = {};
      let userRoles = ['fan'];

      try {
        const user = await User.me();
        
        if (!user || !user.id) {
          userPermissions = (rolesConfig && rolesConfig.fan) ? { ...rolesConfig.fan } : {};
          userPermissions.canAccessStaffHQ = false;
          userPermissions.canAccessPlatformSettings = false;
          userPermissions.canAccessAPIManager = false;
          userPermissions.canAccessYouthAndCommunity = false;
          userPermissions.canAccessMonetization = false;
        } else {
          userRoles = [user.role, user.user_type, user.external_access_role].filter(Boolean);

          if (user.role === 'admin') {
            const allPermissionKeys = new Set();
            Object.values(rolesConfig || {}).forEach(role => role && Object.keys(role).forEach(key => allPermissionKeys.add(key)));
            Object.values(externalRolePermissions || {}).forEach(role => role && Object.keys(role).forEach(key => allPermissionKeys.add(key)));
            allPermissionKeys.forEach(key => { userPermissions[key] = true; });
            
            userPermissions.canAccessStaffHQ = true;
            userPermissions.canAccessPlatformSettings = true;
            userPermissions.canAccessAPIManager = true;
            userPermissions.canAccessYouthAndCommunity = true;
            userPermissions.canAccessMonetization = true;
          } else {
            const userRole = user.user_type || 'fan';
            const basePerms = (rolesConfig || {})[userRole] || (rolesConfig || {}).fan || {};
            let staffBasePerms = {};
            const staffRoles = ['staff', 'hr', 'governance', 'executive', 'devops', 'research', 'field_staff']; 
            if (staffRoles.includes(userRole)) {
              staffBasePerms = (rolesConfig || {}).staff || {};
            }
            userPermissions = { ...staffBasePerms, ...basePerms };
            
            if (user.external_access_role && user.external_access_role !== 'none') {
              const externalPerms = (externalRolePermissions || {})[user.external_access_role] || {};
              userPermissions = { ...userPermissions, ...externalPerms };
            }
          }
        }
      } catch (error) {
        userPermissions = (rolesConfig && rolesConfig.fan) ? { ...rolesConfig.fan } : {};
        userPermissions.canAccessAPIManager = false;
        userPermissions.canAccessYouthAndCommunity = false;
        userPermissions.canAccessMonetization = false;
      } finally {
        userPermissions.canAccessStaffHQ = userPermissions.canAccessStaffHQ || false;
        userPermissions.canAccessPlatformSettings = userPermissions.canAccessPlatformSettings || false;
        userPermissions.canAccessAPIManager = userPermissions.canAccessAPIManager || false;
        userPermissions.canAccessYouthAndCommunity = userPermissions.canAccessYouthAndCommunity || false;
        userPermissions.canAccessMonetization = userPermissions.canAccessMonetization || false;
        
        const hasPermission = (permissionKey) => Boolean(userPermissions[permissionKey]);
        
        setPermissionData({
          permissions: userPermissions,
          roles: userRoles,
          isLoading: false,
          hasPermission
        });
      }
    };

    fetchUserRole();
  }, []);

  return permissionData;
};