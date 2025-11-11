/**
 * @jest-environment jsdom
 */
import { usePermissions } from '../hooks/usePermissions';
import { useXP } from '../XPContext';

// Mock the useXP hook
jest.mock('../XPContext', () => ({
  useXP: jest.fn(),
}));

describe('usePermissions Hook', () => {
  test('should grant Staff HQ access to admin role', () => {
    useXP.mockReturnValue({ user: { role: 'admin' } });
    const permissions = usePermissions();
    expect(permissions.canAccessStaffHQ).toBe(true);
  });

  test('should grant Staff HQ access to staff user_type', () => {
    useXP.mockReturnValue({ user: { role: 'fan', user_type: 'staff' } });
    const permissions = usePermissions();
    expect(permissions.canAccessStaffHQ).toBe(true);
  });

  test('should deny Staff HQ access to a regular fan', () => {
    useXP.mockReturnValue({ user: { role: 'fan', user_type: 'fan' } });
    const permissions = usePermissions();
    expect(permissions.canAccessStaffHQ).toBe(false);
  });

  test('should grant MA Dashboard access to MA Admin', () => {
    useXP.mockReturnValue({ user: { role: 'ma_admin' } });
    const permissions = usePermissions();
    expect(permissions.canViewMADashboard).toBe(true);
  });

  test('should deny MA Dashboard access to a coach', () => {
    useXP.mockReturnValue({ user: { role: 'coach' } });
    const permissions = usePermissions();
    expect(permissions.canViewMADashboard).toBe(false);
  });
  
  test('should grant sponsor console access to a sponsor user', () => {
    useXP.mockReturnValue({ user: { role: 'sponsor' } });
    const permissions = usePermissions();
    expect(permissions.canAccessSponsorConsole).toBe(true);
  });

  test('should deny sponsor console access to a volunteer', () => {
    useXP.mockReturnValue({ user: { role: 'volunteer' } });
    const permissions = usePermissions();
    expect(permissions.canAccessSponsorConsole).toBe(false);
  });
});