import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const { user, isAuthenticated, setAuth, logout, setLoading } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onMutate: () => setLoading(true),
    onSuccess: (response) => {
      setAuth(response.data.data);
      queryClient.invalidateQueries(['profile']);
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('Login failed:', error.response?.data?.error);
    },
    onSettled: () => setLoading(false)
  });

  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onMutate: () => setLoading(true),
    onSuccess: (response) => {
      setAuth(response.data.data);
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('Registration failed:', error.response?.data?.error);
    },
    onSettled: () => setLoading(false)
  });

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: authAPI.getMe,
    enabled: isAuthenticated,
    retry: false,
    onError: () => logout()
  });

  const updateProfileMutation = useMutation({
    mutationFn: authAPI.updateProfile,
    onMutate: () => setLoading(true),
    onSuccess: (response) => {
      const updatedUser = response.data.data.user;
      setAuth({
        token: useAuthStore.getState().token,
        user: updatedUser
      });
      queryClient.setQueryData(['profile'], response.data);
    },
    onError: (error) => {
      console.error('Profile update failed:', error.response?.data?.error);
    },
    onSettled: () => setLoading(false)
  });

  useEffect(() => {
    if (isAuthenticated && !user && profileQuery.data?.data?.user) {
      setAuth({
        token: useAuthStore.getState().token,
        user: profileQuery.data.data.user
      });
    }
  }, [isAuthenticated, user, profileQuery.data, setAuth]);

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate('/login');
  };

  return {
    user,
    isAuthenticated,
    isLoading: useAuthStore(state => state.isLoading),
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: handleLogout,
    profile: profileQuery.data?.data?.user,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdateProfileLoading: updateProfileMutation.isLoading,
    updateProfileError: updateProfileMutation.error,
    isLoginLoading: loginMutation.isLoading,
    isRegisterLoading: registerMutation.isLoading,
    loginError: loginMutation.error,
    registerError: registerMutation.error
  };
};