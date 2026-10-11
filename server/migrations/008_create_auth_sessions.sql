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
  session_status session_status NOT NULL DEFAULT 'ACTIVE',
  revoked_at TIMESTAMPTZ,  
  revocation_reason session_revocation_reason,
  client_name TEXT,
  operating_system TEXT,
  device_type TEXT,
  user_agent TEXT,
  initial_ip INET,
  last_ip INET,
  CONSTRAINT fk_auth_sessions_user_id FOREIGN KEY(user_id)
  REFERENCES users(id),
  CONSTRAINT check_status_and_revocation_consistency CHECK (
    CASE 
      WHEN session_status = 'ACTIVE' THEN 
        revoked_at IS NULL 
        AND revocation_reason IS NULL
      
      WHEN session_status = 'REVOKED' THEN
        revoked_at IS NOT NULL 
        AND revocation_reason IS NOT NULL

      ELSE FALSE
    END 
  ),
  CONSTRAINT valid_expiration CHECK (expires_at > created_at),
  CONSTRAINT last_activity_and_created_at CHECK (last_activity_at >= created_at),
  CONSTRAINT revoked_at_validity CHECK (revoked_at IS NULL OR revoked_at >= created_at)
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  jti UUID PRIMARY KEY,
  session_id UUID NOT NULL, 
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  token_status refresh_token_status NOT NULL DEFAULT 'ACTIVE',
  replaced_by UUID UNIQUE,
  rotated_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  CONSTRAINT fk_refresh_tokens_session_id FOREIGN KEY(session_id) 
  REFERENCES auth_sessions(session_id) ON DELETE CASCADE,
  CONSTRAINT fk_refresh_tokens_jti FOREIGN KEY(replaced_by) 
  REFERENCES refresh_tokens(jti) DEFERRABLE INITIALLY DEFERRED,
  CONSTRAINT check_status_and_rotation_consistency CHECK (
    CASE 

      WHEN token_status = 'ACTIVE' THEN
        replaced_by IS NULL 
        AND rotated_at IS NULL 
        AND revoked_at IS NULL

      WHEN token_status = 'ROTATED' THEN 
        replaced_by IS NOT NULL 
        AND rotated_at IS NOT NULL 
        AND revoked_at IS NULL

      WHEN token_status = 'REVOKED' THEN 
        replaced_by IS NULL 
        AND rotated_at IS NULL 
        AND revoked_at IS NOT NULL

      ELSE FALSE
    END
  ),
  CONSTRAINT valid_expiration CHECK (expires_at > created_at),
  CONSTRAINT rotated_at_validity CHECK (rotated_at IS NULL OR rotated_at >= created_at),
  CONSTRAINT revoked_at_validity CHECK (revoked_at IS NULL OR revoked_at >= created_at)
);