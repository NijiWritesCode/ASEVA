import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [business, setBusiness] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial session load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadUserDetails(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // 2. Auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadUserDetails(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setBusiness(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadUserDetails(userId) {
    try {
      // Load user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileData) setProfile(profileData);

      // Load active business membership
      const { data: memberData } = await supabase
        .from('business_members')
        .select('role, business:businesses(*)')
        .eq('user_id', userId)
        .eq('is_active', true)
        .limit(1)
        .maybeSingle();

      if (memberData) {
        setRole(memberData.role);
        setBusiness(memberData.business);
      }
    } catch (error) {
      console.error('Failed to load user business credentials:', error);
    } finally {
      setLoading(false);
    }
  }

  const signIn = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const demoSignIn = (demoRole = 'owner') => {
    const demoUser = { id: '00000000-0000-0000-0000-000000000099', email: 'director@asevaevents.com' };
    const demoProfile = { full_name: 'Folashade Adeleke', phone: '+234 800 000 2738' };
    const demoBusiness = { id: '00000000-0000-0000-0000-000000000001', name: 'ASEVA Luxury Event Atelier', currency: 'NGN' };

    setUser(demoUser);
    setProfile(demoProfile);
    setBusiness(demoBusiness);
    setRole(demoRole);
    setLoading(false);
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    setBusiness(null);
    setRole(null);
    return await supabase.auth.signOut();
  };

  const value = {
    user,
    profile,
    business,
    role,
    loading,
    isAuthenticated: !!user,
    isOwner: role === 'owner',
    isManager: role === 'owner' || role === 'manager',
    signIn,
    demoSignIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
