"""Import IELTS AI-generated dataset into the project database.

Reads JSON files from the ``ielts-ai-dataset`` repository and converts them
into the project's ``TestData`` schema, then optionally inserts into Postgres.

Usage:
    # Dry-run — print JSON to stdout
    python import_dataset.py ../ielts-ai-dataset/synthetic_official_mocks/reading/ielts_reading_academic_001.json --dry-run

    # Batch — all JSON files in a directory
    python import_dataset.py ../ielts-ai-dataset/practice_drills/reading/ --dry-run

    # Insert into DB
    python import_dataset.py ../ielts-ai-dataset/synthetic_official_mocks/reading/ --english-test-type-id <uuid>
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv

load_dotenv()

sys.path.insert(0, str(Path(__file__).resolve().parent))

from models import Passage, Question, QuestionType, Section, SkillType, TestData
from stages.db import _connect_db, insert_test_data

# ---------------------------------------------------------------------------
# Question type mapping: dataset → project enum
# ---------------------------------------------------------------------------

_QUESTION_TYPE_MAP: Dict[str, QuestionType] = {
    "true-false-not-given": QuestionType.TRUE_FALSE_NOT_GIVEN,
    "yes-no-not-given": QuestionType.TRUE_FALSE_NOT_GIVEN,
    "multiple-choice": QuestionType.MULTIPLE_CHOICE,
    "matching-headings": QuestionType.MATCHING,
    "matching-information": QuestionType.MATCHING,
    "matching-sentence-endings": QuestionType.MATCHING,
    "matching-features": QuestionType.MATCHING,
    "table-completion": QuestionType.GAP_FILL,
    "note-completion": QuestionType.GAP_FILL,
    "summary-completion": QuestionType.GAP_FILL,
    "sentence-completion": QuestionType.GAP_FILL,
    "diagram-labelling": QuestionType.GAP_FILL,
    "short-answer": QuestionType.GAP_FILL,
    "flow-chart-completion": QuestionType.GAP_FILL,
}


def _map_question_type(raw_type: str) -> QuestionType:
    """Convert dataset question_type string to QuestionType enum."""
    mapped = _QUESTION_TYPE_MAP.get(raw_type)
    if mapped:
        return mapped
    logging.warning("Unknown question type '%s', falling back to MULTIPLE_CHOICE", raw_type)
    return QuestionType.MULTIPLE_CHOICE


def _extract_options(question: Dict[str, Any], q_type: str) -> List[str]:
    """Extract options list from a dataset question object."""
    # Multiple choice — options with text (dict or plain string)
    if "options" in question and question["options"]:
        opts = question["options"]
        if isinstance(opts[0], dict):
            return [opt.get("text", "") for opt in opts]
        # Plain string options (e.g. listening: ["A", "B", "C"])
        return [str(opt) for opt in opts]

    # True/False/Not Given
    if q_type in ("true-false-not-given",):
        return ["True", "False", "Not Given"]
    if q_type in ("yes-no-not-given",):
        return ["Yes", "No", "Not Given"]

    return []


def _extract_correct_answer(question: Dict[str, Any], q_type: str) -> Optional[str]:
    """Extract the correct answer string from a dataset question."""
    answer = question.get("answer")
    if answer:
        return str(answer)
    return None


def _extract_correct_answer_index(
    question: Dict[str, Any], options: List[str], q_type: str
) -> Optional[int]:
    """Determine the 0-based index of the correct answer in options."""
    if not options:
        return None

    # Multiple choice with is_correct flag
    if "options" in question and question["options"]:
        for idx, opt in enumerate(question["options"]):
            if isinstance(opt, dict) and opt.get("is_correct"):
                return idx

    # Try to match answer string to options
    answer = question.get("answer", "")
    if answer:
        for idx, opt_text in enumerate(options):
            if opt_text.startswith(f"{answer}.") or opt_text == answer:
                return idx

    return None


def _convert_question(question: Dict[str, Any], q_type: str) -> Question:
    """Convert a single dataset question to the project Question model."""
    mapped_type = _map_question_type(q_type)
    options = _extract_options(question, q_type)
    correct_answer = _extract_correct_answer(question, q_type)
    correct_index = _extract_correct_answer_index(question, options, q_type)

    return Question(
        questionText=question.get("text", ""),
        questionType=mapped_type,
        options=options,
        correctAnswerIndex=correct_index,
        correctAnswer=correct_answer,
        explanation=None,
    )


def _detect_skill(file_path: Path) -> SkillType:
    """Detect skill type from the file path or directory name."""
    path_str = str(file_path).lower()
    if "listening" in path_str:
        return SkillType.LISTENING
    if "writing" in path_str:
        return SkillType.WRITING
    if "speaking" in path_str:
        return SkillType.SPEAKING
    return SkillType.READING


def convert_dataset_json(data: Dict[str, Any], skill: SkillType) -> TestData:
    """Convert a dataset JSON object into TestData.

    Dispatches to skill-specific converters based on the detected skill.
    """
    title = data.get("title", "Imported IELTS Test")

    if skill == SkillType.LISTENING:
        sections = _convert_listening(data)
    elif skill == SkillType.WRITING:
        sections = _convert_writing(data)
    else:
        sections = _convert_reading(data, skill)

    return TestData(title=title, sections=sections)


def _convert_reading(data: Dict[str, Any], skill: SkillType) -> List[Section]:
    """Convert reading JSON (passages → sections)."""
    sections: List[Section] = []

    for passage_data in data.get("passages", []):
        passage_num = passage_data.get("passage_number", len(sections) + 1)
        content = passage_data.get("content", "")

        if content:
            content = content.replace("\\n", "\n")

        questions: List[Question] = []
        for group in passage_data.get("question_groups", []):
            q_type = group.get("question_type", "multiple-choice")
            for q in group.get("questions", []):
                questions.append(_convert_question(q, q_type))

        section = Section(
            title=f"READING PASSAGE {passage_num}",
            skill=skill,
            passages=[
                Passage(
                    content=content if content else None,
                    questions=questions,
                )
            ],
        )
        sections.append(section)

    return sections


def _convert_listening(data: Dict[str, Any]) -> List[Section]:
    """Convert listening JSON (sections with transcript → sections)."""
    sections: List[Section] = []

    for section_data in data.get("sections", []):
        section_num = section_data.get("section_number", len(sections) + 1)
        section_title = section_data.get("title", f"Section {section_num}")
        transcript = section_data.get("transcript", "")

        if transcript:
            transcript = transcript.replace("\\n", "\n")

        questions: List[Question] = []
        for group in section_data.get("question_groups", []):
            q_type = group.get("question_type", "multiple-choice")
            for q in group.get("questions", []):
                questions.append(_convert_question(q, q_type))

        section = Section(
            title=f"LISTENING SECTION {section_num}: {section_title}",
            skill=SkillType.LISTENING,
            passages=[
                Passage(
                    content=transcript if transcript else None,
                    questions=questions,
                )
            ],
        )
        sections.append(section)

    return sections


def _convert_writing(data: Dict[str, Any]) -> List[Section]:
    """Convert writing JSON (tasks → sections with essay questions)."""
    sections: List[Section] = []

    for task_data in data.get("tasks", []):
        task_num = task_data.get("task_number", len(sections) + 1)
        task_title = task_data.get("title", f"Writing Task {task_num}")
        task_type = task_data.get("task_type", f"task{task_num}")
        prompt_text = task_data.get("prompt", "")
        min_words = task_data.get("min_words")

        # Map task_type to QuestionType enum
        if task_type == "task1":
            question_type = QuestionType.IELTS_WRITING_TASK1
        else:
            question_type = QuestionType.IELTS_WRITING_TASK2

        question = Question(
            questionText=prompt_text,
            questionType=question_type,
            options=[],
            correctAnswerIndex=None,
            correctAnswer=None,
            explanation=None,
            wordLimit=min_words,
        )

        section = Section(
            title=task_title,
            skill=SkillType.WRITING,
            passages=[
                Passage(
                    content=None,
                    questions=[question],
                )
            ],
        )
        sections.append(section)

    return sections


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Import ielts-ai-dataset JSON files into project DB."
    )
    parser.add_argument(
        "input_path",
        help="Path to a JSON file or directory containing JSON files.",
    )
    parser.add_argument(
        "--english-test-type-id",
        default=os.getenv("DEFAULT_TEST_TYPE_ID"),
        help="UUID for english_test_type_id in DB (default: $DEFAULT_TEST_TYPE_ID).",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print converted TestData JSON to stdout without inserting into DB.",
    )
    return parser.parse_args()


def _collect_json_files(input_path: Path) -> List[Path]:
    """Collect JSON files from path (single file or directory)."""
    if input_path.is_file() and input_path.suffix == ".json":
        return [input_path]
    if input_path.is_dir():
        files = sorted(input_path.glob("**/*.json"))
        if not files:
            raise FileNotFoundError(f"No JSON files found in {input_path}")
        return files
    raise FileNotFoundError(f"Invalid path: {input_path}")


def main() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(message)s",
    )

    args = parse_args()
    input_path = Path(args.input_path).expanduser().resolve()
    files = _collect_json_files(input_path)

    logging.info("Found %d JSON file(s) to import.", len(files))

    conn = None
    if not args.dry_run:
        if not args.english_test_type_id:
            raise EnvironmentError(
                "Missing --english-test-type-id or DEFAULT_TEST_TYPE_ID in .env"
            )
        db_url = os.getenv("ASSESSMENT_DATABASE_URL")
        if not db_url:
            raise EnvironmentError("Missing ASSESSMENT_DATABASE_URL in .env")
        conn = _connect_db(db_url)

    results: List[Dict[str, Any]] = []

    for file_path in files:
        logging.info("Processing: %s", file_path.name)
        with open(file_path, encoding="utf-8") as f:
            data = json.load(f)

        # Skip non-test JSON (e.g. quality_report is an array, not a test object)
        if not isinstance(data, dict):
            logging.warning("Skipping %s (not a test JSON object)", file_path.name)
            continue

        skill = _detect_skill(file_path)
        test_data = convert_dataset_json(data, skill)

        n_sections = len(test_data.sections)
        n_questions = sum(
            len(p.questions) for s in test_data.sections for p in s.passages
        )
        logging.info(
            "  → '%s': %d section(s), %d question(s)",
            test_data.title,
            n_sections,
            n_questions,
        )

        if args.dry_run:
            print(json.dumps(
                test_data.model_dump(mode="json"),
                ensure_ascii=False,
                indent=2,
            ))
        else:
            test_id = insert_test_data(conn, test_data, args.english_test_type_id)
            conn.commit()
            results.append({
                "file": file_path.name,
                "test_id": test_id,
                "title": test_data.title,
                "sections": n_sections,
                "questions": n_questions,
            })
            logging.info("  → Inserted as test_id=%s", test_id)

    if conn:
        conn.close()

    if results:
        logging.info("=" * 60)
        logging.info("Import complete. %d test(s) inserted:", len(results))
        for r in results:
            logging.info(
                "  %s → test_id=%s (%d sections, %d questions)",
                r["file"],
                r["test_id"],
                r["sections"],
                r["questions"],
            )


if __name__ == "__main__":
    main()
