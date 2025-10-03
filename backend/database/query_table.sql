-- =============================================================================
-- Drop existing objects to ensure a clean slate
-- =============================================================================
-- Drop tables in reverse order of creation to handle dependencies
DROP TABLE IF EXISTS user_activities CASCADE;
DROP TABLE IF EXISTS user_answers CASCADE;
DROP TABLE IF EXISTS user_lessons CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS passages CASCADE;
DROP TABLE IF EXISTS sections CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS practice_sessions CASCADE;
DROP TABLE IF EXISTS subscription_contracts CASCADE;
DROP TABLE IF EXISTS deck_tags CASCADE;
DROP TABLE IF EXISTS flashcards CASCADE;
DROP TABLE IF EXISTS flashcard_decks CASCADE;
DROP TABLE IF EXISTS media_assets CASCADE;   
DROP TABLE IF EXISTS score_conversions CASCADE;
DROP TABLE IF EXISTS test_skills CASCADE;
DROP TABLE IF EXISTS tests CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS english_test_types CASCADE;
DROP TABLE IF EXISTS user_notifications CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS notification_types CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;
DROP TABLE IF EXISTS administrator_profiles CASCADE;
DROP TABLE IF EXISTS course_seller_profiles CASCADE;
DROP TABLE IF EXISTS topup_orders CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;


-- Drop ENUM types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS transaction_type CASCADE;
DROP TYPE IF EXISTS transaction_status CASCADE;
DROP TYPE IF EXISTS course_status CASCADE;
DROP TYPE IF EXISTS course_level CASCADE;
DROP TYPE IF EXISTS session_status CASCADE;
DROP TYPE IF EXISTS question_type CASCADE;
DROP TYPE IF EXISTS skill_type CASCADE;
DROP TYPE IF EXISTS media_type CASCADE;

-- =============================================================================
-- Define custom ENUM types with snake_case convention
-- =============================================================================
CREATE TYPE USER_ROLE AS ENUM ('ADMINISTRATOR', 'COURSESELLER');
CREATE TYPE PAYMENT_METHOD AS ENUM ('MOMO', 'ZALOPAY', 'BANKING', 'APPLEPAY');
CREATE TYPE ORDER_STATUS AS ENUM ('PENDING', 'SUCCESS', 'FAILED');
CREATE TYPE TRANSACTION_TYPE AS ENUM ('DEPOSIT', 'PAYMENT', 'MONTHLYFEE', 'WITHDRAW');
CREATE TYPE TRANSACTION_STATUS AS ENUM ('PENDING', 'SUCCESS', 'FAILED');
CREATE TYPE COURSE_STATUS AS ENUM ('PENDING', 'ACTIVE', 'REFUSE', 'INACTIVE', 'DELETE');
CREATE TYPE COURSE_LEVEL AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');
CREATE TYPE SESSION_STATUS AS ENUM ('ONGOING', 'COMPLETED');
CREATE TYPE QUESTION_TYPE AS ENUM ('MULTIPLE_CHOICE', 'ESSAY', 'FILL_IN_THE_BLANK');
CREATE TYPE SKILL_TYPE AS ENUM ('READING', 'LISTENING', 'WRITING', 'SPEAKING');
CREATE TYPE MEDIA_TYPE AS ENUM ('AUDIO', 'IMAGE', 'VIDEO');

-- =============================================================================
-- Core Tables (Level 0 - No dependencies)
-- =============================================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  profile_picture VARCHAR(255),
  date_of_birth DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  english_level VARCHAR(100),
  learning_goals TEXT[],
  role user_role NOT NULL
);

CREATE TABLE notification_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE english_test_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL
);

CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  max_courses INT NOT NULL CHECK (max_courses >= 0),
  monthly_fee NUMERIC(10, 2) NOT NULL CHECK (monthly_fee >= 0)
);

-- =============================================================================
-- Level 1 Tables (Depend on Core Tables)
-- =============================================================================
CREATE TABLE course_seller_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certification TEXT[],
  expertise TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE administrator_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  allowance NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  seen BOOLEAN DEFAULT FALSE,
  notification_type_id UUID NOT NULL REFERENCES notification_types(id) ON DELETE CASCADE
);

CREATE TABLE tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  course_level course_level,
  duration_in_minutes INT CHECK (duration_in_minutes > 0),
  total_score FLOAT,
  passing_score FLOAT,
  english_test_type_id UUID NOT NULL REFERENCES english_test_types(id)
);

