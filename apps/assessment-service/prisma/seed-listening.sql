-- ====================================================================
-- Seed: IELTS Tests into Assessment Service DB
-- ====================================================================

-- 1. Ensure IELTS test type exists
INSERT INTO assessment_db.english_test_types (id, name)
VALUES ('11111111-1111-1111-1111-111111111111', 'IELTS')
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- IELTS LISTENING - Simulation Test 1  
-- ====================================================================
DO $$
DECLARE
  v_test_id UUID;
  v_section_id UUID;
  v_passage_id UUID;
BEGIN
  -- Create test
  INSERT INTO assessment_db.tests (id, title, slug, status, duration_in_minutes, english_test_type_id, created_at, updated_at)
  VALUES (gen_random_uuid(), 'IELTS Listening - Simulation Test 1', 'ielts-listening-simulation-test-1', 'PUBLISHED', 30, '11111111-1111-1111-1111-111111111111', NOW(), NOW())
  RETURNING id INTO v_test_id;
  
  -- Test skill
  INSERT INTO assessment_db.test_skills (test_id, skill) VALUES (v_test_id, 'LISTENING');
  
  -- ═══════ SECTION 1 (Part 1): Short Stay Accommodation Q1-10 ═══════
  INSERT INTO assessment_db.sections (id, test_id, title, skill, order_index, media_url)
  VALUES (gen_random_uuid(), v_test_id, 'Part 1', 'LISTENING', 0, 'https://s4-media1.study4.com/media/simulation_ielts/sim_0101.mp3')
  RETURNING id INTO v_section_id;

  INSERT INTO assessment_db.passages (id, section_id, content, passage_order)
  VALUES (gen_random_uuid(), v_section_id, E'SHORT STAY ACCOMMODATION\n\nComplete the form below.\n\nFamily Name: Mackinlay\nFirst Name: (1) _____\nCountry of Origin: (2) _____\nDate of Arrival: (3) _____\nNumber of Tenants: (4) _____\nLength of Stay: 2 weeks\nPurpose of Visit: (5) _____\nType of Accommodation: (6) _____\nNumber of Bedrooms: one or two\nCar Parking: off-street and (7) _____\nGeneral Area: near the beach\nOther Requirements: near (8) _____\nName of Town: (9) _____\nClient''s Email: smac13@hotmail.com\nPrice Range: up to $ (10) _____ a week', 1)
  RETURNING id INTO v_passage_id;

  -- Q1-10 gap fill
  INSERT INTO assessment_db.questions (id, section_id, passage_id, test_id, question_type, question_text, content, answer, explanation, question_order) VALUES
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'First Name: _____', '{"text":"First Name: _____"}', '{"text":["Stuart"]}', 'The caller''s first name is Stuart.', 1),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'Country of Origin: _____', '{"text":"Country of Origin: _____"}', '{"text":["Canada"]}', 'The caller is from Canada.', 2),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'Date of Arrival: _____', '{"text":"Date of Arrival: _____"}', '{"text":["15 October","15th October","October 15"]}', 'Arriving on 15 October.', 3),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'Number of Tenants: _____', '{"text":"Number of Tenants: _____"}', '{"text":["4","four"]}', 'There are 4 tenants.', 4),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'Purpose of Visit: _____', '{"text":"Purpose of Visit: _____"}', '{"text":["holiday","a holiday"]}', 'The purpose of visit is a holiday.', 5),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'Type of Accommodation: _____', '{"text":"Type of Accommodation: _____"}', '{"text":["apartment","flat","a flat"]}', 'Looking for an apartment.', 6),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'Car Parking: off-street and _____', '{"text":"Car Parking: off-street and _____"}', '{"text":["covered","undercover"]}', 'They want covered parking.', 7),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'Other Requirements: near _____', '{"text":"Other Requirements: near _____"}', '{"text":["shops","shopping"]}', 'They want to be near shops.', 8),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'Name of Town: _____', '{"text":"Name of Town: _____"}', '{"text":["Dolphin Bay"]}', 'The town is called Dolphin Bay.', 9),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'Price Range: up to $ _____ a week', '{"text":"Price Range: up to $ _____ a week"}', '{"text":["350"]}', 'Budget is up to $350 a week.', 10);

  -- ═══════ SECTION 2 (Part 2): Club Information Q11-20 ═══════
  INSERT INTO assessment_db.sections (id, test_id, title, skill, order_index, media_url)
  VALUES (gen_random_uuid(), v_test_id, 'Part 2', 'LISTENING', 1, 'https://s4-media1.study4.com/media/simulation_ielts/sim_0102.mp3')
  RETURNING id INTO v_section_id;

  INSERT INTO assessment_db.passages (id, section_id, content, passage_order)
  VALUES (gen_random_uuid(), v_section_id, E'Club Information\n\nYou will hear a talk about a recreational club and its activities.', 1)
  RETURNING id INTO v_passage_id;

  -- Q11-14 MCQ
  INSERT INTO assessment_db.questions (id, section_id, passage_id, test_id, question_type, question_text, content, answer, explanation, question_order) VALUES
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'MULTIPLE_CHOICE', 'Refreshments will be served', '{"text":"Refreshments will be served","options":["at the front counter","in the lobby","at the back of the hall"]}', '{"correctIndex":2}', 'Refreshments are served at the back of the hall.', 11),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'MULTIPLE_CHOICE', 'Nick Noble advertised', '{"text":"Nick Noble advertised","options":["on the radio","on a billboard","in the newspaper"]}', '{"correctIndex":2}', 'Nick Noble advertised in the newspaper.', 12),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'MULTIPLE_CHOICE', 'The original number of founding members was about', '{"text":"The original number of founding members was about","options":["12","20","200"]}', '{"correctIndex":1}', 'About 20 founding members.', 13),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'MULTIPLE_CHOICE', 'The club provides activities primarily for reasonably fit', '{"text":"The club provides activities primarily for reasonably fit","options":["males up to 75","females with young children","males and females of any age"]}', '{"correctIndex":2}', 'The club serves males and females of any age.', 14);
  
  -- Q15-20 Gap fill (table completion)
  INSERT INTO assessment_db.questions (id, section_id, passage_id, test_id, question_type, question_text, content, answer, explanation, question_order) VALUES
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'Activity on Tuesday & Saturday', '{"text":"Activity: _____ | Days: Tuesday & Saturday | Duration: about 3-5 hours | Contact: coordinator"}', '{"text":["Bushwalking","Bush walking"]}', 'The activity on Tuesday & Saturday is Bushwalking.', 15),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'Activity on Thursday & Sunday', '{"text":"Activity: _____ | Days: Thursday & Sunday | Duration: up to 3 hours"}', '{"text":["Cycling","Bike riding"]}', 'The activity on Thursday & Sunday is Cycling.', 16),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'Contact person for cycling', '{"text":"Contact person for cycling: _____"}', '{"text":["Peter","Peter Wells"]}', 'The contact person for cycling is Peter.', 17),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'Duration for Wanderers on Sunday', '{"text":"Wanderers | Sunday | Duration: _____"}', '{"text":["all day","6 hours"]}', 'Wanderers go for all day on Sunday.', 18),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'Weekend activity', '{"text":"Activity: _____ | Days: Saturday & Sunday | Duration: all weekend"}', '{"text":["Camping"]}', 'Camping is on weekends.', 19),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'Contact person for camping', '{"text":"Contact person for camping/weekends: _____"}', '{"text":["Gina"]}', 'Gina is the contact person for camping.', 20);

  -- ═══════ SECTION 3 (Part 3): Globalisation Q21-26 ═══════
  INSERT INTO assessment_db.sections (id, test_id, title, skill, order_index, media_url)
  VALUES (gen_random_uuid(), v_test_id, 'Part 3', 'LISTENING', 2, 'https://s4-media1.study4.com/media/simulation_ielts/sim_0103.mp3')
  RETURNING id INTO v_section_id;

  INSERT INTO assessment_db.passages (id, section_id, content, passage_order)
  VALUES (gen_random_uuid(), v_section_id, E'Globalisation and Educational Change\n\nGEC 692 New Code: (21) _____\nAims: Analysis of educational problems arising from globalisation\nChance to research and (22) _____ progress of educational change\nInvestigate influence of culture and (23) _____ on education\nArgue advantages and disadvantages of reorganisation of public education\nConsider the (24) _____ of globalisation on diversity of national curricula\nAssignment #1 = power point presentation (ungraded) + (25) _____ (30%)\nAssignment #2 = take part in (26) _____ (20%) + essay (50%)', 1)
  RETURNING id INTO v_passage_id;

  INSERT INTO assessment_db.questions (id, section_id, passage_id, test_id, question_type, question_text, content, answer, explanation, question_order) VALUES
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'GEC 692 New Code', '{"text":"GEC 692 New Code: _____"}', '{"text":["GEC 862","862"]}', 'The new course code is GEC 862.', 21),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'Research and _____ progress', '{"text":"Chance to research and _____ progress of educational change"}', '{"text":["monitor","evaluate"]}', 'Students research and monitor progress.', 22),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'Influence of culture and _____', '{"text":"Investigate influence of culture and _____ on education"}', '{"text":["language","politics"]}', 'Investigate influence of culture and language.', 23),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'The _____ of globalisation', '{"text":"Consider the _____ of globalisation on diversity of national curricula"}', '{"text":["impact","effect","effects"]}', 'Consider the impact of globalisation.', 24),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'Assignment #1 presentation +', '{"text":"Assignment #1 = presentation (ungraded) + _____ (30%)"}', '{"text":["written report","report"]}', 'Assignment #1 includes a written report.', 25),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'Assignment #2 take part in', '{"text":"Assignment #2 = take part in _____ (20%) + essay (50%)"}', '{"text":["debate","group debate","class debate"]}', 'Assignment #2 includes a debate.', 26);

  -- ═══════ SECTION 4 (Part 4): Vaccination Q31-37 ═══════
  INSERT INTO assessment_db.sections (id, test_id, title, skill, order_index, media_url)
  VALUES (gen_random_uuid(), v_test_id, 'Part 4', 'LISTENING', 3, 'https://s4-media1.study4.com/media/simulation_ielts/sim_0104.mp3')
  RETURNING id INTO v_section_id;

  INSERT INTO assessment_db.passages (id, section_id, content, passage_order)
  VALUES (gen_random_uuid(), v_section_id, E'Vaccination\n\nEvery day the human body is fighting off (31) _____ by destructive pathogens. A person in good health has natural protection in the form of an immune system which works best against familiar microorganisms which may have been encountered during a previous (32) _____ or passed on by the mother before or after birth.\n\nVaccination is a way to cause (33) _____ immunisation by introducing a small amount of pathogen into the body — just enough for the body''s (34) _____ to react by making antibodies. Passive immunisation can be used as a way of treating someone who is already sick. Proteins from animal (35) _____ are introduced into the patient to give him the necessary antibodies to fight the disease.\n\nDr. Edward Jenner observed that people who had suffered and recovered from a serious disease called smallpox did not get it again. He also noted that victims of a milder disease, cowpox, which they caught from (36) _____, were immune to smallpox. He carried out a successful (37) _____ by deliberately giving a child cowpox in order to make him immune to smallpox.', 1)
  RETURNING id INTO v_passage_id;

  INSERT INTO assessment_db.questions (id, section_id, passage_id, test_id, question_type, question_text, content, answer, explanation, question_order) VALUES
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'Fighting off _____ by pathogens', '{"text":"Every day the human body is fighting off _____ by destructive pathogens."}', '{"text":["infection","infections","disease"]}', 'The body fights off infection.', 31),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'During a previous _____', '{"text":"encountered during a previous _____ or passed on by the mother"}', '{"text":["illness","infection"]}', 'Encountered during a previous illness.', 32),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'Cause _____ immunisation', '{"text":"Vaccination is a way to cause _____ immunisation"}', '{"text":["active"]}', 'Vaccination causes active immunisation.', 33),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'Body''s _____ to react', '{"text":"just enough for the body''s _____ to react by making antibodies"}', '{"text":["defences","defence system","immune system"]}', 'The body''s defences react.', 34),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'Proteins from animal _____', '{"text":"Proteins from animal _____ are introduced into the patient"}', '{"text":["blood"]}', 'Proteins from animal blood.', 35),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'Caught cowpox from _____', '{"text":"cowpox, which they caught from _____"}', '{"text":["cattle","cows"]}', 'They caught cowpox from cattle.', 36),
  (gen_random_uuid(), v_section_id, v_passage_id, v_test_id, 'GAP_FILL', 'A successful _____', '{"text":"He carried out a successful _____ by deliberately giving a child cowpox"}', '{"text":["experiment","trial"]}', 'Jenner carried out a successful experiment.', 37);

  RAISE NOTICE 'Listening test created with ID: %', v_test_id;
END $$;
