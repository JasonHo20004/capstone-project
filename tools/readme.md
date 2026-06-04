# IELTS Test Generator & Importer

Bộ công cụ AI để tạo và nhập đề thi IELTS vào database.

## Workflow

```
generate_tests.py → JSON files → import_dataset.py → PostgreSQL
```

| Script | Mô tả |
|--------|--------|
| `generate_tests.py` | Tạo đề thi IELTS bằng AI (Gemini / Ollama) |
| `import_dataset.py` | Import JSON vào database PostgreSQL |
| `models.py` | Pydantic models & enums dùng chung |
| `stages/db.py` | Logic INSERT vào PostgreSQL |

## Skills hỗ trợ

| Skill | Cấu trúc JSON | Số câu hỏi |
|-------|---------------|-------------|
| **Reading** | 3 passages, 40 questions | 40 |
| **Listening** | 4 sections với transcript, 40 questions | 40 |
| **Writing** | 2 tasks (Task 1 + Task 2) | 2 |

## 1) Cài đặt

```powershell
cd tools
python -m venv ocr_env
.\ocr_env\Scripts\activate
pip install python-dotenv httpx psycopg2-binary pydantic
```

## 2) Cấu hình `.env`

```env
# AI Providers
GEMINI_API_KEY=your_gemini_api_key
OLLAMA_HOST=http://127.0.0.1:11434

# Database
ASSESSMENT_DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>?schema=assessment_db&pgbouncer=true
DEFAULT_TEST_TYPE_ID=<uuid-from-english_test_types-table>
```

## 3) Tạo đề thi

```powershell
# Reading (mặc định)
python generate_tests.py --skill reading --count 3

# Listening
python generate_tests.py --skill listening --count 2

# Writing
python generate_tests.py --skill writing --count 5

# Tất cả 3 skills
python generate_tests.py --skill all --count 2
```

### Provider options

```powershell
# Gemini (mặc định)
python generate_tests.py --skill reading --count 3

# Ollama (local)
python generate_tests.py --skill reading --provider ollama --model gemma3:12b --count 3

# So sánh cả 2
python generate_tests.py --skill reading --provider both --count 2
```

### Tham số

| Flag | Mô tả | Mặc định |
|------|--------|----------|
| `--skill` | `reading`, `listening`, `writing`, `all` | `reading` |
| `--provider` | `gemini`, `ollama`, `both` | `gemini` |
| `--count` | Số đề mỗi provider mỗi skill | `1` |
| `--model` | Ollama model | `gemma3:12b` |
| `--gemini-model` | Gemini model | `gemini-2.5-flash` |
| `--output-dir` | Thư mục output | `generated_tests/` |

Output lưu tại `generated_tests/ielts_{skill}_{provider}_{n}_{timestamp}.json`.

## 4) Import vào Database

```powershell
# Dry run (kiểm tra, không insert)
python import_dataset.py generated_tests/ --dry-run

# Import 1 file
python import_dataset.py generated_tests/ielts_reading_gemini_001_20260317_111551.json --english-test-type-id <uuid>

# Import toàn bộ thư mục
python import_dataset.py generated_tests/ --english-test-type-id <uuid>
```

> `<uuid>` là ID từ bảng `english_test_types`. Có thể set `DEFAULT_TEST_TYPE_ID` trong `.env` để không cần truyền.

## 5) Cấu trúc thư mục

```
tools/
├── .env                  # API keys & DB config
├── .gitignore
├── generate_tests.py     # AI test generator
├── import_dataset.py     # DB importer
├── models.py             # Shared models & enums
├── stages/
│   ├── __init__.py
│   └── db.py             # PostgreSQL insert
├── generated_tests/      # Output JSON
└── ocr_env/              # Python virtualenv
```