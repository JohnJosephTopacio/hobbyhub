CREATE UNIQUE INDEX IF NOT EXISTS uq_one_active_token_per_session 
ON refresh_tokens(session_id) 
WHERE token_status = 'ACTIVE';

CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id
ON auth_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_session_id 
ON refresh_tokens(session_id);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires_at 
ON auth_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at 
ON refresh_tokens(expires_at);