import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ctkdsjhekalfxmslydcz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0a2Rzamhla2FsZnhtc2x5ZGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MzMzMTUsImV4cCI6MjA2ODAwOTMxNX0.Lwh08t7_usZQURzS8Uq6qi6fx8p5LeEz3Hv2gfC0noA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
