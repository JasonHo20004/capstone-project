"""Database stage: connect to PostgreSQL and insert parsed test data."""

from __future__ import annotations

import logging
import re
from urllib.parse import urlparse

import psycopg2
import psycopg2.extensions

from models import TestData


def _connect_db(db_url: str) -> psycopg2.extensions.connection:
    """Connect to PostgreSQL, handling Prisma-style URL params (schema, pgbouncer).

    Prisma encodes the target schema as ``?schema=<name>`` and adds
    ``pgbouncer=true`` for PgBouncer mode.  psycopg2 does not understand
    these parameters, so we strip them and set ``search_path`` after
    connecting.

    Uses ``urllib.parse.urlparse`` for component extraction so that
    special characters in passwords (e.g. ``@``) are handled correctly.
    """
    schema_match = re.search(r"[?&]schema=([^&]+)", db_url)
    schema_name = schema_match.group(1) if schema_match else None

    clean_url = re.sub(r"[?&]pgbouncer=[^&]*", "", db_url)
    clean_url = re.sub(r"[?&]schema=[^&]*", "", clean_url)
    clean_url = re.sub(r"\?&", "?", clean_url)
    clean_url = re.sub(r"[?&]$", "", clean_url)

    parsed = urlparse(clean_url)
    conn = psycopg2.connect(
        host=parsed.hostname,
        port=parsed.port or 5432,
        dbname=(parsed.path or "/postgres").lstrip("/") or "postgres",
        user=parsed.username,
        password=parsed.password,
    )
    if schema_name:
        with conn.cursor() as cur:
            cur.execute("SET search_path TO %s", (schema_name,))
        conn.commit()
        logging.info("DB search_path set to schema: %s", schema_name)
    return conn


def insert_test_data(
    conn: psycopg2.extensions.connection,
    test_data: TestData,
    english_test_type_id: str,
) -> str:
    """Insert a fully-parsed TestData into the database and return the new test UUID.

    Also populates:
    - ``test_skills``    — one row per unique SkillType found across sections.
    - ``passage_order``  — 1-based position of each passage within its section.
    - ``question_order`` — 1-based global position of each question within the test.
    """
    with conn.cursor() as cur:
        # --- Test ---
        cur.execute(
            """
            INSERT INTO tests (title, english_test_type_id)
            VALUES (%s, %s)
            RETURNING id
            """,
            (test_data.title, english_test_type_id),
        )
        test_id = cur.fetchone()[0]
        logging.info("Inserted test '%s' → id=%s", test_data.title, test_id)

        # --- TestSkill (one row per unique skill across all sections) ---
        unique_skills = {sec.skill.value for sec in test_data.sections if sec.skill}
        for skill_val in sorted(unique_skills):
            cur.execute(
                """
                INSERT INTO test_skills (test_id, skill)
                VALUES (%s, %s)
                ON CONFLICT DO NOTHING
                """,
                (test_id, skill_val),
            )
        logging.info("Inserted test_skills: %s", sorted(unique_skills))

        question_order = 0

        for section in test_data.sections:
            # --- Section ---
            total_questions = sum(len(p.questions) for p in section.passages)
            cur.execute(
                """
                INSERT INTO sections (test_id, title, skill, total_questions)
                VALUES (%s, %s, %s, %s)
                RETURNING id
                """,
                (test_id, section.title, section.skill.value, total_questions or None),
            )
            section_id = cur.fetchone()[0]
            logging.info(
                "Inserted section '%s' (%d questions) → id=%s",
                section.title,
                total_questions,
                section_id,
            )

            for passage_order, passage in enumerate(section.passages, start=1):
                passage_id = None
                if passage.content:
                    # --- Passage ---
                    cur.execute(
                        """
                        INSERT INTO passages (section_id, content, passage_order)
                        VALUES (%s, %s, %s)
                        RETURNING id
                        """,
                        (section_id, passage.content, passage_order),
                    )
                    passage_id = cur.fetchone()[0]
                    logging.info("Inserted passage %d → id=%s", passage_order, passage_id)

                for question in passage.questions:
                    question_order += 1
                    # --- Question ---
                    cur.execute(
                        """
                        INSERT INTO questions (
                            test_id,
                            section_id,
                            passage_id,
                            question_text,
                            question_type,
                            options,
                            correct_answer_index,
                            word_limit,
                            correct_answer,
                            explanation,
                            question_order
                        )
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        RETURNING id
                        """,
                        (
                            test_id,
                            section_id,
                            passage_id,
                            question.questionText,
                            question.questionType.value,
                            question.options,
                            question.correctAnswerIndex,
                            question.wordLimit,
                            question.correctAnswer,
                            question.explanation,
                            question_order,
                        ),
                    )
                    question_id = cur.fetchone()[0]
                    logging.debug("Inserted question #%d → id=%s", question_order, question_id)

        logging.info(
            "Inserted %d question(s) across %d section(s) for test_id=%s",
            question_order,
            len(test_data.sections),
            test_id,
        )

    return str(test_id)
