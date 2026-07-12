CREATE TYPE refresh_token_status AS ENUM (
  'ACTIVE',
  'ROTATED',
  'REVOKED'
);

CREATE TABLE IF NOT EXISTS auth_sessions (
  jti UUID PRIMARY KEY,
  user_id INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  replaced_by UUID UNIQUE,
  token_status refresh_token_status NOT NULL DEFAULT 'ACTIVE',
  CONSTRAINT fk_auth_sessions_user_id FOREIGN KEY(user_id)
  REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_auth_sessions_jti FOREIGN KEY(replaced_by) 
  REFERENCES auth_sessions(jti) ON DELETE CASCADE
);