CREATE TABLE flashcard_decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  description TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE topup_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  real_money NUMERIC(12, 2) NOT NULL CHECK (real_money > 0),
  real_amount NUMERIC(12, 2),
  currency VARCHAR(10) DEFAULT 'VND',
  payment_method payment_method NOT NULL,
  status order_status NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE score_conversions(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  english_test_type_id UUID NOT NULL REFERENCES english_test_types(id),
  skill skill_type NOT NULL,
  raw_score INT NOT NULL,
  scaled_score FLOAT NOT NULL
);

-- =============================================================================
-- Level 2 Tables (Depend on Level 1)
-- =============================================================================
CREATE TABLE user_notifications (
  notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (notification_id, user_id)
);

CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  course_level course_level,
  -- course_seller_id UUID NOT NULL REFERENCES course_seller_profiles(id),
  course_seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  final_test_id UUID REFERENCES tests(id) ON DELETE SET NULL,
  rating FLOAT CHECK (rating >= 0 AND rating <= 5),
  status course_status DEFAULT 'PENDING'
);

CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  --audio_url TEXT,
  --image_urls TEXT[],
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  skill skill_type NOT NULL,
  duration_in_seconds FLOAT CHECK (duration_in_seconds > 0),
  total_questions INT,
  total_score FLOAT
);

CREATE TABLE passages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  passage_order INT, 
  UNIQUE (section_id, passage_order)
);




CREATE TABLE test_skills (
  test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  skill skill_type NOT NULL,
  PRIMARY KEY (test_id, skill)
);

CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  front_content TEXT NOT NULL,
  back_content TEXT NOT NULL,
  example_sentence TEXT,
  audio_url TEXT,
  deck_id UUID NOT NULL REFERENCES flashcard_decks(id) ON DELETE CASCADE
);

CREATE TABLE deck_tags (
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  deck_id UUID NOT NULL REFERENCES flashcard_decks(id) ON DELETE CASCADE,
  PRIMARY KEY (tag_id, deck_id)
);

CREATE TABLE practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  selected_sections TEXT[],
  status session_status NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE subscription_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_seller_id UUID NOT NULL REFERENCES users(id),
  status BOOLEAN DEFAULT TRUE,
  subscription_plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- =============================================================================
-- Level 3 Tables (Depend on Level 2)
-- =============================================================================
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  description TEXT,
  duration_in_seconds FLOAT CHECK (duration_in_seconds > 0),
  video_url TEXT,
  lesson_order INT,
  materials TEXT[],
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_type MEDIA_TYPE NOT NULL,
  asset_url TEXT NOT NULL UNIQUE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  description TEXT
);

CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  question_text TEXT,
  image_url TEXT,
  question_type question_type NOT NULL,
  options TEXT[],
  correct_answer_index INT,
  word_limit INT,
  correct_answer TEXT,
  passage_id UUID NOT NULL REFERENCES passages(id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
  CONSTRAINT proper_question_fields CHECK (
    (question_type = 'MULTIPLE_CHOICE' AND options IS NOT NULL AND correct_answer_index IS NOT NULL) OR
    (question_type = 'ESSAY' AND word_limit IS NOT NULL) OR
    (question_type = 'FILL_IN_THE_BLANK' AND correct_answer IS NOT NULL)
  )
);



CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  score FLOAT NOT NULL CHECK (score >= 0 AND score <= 5),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, course_id)
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount NUMERIC(12, 2) NOT NULL,
  status transaction_status NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  description TEXT,
  wallet_id UUID NOT NULL REFERENCES wallets(id),
  transaction_type transaction_type NOT NULL,
  topup_order_id UUID REFERENCES topup_orders(id),
  subscription_contract_id UUID REFERENCES subscription_contracts(id),
  CONSTRAINT chk_transaction_source CHECK (
    (topup_order_id IS NOT NULL AND subscription_contract_id IS NULL) OR
    (topup_order_id IS NULL AND subscription_contract_id IS NOT NULL)
  )
);

-- =============================================================================
-- Level 4 Tables (Depend on Level 3)
-- =============================================================================
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE
);

CREATE TABLE user_lessons (
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (lesson_id, user_id)
);

CREATE TABLE user_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_session_id UUID NOT NULL REFERENCES practice_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_text TEXT,
  selected_option_index INT,
  is_correct BOOLEAN,
  CONSTRAINT chk_answer_provided CHECK (answer_text IS NOT NULL OR selected_option_index IS NOT NULL)
);

CREATE TABLE user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  transaction_id UUID NOT NULL REFERENCES transactions(id),
  course_id UUID NOT NULL REFERENCES courses(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);