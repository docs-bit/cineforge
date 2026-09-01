import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IdentityService } from '../../prisma/identity.service';

type AuthIdentity = { id: string; email?: string | null; user_metadata?: Record<string, unknown> };
type AuthResponse = { user?: AuthIdentity | null; session?: unknown; [key: string]: unknown };

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService, private identityService: IdentityService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
    this.supabase = createClient(supabaseUrl, supabaseKey, { auth: { autoRefreshToken: false, persistSession: false } });
  }

  async register(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) throw error;
    return this.attachWorkspace(data as AuthResponse);
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return this.attachWorkspace(data as AuthResponse);
  }

  async refresh(refreshToken: string) {
    const { data, error } = await this.supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (error) throw error;
    return this.attachWorkspace(data as AuthResponse);
  }

  async logout(accessToken: string) {
    const { error } = await this.supabase.auth.admin.signOut(accessToken);
    if (error) throw error;
    return { message: 'Logged out successfully' };
  }

  private async attachWorkspace(data: AuthResponse) {
    if (!data.user) return data;
    const profile = await this.identityService.ensureProfile(data.user);
    return { ...data, profile };
  }
}
