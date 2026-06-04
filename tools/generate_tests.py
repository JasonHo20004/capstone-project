"""Generate N IELTS tests (Reading, Listening, Writing) using AI (Gemini API or Ollama local).

Supports both cloud (Gemini Flash — free tier) and local (Ollama) providers.
Uses the prompt template from ielts-ai-dataset/.prompts/ for consistent output.
Validates generated JSON and produces a quality comparison report.

Usage:
    # Generate 3 tests with Gemini API
    python generate_tests.py --provider gemini --count 3 --api-key YOUR_KEY

    # Generate 3 tests with local Ollama
    python generate_tests.py --provider ollama --count 3 --model gemma3:12b

    # Generate with both and compare
    python generate_tests.py --provider both --count 2 --api-key YOUR_KEY --model gemma3:12b

    # Import generated tests into DB
    python import_dataset.py generated_tests/ --english-test-type-id <uuid>
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import re
import sys
import time
import uuid
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
import httpx

import random

load_dotenv()

# ---------------------------------------------------------------------------
# Topic pools for diverse content generation (randomly sampled per test)
# ---------------------------------------------------------------------------

_READING_TOPICS = [
    "The History and Science of Coffee Cultivation",
    "The Impact of Social Media on Political Discourse",
    "Advances in Renewable Energy Storage Technologies",
    "The Evolution of Human Language and Communication",
    "Urban Agriculture and Community Food Security",
    "The Ethics of Artificial Intelligence in Healthcare",
    "The Decline and Revival of Coral Reef Ecosystems",
    "The Role of Play in Childhood Development",
    "Space Debris and the Future of Orbital Sustainability",
    "Ancient Water Management Systems in Arid Regions",
    "The Psychological Effects of Remote Work on Employees",
    "Bioprinting and the Future of Organ Transplantation",
    "The Cultural Significance of Traditional Fermented Foods",
    "How Architecture Influences Human Behavior and Mood",
    "Deep-Sea Mining: Opportunities and Environmental Risks",
    "The History of Cartography and Mapmaking",
    "Microplastics in the Food Chain and Human Health",
    "Quantum Computing and Its Implications for Cybersecurity",
    "The Science Behind Sleep and Circadian Rhythms",
    "The Economics of Fast Fashion and Sustainable Alternatives",
    "Gene Editing Technology and Its Societal Implications",
    "The Migration Patterns of Monarch Butterflies",
    "Digital Literacy and Education in Developing Countries",
    "The Role of Fungi in Forest Ecosystem Communication",
    "Ancient Astronomical Observatories Around the World",
    "The Impact of Noise Pollution on Wildlife",
    "Neuroplasticity and Its Applications in Stroke Recovery",
    "The Development of Writing Systems Across Civilizations",
    "Electric Vehicle Adoption and Infrastructure Challenges",
    "The Science of Happiness and Positive Psychology Research",
    "The Rise and Fall of the Silk Road Trade Network",
    "Vertical Farming and High-Tech Indoor Agriculture",
    "The Psychology of Color in Marketing and Design",
    "Ocean Acidification and Its Effects on Marine Life",
    "The History of Vaccines and Global Public Health",
    "Smart Cities and the Internet of Things Infrastructure",
    "The Linguistics of Endangered Languages and Preservation",
    "Climate Migration and Its Geopolitical Consequences",
    "The Science of Memory Formation and Retrieval",
    "Deforestation and Carbon Sequestration in Tropical Forests",
    "The Impact of Music Therapy on Mental Health",
    "Autonomous Vehicles: Technology, Regulation, and Society",
    "The Role of Bees in Global Agriculture and Ecology",
    "Water Desalination Technologies and Future Water Security",
    "The History and Evolution of Animation Techniques",
    "Biomimicry: Nature-Inspired Solutions in Engineering",
    "The Impact of Tourism on Indigenous Communities",
    "Antibiotic Resistance: A Global Health Crisis",
    "The Physics and Engineering of Earthquake-Resistant Buildings",
    "The Future of Space Colonization and Mars Settlement",
]

_LISTENING_TOPICS = [
    # Section 1: Transactional dialogues
    "Booking a Moving Company",
    "Enrolling in a Language Course",
    "Reserving a Hotel Room for a Conference",
    "Arranging Home Appliance Repair",
    "Signing Up for a Gym Membership",
    "Booking a Photography Studio Session",
    "Registering for an Art Workshop",
    "Making a Dentist Appointment",
    "Reserving Tickets for a Theatre Performance",
    "Inquiring About Pet Boarding Services",
    # Section 2: Monologues — guided tours, public broadcasts
    "Community Swimming Pool Orientation",
    "Museum Exhibition Audio Guide",
    "Campus Library Tour for New Students",
    "Public Park Renovation Announcement",
    "Local Farmers Market Weekly Update",
    "Hospital Visitor Information Broadcast",
    "New Residential Complex Open Day",
    "City Cycling Route Guide",
    "Shopping Centre Renovation Notice",
    "Airport Terminal Navigation Guide",
    # Section 3: Academic discussions
    "Green Architecture Research Project",
    "Marine Biology Field Study Review",
    "Psychology Experiment Design Meeting",
    "Business Ethics Group Assignment",
    "Climate Change Data Analysis Review",
    "Sociology Research Methodology Discussion",
    "Educational Technology Assessment Review",
    "Urban Planning Thesis Discussion",
    "Public Health Campaign Evaluation",
    "Renewable Energy Policy Debate Prep",
    # Section 4: Academic lectures
    "The History and Science of Sleep",
    "Behavioral Economics and Decision Making",
    "The Evolution of Human Navigation Methods",
    "Volcanic Activity and Climate History",
    "The Development of Modern Antibiotics",
    "Cognitive Biases in Everyday Life",
    "The Science of Sound and Acoustics",
    "Ancient Trade Routes and Cultural Exchange",
    "The Psychology of Procrastination",
    "Biodiversity Loss in Urban Environments",
]

_WRITING_TOPICS = [
    # Task 1: Data interpretation
    {
        "task1": "The bar chart shows the percentage of adults using different social media platforms in five countries in 2023.",
        "task2": "Some people believe social media platforms should be regulated by the government to prevent the spread of misinformation. To what extent do you agree or disagree?",
    },
    {
        "task1": "The line graph illustrates the changes in average global temperature anomaly from 1900 to 2020.",
        "task2": "Some scientists argue that climate change is primarily caused by human activities, while others believe natural factors play a larger role. Discuss both views and give your own opinion.",
    },
    {
        "task1": "The pie charts compare the sources of electricity generation in two countries in 2000 and 2020.",
        "task2": "Nuclear energy is sometimes considered an alternative to fossil fuels. What are the advantages and disadvantages of using nuclear power?",
    },
    {
        "task1": "The table provides data on the number of international tourists arriving in six different countries between 2015 and 2025.",
        "task2": "International tourism has become a major industry. Do the benefits of tourism outweigh the drawbacks for the host country?",
    },
    {
        "task1": "The diagram below shows the process of recycling plastic bottles.",
        "task2": "Many people believe that the best way to address environmental problems is through individual action, while others think governments and large companies should take the lead. Discuss both views.",
    },
    {
        "task1": "The bar chart illustrates the average hours per week spent on different leisure activities by men and women in a European country.",
        "task2": "In many countries, people are working longer hours than ever before. What are the causes of this trend, and what effects does it have on individuals and society?",
    },
    {
        "task1": "The maps below show a small town before and after the construction of a new airport.",
        "task2": "Some people argue that developing infrastructure such as airports and highways is essential for economic progress, while others believe it causes more harm than good. Discuss both views.",
    },
    {
        "task1": "The two tables compare the daily calorie intake and the prevalence of obesity in five different countries in 1990 and 2020.",
        "task2": "In many developed countries, the average lifespan is increasing. What are the positive and negative effects of this trend?",
    },
    {
        "task1": "The line graph shows the spending on education as a percentage of GDP in four countries from 2000 to 2020.",
        "task2": "Some people think that the government should invest more in education, while others believe spending on healthcare is more important. Discuss both views and give your opinion.",
    },
    {
        "task1": "The diagram illustrates how rainwater is collected and used in a typical household rainwater harvesting system.",
        "task2": "Fresh water is becoming an increasingly scarce resource. What are the causes of water shortage, and what solutions can be implemented?",
    },
    {
        "task1": "The bar chart shows the percentage of household waste recycled in five cities in 2010 and 2020.",
        "task2": "Some people think that governments should make recycling mandatory, while others believe it should be a personal choice. Discuss both views.",
    },
    {
        "task1": "The chart below shows the proportion of workers in three different sectors across four countries.",
        "task2": "Automation and artificial intelligence are expected to replace many jobs. What are the consequences, and how should society prepare?",
    },
    {
        "task1": "The graph shows the growth of online shopping compared to traditional retail sales in a country from 2010 to 2025.",
        "task2": "Online shopping is replacing traditional shopping. Is this a positive or negative development?",
    },
    {
        "task1": "The maps show changes to a city centre between 1990 and the present day.",
        "task2": "Many cities are becoming increasingly congested. What are the causes of traffic congestion and what measures can be taken to solve it?",
    },
    {
        "task1": "The flowchart shows the stages involved in producing chocolate from cocoa beans.",
        "task2": "Some people argue that the food industry has become too industrialized and that we should return to more traditional methods of food production. To what extent do you agree?",
    },
]


def _sample_topics(skill: str, count: int = 1) -> List[Dict[str, str]]:
    """Randomly sample topic sets for the given skill."""
    results = []
    if skill == "reading":
        pool = list(_READING_TOPICS)
        for _ in range(count):
            chosen = random.sample(pool, min(3, len(pool)))
            results.append({
                "passage_1": chosen[0],
                "passage_2": chosen[1],
                "passage_3": chosen[2],
            })
    elif skill == "listening":
        for _ in range(count):
            s1 = random.choice(_LISTENING_TOPICS[:10])
            s2 = random.choice(_LISTENING_TOPICS[10:20])
            s3 = random.choice(_LISTENING_TOPICS[20:30])
            s4 = random.choice(_LISTENING_TOPICS[30:])
            results.append({
                "section_1": s1,
                "section_2": s2,
                "section_3": s3,
                "section_4": s4,
            })
    elif skill == "writing":
        for _ in range(count):
            chosen = random.choice(_WRITING_TOPICS)
            results.append(chosen)
    return results


def _generate_uuids(count: int = 60) -> List[str]:
    """Generate a batch of UUIDs for the prompt template."""
    return [str(uuid.uuid4()) for _ in range(count)]


# ---------------------------------------------------------------------------
# Prompt builder
# ---------------------------------------------------------------------------

def _build_prompt(
    template_path: Path,
    reference_json_path: Path,
    topics: Dict[str, str],
    test_number: int,
    skill: str = "reading",
) -> str:
    """Build a complete generation prompt from the template."""
    template = template_path.read_text(encoding="utf-8")
    reference_json = reference_json_path.read_text(encoding="utf-8")

    # Generate UUIDs
    uuids = _generate_uuids(60)
    uuid_block = "\n".join(uuids)

    # Replace placeholders
    prompt = template.replace("PASTE_YOUR_RANDOM_UUIDS_BELOW", uuid_block)
    prompt = prompt.replace("PASTE_YOUR_REFERENCE_JSON_HERE", reference_json)

    # Add topic customization per skill
    topic_instruction = f"\n\n# Topic Configuration (Test #{test_number})\n"

    if skill == "reading":
        topic_instruction += (
            f"- Passage 1 topic: {topics['passage_1']}\n"
            f"- Passage 2 topic: {topics['passage_2']}\n"
            f"- Passage 3 topic: {topics['passage_3']}\n"
            f"- TEST_TYPE: Academic\n"
            f"\nGenerate completely UNIQUE content. Each passage must be "
            f"factually accurate, well-written, and 600+ words.\n"
        )
    elif skill == "listening":
        topic_instruction += (
            f"- Section 1 (Transactional Dialogue): {topics['section_1']}\n"
            f"- Section 2 (Monologue/Tour): {topics['section_2']}\n"
            f"- Section 3 (Academic Discussion): {topics['section_3']}\n"
            f"- Section 4 (Academic Lecture): {topics['section_4']}\n"
            f"\nGenerate completely UNIQUE transcripts. "
            f"Each transcript must be realistic with speaker labels. "
            f"Exactly 40 questions across 4 sections.\n"
        )
    elif skill == "writing":
        topic_instruction += (
            f"- Task 1 prompt: {topics['task1']}\n"
            f"- Task 2 prompt: {topics['task2']}\n"
            f"- TEST_TYPE: Academic\n"
            f"\nGenerate a UNIQUE writing test. Task 1 should describe "
            f"a visual data source. Task 2 should be a discursive essay prompt.\n"
        )

    prompt += topic_instruction
    return prompt


# ---------------------------------------------------------------------------
# Provider: Gemini API
# ---------------------------------------------------------------------------

def _call_gemini(
    prompt: str,
    api_key: str,
    model: str = "gemini-2.5-flash",
    timeout: float = 120.0,
    max_retries: int = 3,
) -> str:
    """Call Google Gemini API with retry logic for rate limits."""
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/"
        f"models/{model}:generateContent"
    )
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 65536,
            "responseMimeType": "application/json",
        },
    }

    for attempt in range(1, max_retries + 1):
        with httpx.Client(timeout=timeout) as client:
            resp = client.post(url, params={"key": api_key}, json=payload)

        if resp.status_code == 429:
            wait = 30 * (2 ** (attempt - 1))  # 30s, 60s, 120s
            logging.warning(
                "Rate limited (429). Retry %d/%d in %ds...",
                attempt, max_retries, wait,
            )
            if attempt == max_retries:
                raise RuntimeError(
                    f"Gemini rate limit exceeded after {max_retries} retries. "
                    f"Free tier allows ~15 RPM. Try again later or reduce --count."
                )
            time.sleep(wait)
            continue

        resp.raise_for_status()
        data = resp.json()

        candidates = data.get("candidates", [])
        if not candidates:
            raise RuntimeError(f"Gemini returned no candidates: {data}")

        parts = candidates[0].get("content", {}).get("parts", [])
        if not parts:
            raise RuntimeError(f"Gemini returned empty parts: {candidates[0]}")

        return parts[0].get("text", "")

    raise RuntimeError("Unexpected: exhausted retries without response")


# ---------------------------------------------------------------------------
# Provider: Ollama (local)
# ---------------------------------------------------------------------------

def _call_ollama(
    prompt: str,
    model: str = "gemma3:12b",
    host: str = "http://127.0.0.1:11434",
    timeout: float = 600.0,
    num_ctx: int = 32768,
) -> str:
    """Call Ollama local API and return the response text."""
    url = f"{host}/api/generate"
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.7,
            "num_ctx": num_ctx,
            "num_predict": 16384,
        },
    }
    with httpx.Client(timeout=timeout) as client:
        resp = client.post(url, json=payload)
        resp.raise_for_status()
        data = resp.json()

    return data.get("response", "")


# ---------------------------------------------------------------------------
# JSON extraction and validation
# ---------------------------------------------------------------------------

def _repair_gemini_json(text: str) -> str:
    """Repair Gemini's malformed JSON where question_groups leak out of passage objects.

    Gemini 2.5-flash sometimes produces:
        "passages": [ { ...passage... }, "question_groups": [...], { ...next... } ]
    instead of:
        "passages": [ { ...passage..., "question_groups": [...] }, { ...next... } ]

    Fix: simply replace `}, "question_groups"` with `, "question_groups"` to merge
    the orphaned key back into the preceding passage object. Then find the matching
    `]` of the question_groups array and add `}` after it to close the passage.
    """
    # Simple text pattern: }, followed by whitespace, then "question_groups"
    # Replace the premature } with just a comma
    pattern = re.compile(r'\}\s*,\s*("question_groups"\s*:\s*\[)')

    while True:
        match = pattern.search(text)
        if not match:
            break

        # Find the [ that starts the question_groups array
        bracket_pos = match.end() - 1  # position of [
        # Find matching ]
        depth = 0
        i = bracket_pos
        while i < len(text):
            if text[i] == '[':
                depth += 1
            elif text[i] == ']':
                depth -= 1
                if depth == 0:
                    break
            i += 1
        bracket_end = i  # position of ]

        # After the question_groups ] there's the original passage closing },
        # which we need to consume (we'll add our own })
        after = bracket_end + 1
        while after < len(text) and text[after] in ' \t\r\n':
            after += 1

        # Skip the original passage closing }
        if after < len(text) and text[after] == '}':
            after += 1
            while after < len(text) and text[after] in ' \t\r\n':
                after += 1
            # Check if there's a comma (more passages follow)
            has_next = after < len(text) and text[after] == ','
            if has_next:
                after += 1  # consume the comma

            text = (
                text[:match.start()]
                + ', ' + match.group(1)
                + text[match.end():bracket_end + 1]
                + (' },' if has_next else ' }')
                + text[after:]
            )
        else:
            # No trailing } — just close the passage
            text = (
                text[:match.start()]
                + ', ' + match.group(1)
                + text[match.end():bracket_end + 1]
                + ' }'
                + text[after:]
            )

    return text


def _normalize_question_groups(data: Dict[str, Any]) -> Dict[str, Any]:
    """Move root-level question_groups into passages if needed.

    Gemini sometimes puts question_groups at root level instead of
    nesting them inside each passage. We redistribute by passage_number.
    """
    root_qgs = data.pop("question_groups", None)
    if not root_qgs or not isinstance(root_qgs, list):
        return data

    passages = data.get("passages", [])
    if not passages:
        return data

    # Build passage lookup by passage_number
    passage_map = {}
    for p in passages:
        pn = p.get("passage_number", 0)
        if "question_groups" not in p:
            p["question_groups"] = []
        passage_map[pn] = p

    # Assign question_groups to passages based on question_order ranges
    # Passage 1: Q1-13, Passage 2: Q14-27, Passage 3: Q28-40
    ranges = {1: (1, 13), 2: (14, 27), 3: (28, 40)}

    for qg in root_qgs:
        questions = qg.get("questions", [])
        if not questions:
            # Assign to first passage without groups
            for p in passages:
                if not p.get("question_groups"):
                    p["question_groups"].append(qg)
                    break
            continue

        first_order = questions[0].get("question_order", 0)
        assigned = False
        for pn, (lo, hi) in ranges.items():
            if lo <= first_order <= hi and pn in passage_map:
                passage_map[pn]["question_groups"].append(qg)
                assigned = True
                break
        if not assigned and passages:
            passages[-1].setdefault("question_groups", []).append(qg)

    return data


def _extract_json(raw_text: str) -> Optional[Dict[str, Any]]:
    """Extract JSON object from raw AI response text."""
    text = raw_text.strip()
    # Strip markdown fences
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s*```$", "", text)
    text = text.strip()

    # Fix Gemini's malformed JSON (question_groups leaking out of passages)
    text = _repair_gemini_json(text)

    # Try direct parse
    try:
        data = json.loads(text)
        return _normalize_question_groups(data)
    except json.JSONDecodeError:
        pass

    # Try to find JSON object in text
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        try:
            data = json.loads(match.group())
            return _normalize_question_groups(data)
        except json.JSONDecodeError:
            pass

    return None


@dataclass
class QualityReport:
    """Quality metrics for a generated test."""
    provider: str
    model: str
    test_number: int
    file_name: str
    skill: str = "reading"
    generation_time_s: float = 0.0
    json_valid: bool = False
    has_title: bool = False
    section_count: int = 0
    question_count: int = 0
    expected_questions: int = 40
    content_word_counts: List[int] = field(default_factory=list)
    question_types: List[str] = field(default_factory=list)
    has_answers: bool = False
    errors: List[str] = field(default_factory=list)

    @property
    def completeness_pct(self) -> float:
        if self.expected_questions == 0:
            return 100.0 if self.json_valid else 0.0
        return (self.question_count / self.expected_questions * 100)

    @property
    def avg_content_words(self) -> int:
        return int(sum(self.content_word_counts) / len(self.content_word_counts)) if self.content_word_counts else 0

    def summary_line(self) -> str:
        if self.skill == "writing":
            status = "✅" if self.json_valid and self.section_count >= 2 else "❌"
            return (
                f"{status} [{self.provider}/{self.model}] {self.skill.upper()} #{self.test_number}: "
                f"{self.section_count} tasks, "
                f"{self.generation_time_s:.1f}s"
            )
        status = "✅" if self.json_valid and self.question_count >= 35 else "⚠️" if self.json_valid else "❌"
        section_label = "passages" if self.skill == "reading" else "sections"
        return (
            f"{status} [{self.provider}/{self.model}] {self.skill.upper()} #{self.test_number}: "
            f"{self.question_count}/{self.expected_questions} questions, "
            f"{self.section_count} {section_label}, "
            f"avg {self.avg_content_words} words, "
            f"{self.generation_time_s:.1f}s"
        )


def _validate_test(
    data: Dict[str, Any],
    provider: str,
    model: str,
    test_num: int,
    gen_time: float,
    filename: str,
    skill: str = "reading",
) -> QualityReport:
    """Validate generated test data and produce quality metrics."""
    report = QualityReport(
        provider=provider,
        model=model,
        test_number=test_num,
        file_name=filename,
        skill=skill,
        generation_time_s=gen_time,
        json_valid=True,
        expected_questions=40 if skill in ("reading", "listening") else 0,
    )

    report.has_title = bool(data.get("title"))
    if not report.has_title:
        report.errors.append("Missing title")

    if skill == "reading":
        _validate_reading(data, report)
    elif skill == "listening":
        _validate_listening(data, report)
    elif skill == "writing":
        _validate_writing(data, report)

    return report


def _validate_reading(data: Dict[str, Any], report: QualityReport) -> None:
    """Validate reading test structure."""
    passages = data.get("passages", [])
    report.section_count = len(passages)
    if report.section_count < 3:
        report.errors.append(f"Expected 3 passages, got {report.section_count}")

    total_questions = 0
    has_any_answer = False

    for p in passages:
        content = p.get("content", "")
        word_count = len(content.split()) if content else 0
        report.content_word_counts.append(word_count)

        if word_count < 200:
            report.errors.append(
                f"Passage {p.get('passage_number', '?')}: only {word_count} words (expected 600+)"
            )

        for group in p.get("question_groups", []):
            q_type = group.get("question_type", "unknown")
            if q_type not in report.question_types:
                report.question_types.append(q_type)
            for q in group.get("questions", []):
                total_questions += 1
                if q.get("answer"):
                    has_any_answer = True

    report.question_count = total_questions
    report.has_answers = has_any_answer
    if total_questions < 35:
        report.errors.append(f"Only {total_questions} questions (expected 40)")


def _validate_listening(data: Dict[str, Any], report: QualityReport) -> None:
    """Validate listening test structure."""
    sections = data.get("sections", [])
    report.section_count = len(sections)
    if report.section_count < 4:
        report.errors.append(f"Expected 4 sections, got {report.section_count}")

    total_questions = 0
    has_any_answer = False

    for s in sections:
        transcript = s.get("transcript", "")
        word_count = len(transcript.split()) if transcript else 0
        report.content_word_counts.append(word_count)

        if word_count < 50:
            report.errors.append(
                f"Section {s.get('section_number', '?')}: transcript too short ({word_count} words)"
            )

        for group in s.get("question_groups", []):
            q_type = group.get("question_type", "unknown")
            if q_type not in report.question_types:
                report.question_types.append(q_type)
            for q in group.get("questions", []):
                total_questions += 1
                if q.get("answer"):
                    has_any_answer = True

    report.question_count = total_questions
    report.has_answers = has_any_answer
    if total_questions < 35:
        report.errors.append(f"Only {total_questions} questions (expected 40)")


def _validate_writing(data: Dict[str, Any], report: QualityReport) -> None:
    """Validate writing test structure."""
    tasks = data.get("tasks", [])
    report.section_count = len(tasks)
    if report.section_count < 2:
        report.errors.append(f"Expected 2 tasks, got {report.section_count}")

    for t in tasks:
        prompt_text = t.get("prompt", "")
        word_count = len(prompt_text.split()) if prompt_text else 0
        report.content_word_counts.append(word_count)

        if word_count < 20:
            report.errors.append(
                f"Task {t.get('task_number', '?')}: prompt too short ({word_count} words)"
            )

    report.has_answers = False
    report.question_count = 0


# ---------------------------------------------------------------------------
# Main generation logic
# ---------------------------------------------------------------------------

def generate_test(
    provider: str,
    model: str,
    prompt: str,
    api_key: Optional[str] = None,
    ollama_host: str = "http://127.0.0.1:11434",
) -> tuple[str, float]:
    """Generate one test. Returns (raw_response, generation_time_seconds)."""
    start = time.perf_counter()

    if provider == "gemini":
        if not api_key:
            raise ValueError("Gemini API key required. Use --api-key or GEMINI_API_KEY env var.")
        raw = _call_gemini(prompt, api_key=api_key, model=model)
    elif provider == "ollama":
        raw = _call_ollama(prompt, model=model, host=ollama_host)
    else:
        raise ValueError(f"Unknown provider: {provider}")

    elapsed = time.perf_counter() - start
    return raw, elapsed


def _print_comparison_report(reports: List[QualityReport]) -> None:
    """Print a comparison report of all generated tests."""
    print("\n" + "=" * 70)
    print("📊 QUALITY COMPARISON REPORT")
    print("=" * 70)

    by_provider: Dict[str, List[QualityReport]] = {}
    for r in reports:
        key = f"{r.provider}/{r.model}"
        by_provider.setdefault(key, []).append(r)

    for provider_key, provider_reports in by_provider.items():
        print(f"\n🔹 {provider_key}")
        print("-" * 50)
        for r in provider_reports:
            print(f"  {r.summary_line()}")
            if r.errors:
                for err in r.errors:
                    print(f"      ⚠ {err}")

        valid = [r for r in provider_reports if r.json_valid]
        if valid:
            avg_time = sum(r.generation_time_s for r in valid) / len(valid)
            avg_questions = sum(r.question_count for r in valid) / len(valid)
            avg_words = sum(r.avg_content_words for r in valid) / len(valid)
            avg_completeness = sum(r.completeness_pct for r in valid) / len(valid)
            q_types = set()
            for r in valid:
                q_types.update(r.question_types)

            print(f"\n  📈 Summary for {provider_key}:")
            print(f"     Valid JSON:    {len(valid)}/{len(provider_reports)}")
            print(f"     Avg time:      {avg_time:.1f}s")
            print(f"     Avg questions: {avg_questions:.0f}/40")
            print(f"     Avg words/p:   {avg_words:.0f}")
            print(f"     Completeness:  {avg_completeness:.0f}%")
            print(f"     Q-types seen:  {', '.join(sorted(q_types))}")

    if len(by_provider) > 1:
        print("\n" + "=" * 70)
        print("🏁 HEAD-TO-HEAD COMPARISON")
        print("=" * 70)

        keys = list(by_provider.keys())
        for metric_name, metric_fn in [
            ("Avg generation time", lambda rs: sum(r.generation_time_s for r in rs) / len(rs)),
            ("Avg questions/test", lambda rs: sum(r.question_count for r in rs) / len(rs)),
            ("Avg words/section", lambda rs: sum(r.avg_content_words for r in rs) / len(rs)),
            ("JSON validity rate", lambda rs: sum(1 for r in rs if r.json_valid) / len(rs) * 100),
            ("Completeness (%)", lambda rs: sum(r.completeness_pct for r in rs) / len(rs)),
        ]:
            values = {}
            for k in keys:
                valid = [r for r in by_provider[k] if r.json_valid] or by_provider[k]
                values[k] = metric_fn(valid)
            print(f"\n  {metric_name}:")
            for k in keys:
                bar = "█" * int(values[k] / max(values.values()) * 20) if max(values.values()) > 0 else ""
                print(f"    {k:30s} {values[k]:>8.1f}  {bar}")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate N IELTS tests (Reading, Listening, Writing) using AI."
    )
    parser.add_argument(
        "--skill", "-s",
        choices=["reading", "listening", "writing", "all"],
        default="reading",
        help="IELTS skill to generate (default: reading).",
    )
    parser.add_argument(
        "--provider",
        choices=["gemini", "ollama", "both"],
        default="gemini",
        help="AI provider to use (default: gemini).",
    )
    parser.add_argument(
        "--count", "-n",
        type=int,
        default=1,
        help="Number of tests to generate per provider per skill (default: 1).",
    )
    parser.add_argument(
        "--api-key",
        default=os.getenv("GEMINI_API_KEY"),
        help="Gemini API key (default: $GEMINI_API_KEY).",
    )
    parser.add_argument(
        "--gemini-model",
        default="gemini-2.5-flash",
        help="Gemini model name (default: gemini-2.5-flash).",
    )
    parser.add_argument(
        "--model",
        default="gemma3:12b",
        help="Ollama model name (default: gemma3:12b).",
    )
    parser.add_argument(
        "--ollama-host",
        default=None,
        help="Ollama host URL (default: auto-detect from OLLAMA_HOST or http://127.0.0.1:11434).",
    )
    parser.add_argument(
        "--output-dir", "-o",
        default="generated_tests",
        help="Output directory for generated tests (default: generated_tests/).",
    )
    parser.add_argument(
        "--dataset-dir",
        default=str(Path(__file__).resolve().parent.parent / "ielts-ai-dataset"),
        help="Path to cloned ielts-ai-dataset repository.",
    )
    return parser.parse_args()


# Skill-to-file mapping
_SKILL_CONFIG = {
    "reading": {
        "template": ".prompts/ielts-reading-generator.md",
        "reference": "synthetic_official_mocks/reading/ielts_reading_academic_001.json",
    },
    "listening": {
        "template": ".prompts/ielts-listening-generator.md",
        "reference": "synthetic_official_mocks/listening/ielts_listening_test_001.json",
    },
    "writing": {
        "template": ".prompts/ielts-writing-generator.md",
        "reference": "synthetic_official_mocks/writing/ielts_writing_academic_001.json",
    },
}


def main() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(message)s",
    )

    args = parse_args()
    dataset_dir = Path(args.dataset_dir)
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Normalize ollama host URL
    ollama_host = args.ollama_host or os.getenv("OLLAMA_HOST", "")
    if not ollama_host or not ollama_host.startswith("http"):
        host_ip = ollama_host if ollama_host and ollama_host != "0.0.0.0" else "127.0.0.1"
        ollama_host = f"http://{host_ip}:11434"
    args.ollama_host = ollama_host

    # Determine skills to generate
    skills = ["reading", "listening", "writing"] if args.skill == "all" else [args.skill]

    # Determine providers
    providers: List[tuple[str, str]] = []
    if args.provider in ("gemini", "both"):
        if not args.api_key:
            raise ValueError(
                "Gemini API key required. Set GEMINI_API_KEY env var or use --api-key."
            )
        providers.append(("gemini", args.gemini_model))
    if args.provider in ("ollama", "both"):
        providers.append(("ollama", args.model))

    logging.info("Skills: %s", skills)
    logging.info("Providers: %s", [(p, m) for p, m in providers])
    logging.info("Tests per provider per skill: %d", args.count)
    logging.info("Output directory: %s", output_dir)

    all_reports: List[QualityReport] = []
    request_counter = 0  # Track total requests for rate limiting

    for skill in skills:
        cfg = _SKILL_CONFIG[skill]
        template_path = dataset_dir / cfg["template"]
        reference_path = dataset_dir / cfg["reference"]

        if not template_path.exists():
            logging.error("Template not found: %s", template_path)
            continue
        if not reference_path.exists():
            logging.error("Reference not found: %s", reference_path)
            continue

        # Pre-sample topics for all tests of this skill
        topic_sets = _sample_topics(skill, args.count)

        for provider, model in providers:
            for test_idx in range(args.count):
                test_num = test_idx + 1
                topics = topic_sets[test_idx]

                topic_summary = ", ".join(
                    v if isinstance(v, str) else str(v)[:60]
                    for v in topics.values()
                )[:120]
                logging.info(
                    "[%s] Generating test #%d with %s/%s (topics: %s)",
                    skill.upper(), test_num, provider, model, topic_summary,
                )

                # Delay between requests to avoid rate limiting
                if request_counter > 0:
                    delay = 10
                    logging.info("Waiting %ds before next request (rate limit)...", delay)
                    time.sleep(delay)
                request_counter += 1

                prompt = _build_prompt(
                    template_path, reference_path, topics, test_num, skill=skill,
                )

                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                safe_provider = provider.replace("/", "_")
                filename = f"ielts_{skill}_{safe_provider}_{test_num:03d}_{timestamp}.json"

                try:
                    raw_response, gen_time = generate_test(
                        provider=provider,
                        model=model,
                        prompt=prompt,
                        api_key=args.api_key,
                        ollama_host=args.ollama_host,
                    )
                    logging.info(
                        "Response received in %.1fs (%d chars)", gen_time, len(raw_response),
                    )

                    # Parse JSON
                    data = _extract_json(raw_response)
                    if data is None:
                        report = QualityReport(
                            provider=provider,
                            model=model,
                            test_number=test_num,
                            file_name=filename,
                            skill=skill,
                            generation_time_s=gen_time,
                            json_valid=False,
                            errors=["Failed to parse JSON from response"],
                        )
                        raw_path = output_dir / filename.replace(".json", "_raw.txt")
                        raw_path.write_text(raw_response, encoding="utf-8")
                        logging.warning("Saved raw response to %s", raw_path)
                    else:
                        report = _validate_test(
                            data, provider, model, test_num, gen_time, filename,
                            skill=skill,
                        )
                        out_path = output_dir / filename
                        out_path.write_text(
                            json.dumps(data, ensure_ascii=False, indent=2),
                            encoding="utf-8",
                        )
                        logging.info("Saved: %s", out_path)

                except Exception as exc:
                    logging.error("Generation failed: %s", exc)
                    report = QualityReport(
                        provider=provider,
                        model=model,
                        test_number=test_num,
                        file_name=filename,
                        skill=skill,
                        generation_time_s=0,
                        json_valid=False,
                        errors=[f"Generation error: {exc}"],
                    )

                all_reports.append(report)
                print(f"  {report.summary_line()}")

    # Print comparison report
    _print_comparison_report(all_reports)

    # Save report as JSON
    report_path = output_dir / f"quality_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    report_data = []
    for r in all_reports:
        report_data.append({
            "skill": r.skill,
            "provider": r.provider,
            "model": r.model,
            "test_number": r.test_number,
            "file_name": r.file_name,
            "generation_time_s": round(r.generation_time_s, 2),
            "json_valid": r.json_valid,
            "section_count": r.section_count,
            "question_count": r.question_count,
            "completeness_pct": round(r.completeness_pct, 1),
            "avg_content_words": r.avg_content_words,
            "question_types": r.question_types,
            "has_answers": r.has_answers,
            "errors": r.errors,
        })
    report_path.write_text(
        json.dumps(report_data, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    logging.info("Quality report saved: %s", report_path)

    print(f"\n💡 To import generated tests into DB:")
    print(f"   python import_dataset.py {output_dir}/ --english-test-type-id <uuid>")


if __name__ == "__main__":
    main()
