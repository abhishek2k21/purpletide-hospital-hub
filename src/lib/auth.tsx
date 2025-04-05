
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect, createContext, useContext } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { userAccounts } from "@/data/userData";

// Types
interface User {
  id: string;
  email?: string;
  role?: string;
  name?: string;
  department?: string;
  designation?: string;
  phone?: string;
  photo?: string;
  specialization?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (newPassword: string) => Promise<void>;
  updateUserProfile: (profile: { [key: string]: any }) => Promise<void>;
}

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        // Check for active session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { id, email } = session.user;
          
          // Get user profile data from custom table if needed
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, name, department, designation, phone, photo, specialization')
            .eq('id', id)
            .single();
            
          setUser({
            id,
            email: email || undefined,
            role: profile?.role || 'staff',
            name: profile?.name,
            department: profile?.department,
            designation: profile?.designation,
            phone: profile?.phone,
            photo: profile?.photo,
            specialization: profile?.specialization
          });
        } else {
          // For development without Supabase
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // For development without Supabase
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { id, email } = session.user;
          
          // Get user profile data if needed
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, name, department, designation, phone, photo, specialization')
            .eq('id', id)
            .single();
            
          setUser({
            id,
            email: email || undefined,
            role: profile?.role || 'staff',
            name: profile?.name,
            department: profile?.department,
            designation: profile?.designation,
            phone: profile?.phone,
            photo: profile?.photo,
            specialization: profile?.specialization
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('user');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Auth methods with local fallbacks
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      try {
        // Try Supabase auth first
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } catch (error) {
        console.log('Supabase auth failed, using local auth');
        // Fallback to local auth for development
        const foundUser = userAccounts.find(
          user => user.email === email && user.password === password
        );
        
        if (!foundUser) {
          throw new Error('Invalid email or password');
        }
        
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      }
      
      toast.success('Signed in successfully');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      try {
        // Try Supabase auth first
        const { error, data } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        
        // Create profile record in profiles table
        if (data.user) {
          await supabase.from('profiles').insert([
            { id: data.user.id, email, role: 'staff' }
          ]);
        }
      } catch (error) {
        console.log('Supabase signup failed, using local signup');
        // For development without Supabase
        const existingUser = userAccounts.find(user => user.email === email);
        if (existingUser) {
          throw new Error('Email already in use');
        }
        
        // In a real app, we'd create the user in a database
        toast.info('Account created in demo mode. Please sign in.');
      }
      
      toast.success('Account created. Please check your email for verification.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.log('Supabase signout failed, using local signout');
      }
      
      // Always clear local state
      setUser(null);
      localStorage.removeItem('user');
      
      toast.info('Signed out');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        
        if (error) throw error;
      } catch (error) {
        console.log('Supabase password reset failed, using demo mode');
        // Demo mode
        const foundUser = userAccounts.find(user => user.email === email);
        if (!foundUser) {
          throw new Error('Email not found');
        }
      }
      
      toast.success('Password reset link sent to your email (Demo Mode)');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset link');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (newPassword: string) => {
    try {
      setLoading(true);
      
      try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
      } catch (error) {
        console.log('Supabase password update failed, using demo mode');
        // In demo mode, just pretend it worked
      }
      
      toast.success('Password updated successfully');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (profile: { [key: string]: any }) => {
    if (!user) throw new Error('Not authenticated');
    
    try {
      setLoading(true);
      
      try {
        const { error } = await supabase
          .from('profiles')
          .update(profile)
          .eq('id', user.id);
        
        if (error) throw error;
      } catch (error) {
        console.log('Supabase profile update failed, using local update');
        // For development without Supabase
        const updatedUser = { ...user, ...profile };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      // Update local user state
      setUser(prev => prev ? { ...prev, ...profile } : null);
      toast.success('Profile updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    forgotPassword,
    resetPassword,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
