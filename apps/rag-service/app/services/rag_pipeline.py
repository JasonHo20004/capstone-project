"""
RAG Pipeline - Chunking + Embedding + Vector Retrieval (In-Memory)
This is the TRUE RAG component: Store → Retrieve → Generate
"""

import hashlib
import time
import requests
import numpy as np
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.config import get_settings


class RAGPipeline:
    def __init__(self):
        settings = get_settings()
        self._splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.chunk_size,
            chunk_overlap=settings.chunk_overlap,
            separators=["\n\n", "\n", ". ", " ", ""],
        )
        self._ollama_url = settings.ollama_base_url
        self._model = settings.ollama_model

        # In-memory vector store: { doc_id: { chunks, embeddings, created_at } }
        # TTL-based cleanup to prevent memory leak
        self._store: dict[str, dict] = {}
        self._max_sessions = 50
        self._ttl_seconds = 1800  # 30 minutes

    # ── Public: Chunk only (for flashcard generation) ─────────────────────────

    def chunk_document(self, text: str) -> list[str]:
        """Split text into chunks. No embedding, no storage."""
        chunks = self._splitter.split_text(text)
        return chunks if chunks else []

    # ── Public: Store (the "S" in RAG) ────────────────────────────────────────

    def store_document(self, text: str, doc_id: str | None = None) -> tuple[str, int]:
        """
        Chunk → Embed → Store in memory for later retrieval.
        Returns (doc_id, chunk_count).
        """
        self._cleanup_expired()

        chunks = self._splitter.split_text(text)
        if not chunks:
            return "", 0

        # Generate doc_id if not provided
        if not doc_id:
            doc_id = hashlib.md5(text[:500].encode()).hexdigest()[:12]

        # Embed all chunks
        embeddings = self._embed_batch(chunks)

        self._store[doc_id] = {
            "chunks": chunks,
            "embeddings": np.array(embeddings, dtype=np.float32),
            "created_at": time.time(),
        }

        return doc_id, len(chunks)

    # ── Public: Retrieve (the "R" in RAG) ─────────────────────────────────────

    def retrieve(self, doc_id: str, query: str, top_k: int = 5) -> list[str]:
        """
        Embed query → Cosine similarity → Return top-k relevant chunks.
        This is the RETRIEVAL step of RAG.
        """
        if doc_id not in self._store:
            return []

        data = self._store[doc_id]
        chunks = data["chunks"]
        doc_embeddings = data["embeddings"]

        if len(chunks) == 0:
            return []

        # Embed the user's question
        query_emb = np.array(self._embed_batch([query])[0], dtype=np.float32)

        # Cosine Similarity
        doc_norms = np.linalg.norm(doc_embeddings, axis=1)
        query_norm = np.linalg.norm(query_emb)

        if query_norm == 0:
            return chunks[:top_k]

        similarities = np.dot(doc_embeddings, query_emb) / (doc_norms * query_norm + 1e-10)

        # Top-K most relevant chunks
        k = min(top_k, len(chunks))
        top_indices = np.argsort(similarities)[::-1][:k]

        return [chunks[i] for i in top_indices]

    def has_document(self, doc_id: str) -> bool:
        return doc_id in self._store

    # ── Private: Embedding via Ollama ─────────────────────────────────────────

    def _embed_batch(self, texts: list[str]) -> list[list[float]]:
        """Get embeddings from Ollama /api/embed endpoint."""
        results = []
        for text in texts:
            resp = requests.post(
                f"{self._ollama_url}/api/embed",
                json={"model": self._model, "input": text},
                timeout=120,
            )
            if resp.status_code != 200:
                print(f"[RAG] Embed error {resp.status_code}: {resp.text[:300]}")
                resp.raise_for_status()
            data = resp.json()
            embedding = data.get("embeddings", [[]])[0]
            results.append(embedding)
        return results

    # ── Private: Cleanup expired sessions ─────────────────────────────────────

    def _cleanup_expired(self):
        """Remove sessions older than TTL or over max count."""
        now = time.time()
        expired = [k for k, v in self._store.items() if now - v["created_at"] > self._ttl_seconds]
        for k in expired:
            del self._store[k]

        # If still over limit, remove oldest
        if len(self._store) >= self._max_sessions:
            oldest = sorted(self._store.items(), key=lambda x: x[1]["created_at"])
            for k, _ in oldest[:len(self._store) - self._max_sessions + 1]:
                del self._store[k]
