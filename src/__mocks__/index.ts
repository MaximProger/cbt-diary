export const TEST_FIELD_VALUE = 'Test';

export const mockUser = {
  id: 'user-id-123',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'test@example.com',
  email_confirmed_at: '2025-01-01T00:00:00.000Z',
  phone: '',
  confirmation_sent_at: '2025-01-01T00:00:00.000Z',
  confirmed_at: '2025-01-01T00:00:00.000Z',
  recovery_sent_at: '2025-01-01T00:00:00.000Z',
  last_sign_in_at: '2025-01-01T00:00:00.000Z',
  app_metadata: {
    provider: 'email',
    providers: ['email'],
  },
  user_metadata: {
    email: 'test@example.com',
    email_verified: true,
    phone_verified: false,
    sub: 'user-id-123',
  },
  identities: [
    {
      identity_id: 'identity-id-123',
      id: 'user-id-123',
      user_id: 'user-id-123',
      identity_data: {
        email: 'test@example.com',
        email_verified: true,
        phone_verified: false,
        sub: 'user-id-123',
      },
      provider: 'email',
      last_sign_in_at: '2025-01-01T00:00:00.000Z',
      created_at: '2025-01-01T00:00:00.000Z',
      updated_at: '2025-01-01T00:00:00.000Z',
      email: 'test@example.com',
    },
  ],
  created_at: '2025-01-01T00:00:00.000Z',
  updated_at: '2025-01-01T00:00:00.000Z',
  is_anonymous: false,
};

export const mockEntry = {
  created_at: expect.any(String),
  created_by: mockUser.id,
  worst_case: TEST_FIELD_VALUE,
  worst_consequences: TEST_FIELD_VALUE,
  what_can_i_do: TEST_FIELD_VALUE,
  how_will_i_cope: TEST_FIELD_VALUE,
};

export const mockSession = {
  access_token:
    'eyJhbGciOiJIUzI1NiIsImtpZCI6IkY4MHFFT1pIYTNQbkVOLzAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL25vdnpkbmN1cmRpanBzZGJ1eGpvLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI0NGIyMDhiZC01Yzc4LTRlMDUtYWJhZC0yOWYzMzI3ZjkyNWYiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzUwOTM2MTkyLCJpYXQiOjE3NTA5MzI1OTIsImVtYWlsIjoibWFrc2lta29zaG1hbjA5MEBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoibWFrc2lta29zaG1hbjA5MEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiI0NGIyMDhiZC01Yzc4LTRlMDUtYWJhZC0yOWYzMzI3ZjkyNWYifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJvdHAiLCJ0aW1lc3RhbXAiOjE3NTA5MjEzNzJ9XSwic2Vzc2lvbl9pZCI6IjNiMmE4NmZjLTZmZWYtNGJmZi1iYWUzLWI0ZmYzNTdmY2QwNyIsImlzX2Fub255bW91cyI6ZmFsc2V9.Emk_l536wLMypGtqbLDtWRk8sU7RZaChiuxa6VgOJJA',
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: 1750936192,
  refresh_token: 'vi7qnd4vnpp4',
  user: mockUser,
};
