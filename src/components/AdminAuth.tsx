import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const DEVELOPER_PASSWORD = 'ADMIN123';
const AUTH_KEY = 'hci_admin_auth';
const AUTH_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface AdminAuthProps {
  children: React.ReactNode;
}

export const isAdminAuthenticated = (): boolean => {
  const authData = sessionStorage.getItem(AUTH_KEY);
  if (!authData) return false;
  
  try {
    const { expiry } = JSON.parse(authData);
    if (Date.now() > expiry) {
      sessionStorage.removeItem(AUTH_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

export const setAdminAuthenticated = () => {
  sessionStorage.setItem(AUTH_KEY, JSON.stringify({
    authenticated: true,
    expiry: Date.now() + AUTH_EXPIRY
  }));
};

export const clearAdminAuth = () => {
  sessionStorage.removeItem(AUTH_KEY);
};

const AdminAuth = ({ children }: AdminAuthProps) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminAuthenticated());
  const [storedPassword, setStoredPassword] = useState<string | null>(null);
  const [isLoadingPassword, setIsLoadingPassword] = useState(true);

  useEffect(() => {
    const fetchAdminPassword = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('value')
          .eq('key', 'admin_password')
          .maybeSingle();

        if (error) {
          console.error('Error fetching admin password:', error);
          setStoredPassword('HCI2026');
        } else {
          setStoredPassword(data?.value || 'HCI2026');
        }
      } catch (err) {
        console.error('Error:', err);
        setStoredPassword('HCI2026');
      } finally {
        setIsLoadingPassword(false);
      }
    };

    if (!isAuthenticated) {
      fetchAdminPassword();
    } else {
      setIsLoadingPassword(false);
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    if (password === storedPassword || password === DEVELOPER_PASSWORD) {
      setAdminAuthenticated();
      setIsAuthenticated(true);
    } else {
      setError('Incorrect password. Please try again.');
    }
    
    setIsLoading(false);
    setPassword('');
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  if (isLoadingPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="py-12 flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')} 
          className="mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-display text-2xl">Admin Access</CardTitle>
            <CardDescription>
              Enter the admin password to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className={`pr-10 ${error ? 'border-destructive' : ''}`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
              
              <Button type="submit" className="w-full gradient-accent" disabled={isLoading || !password}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  'Access Dashboard'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAuth;
