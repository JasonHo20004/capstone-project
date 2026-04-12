"""Pydantic models and enums shared across the OCR pipeline."""

from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class QuestionType(str, Enum):
    MULTIPLE_CHOICE = "MULTIPLE_CHOICE"
    ESSAY = "ESSAY"
    FILL_IN_THE_BLANK = "FILL_IN_THE_BLANK"
    GAP_FILL = "GAP_FILL"
    MATCHING = "MATCHING"
    TRUE_FALSE_NOT_GIVEN = "TRUE_FALSE_NOT_GIVEN"
    TOEIC_SINGLE_CHOICE = "TOEIC_SINGLE_CHOICE"
    TOEIC_TEXT_COMPLETION = "TOEIC_TEXT_COMPLETION"
    IELTS_WRITING_TASK1 = "IELTS_WRITING_TASK1"
    IELTS_WRITING_TASK2 = "IELTS_WRITING_TASK2"
    IELTS_SPEAKING = "IELTS_SPEAKING"
    TOEIC_WRITING = "TOEIC_WRITING"
    TOEIC_SPEAKING = "TOEIC_SPEAKING"


class SkillType(str, Enum):
    READING = "READING"
    LISTENING = "LISTENING"
    WRITING = "WRITING"
    SPEAKING = "SPEAKING"


class Question(BaseModel):
    questionText: Optional[str] = None
    questionType: QuestionType
    options: List[str] = Field(default_factory=list)
    correctAnswerIndex: Optional[int] = None
    wordLimit: Optional[int] = None
    correctAnswer: Optional[str] = None
    explanation: Optional[str] = None


class Passage(BaseModel):
    content: Optional[str] = None
    questions: List[Question] = Field(default_factory=list)


class Section(BaseModel):
    title: str
    skill: SkillType
    passages: List[Passage] = Field(default_factory=list)


class TestData(BaseModel):
    title: str
    sections: List[Section] = Field(default_factory=list)
