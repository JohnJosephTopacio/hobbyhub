CREATE TYPE refresh_token_status AS ENUM (
  'ACTIVE',
  'ROTATED',
  'REVOKED'
);

CREATE TYPE session_status AS ENUM (
  'ACTIVE',
  'REVOKED' 
);

CREATE TYPE session_revocation_reason AS ENUM (
  'LOGOUT',
  'PASSWORD_CHANGE',
  'REUSE_DETECTED',
  'ADMIN'
);


CREATE TABLE IF NOT EXISTS auth_sessions (
  session_id UUID PRIMARY KEY,
  user_id INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
  expires_at TIMESTAMPTZ NOT NULL,
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status session_status NOT NULL DEFAULT 'ACTIVE',
  revoked_at TIMESTAMPTZ,  
  revocation_reason session_revocation_reason,
  client_type TEXT,
  client_name TEXT,
  operating_system TEXT,
  device_name TEXT,
  initial_ip INET,
  last_ip INET,
  user_agent TEXT,
  CONSTRAINT fk_auth_sessions_user_id FOREIGN KEY(user_id)
  REFERENCES users(id) 
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  jti UUID PRIMARY KEY,
  session_id UUID NOT NULL, 
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  token_status refresh_token_status NOT NULL DEFAULT 'ACTIVE',
  replaced_by UUID UNIQUE,
  rotated_at TIMESTAMPTZ,
  CONSTRAINT fk_refresh_tokens_session_id FOREIGN KEY(session_id) 
  REFERENCES auth_sessions(session_id) ON DELETE CASCADE,
  CONSTRAINT fk_refresh_tokens_jti FOREIGN KEY(replaced_by) 
  REFERENCES refresh_tokens(jti) 
);