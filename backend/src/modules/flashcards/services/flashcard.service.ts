import { FlashcardRepository } from "@/modules/flashcards/repositories/flashcard.repository";
import { FlashcardDeckRepository } from "../repositories/flashcardDeck.repository";
import type { Flashcard } from "@/../generated/prisma";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
let englishWords: Set<string> | null = null;
try {
  // 1. Resolve the path to the main file of 'word-list'
  const wordListModulePath = require.resolve("word-list");
  // 2. Get the directory containing that file
  const wordListModuleDir = path.dirname(wordListModulePath);
  // 3. Construct the path to 'words.txt' (usually in the same directory)
  const englishDictionaryPath = path.join(wordListModuleDir, "words.txt"); // Changed this line

  console.log(`Attempting to load dictionary from: ${englishDictionaryPath}`); // Add log

  const dictionaryContent = fs.readFileSync(englishDictionaryPath, "utf8");
  englishWords = new Set(
    dictionaryContent.split("\n").map((word) => word.toLowerCase().trim())
  );
  console.log(
    `Successfully loaded dictionary with ${englishWords.size} words.`
  );
} catch (err) {
  console.error("Failed to load dictionary:", err);
  // englishWords remains null if loading fails
}
const TTS_API_ENDPOINT = process.env.TTS_API_ENDPOINT;
export class FlashcardService {
  private flashcardRepository = new FlashcardRepository();

  private flashcardDeckRepository = new FlashcardDeckRepository();

  private async getAudioUrlFromTTS(
    text: string,
    lang: string = "en_US"
  ): Promise<string | undefined> {
    try {
      const response = await axios.post(TTS_API_ENDPOINT!, {
        text: text,
        lang: lang,
      });
      const absoluteUrl: string = response.data.url;
      return absoluteUrl;
    } catch (error: any) {
      if (error.response) {
        console.error("TTS Service Error:", error.response.data);
      } else {
        console.error("TTS Service Connection Error:", error.message);
      }
      return undefined;
    }
  }
  public async createFlashcard(
    userId: string,
    flashcardData: {
      frontContent: string;
      backContent: string;
      exampleSentence?: string;

      deckId: string;
    }
  ): Promise<Flashcard> {
    const flashcardDeck =
      await this.flashcardDeckRepository.findFlashcardDeckById(
        flashcardData.deckId
      );
    if (!flashcardDeck) {
      throw Error("Flashcard Deck is not exitence!");
    }
    if (flashcardDeck.userId !== userId) {
      throw Error("Flashcard Deck does not belong to User!");
    }
    let audioUrlToSave;
    const wordToCheck = flashcardData.frontContent?.toLowerCase().trim();

    if (
      wordToCheck &&
      (englishWords === null || englishWords.has(wordToCheck))
    ) {
      // console.log(`Generating audio for valid word: ${wordToCheck}`);
      audioUrlToSave = await this.getAudioUrlFromTTS(
        flashcardData.frontContent,
        "en_US"
      );
    } else if (!audioUrlToSave && wordToCheck) {
      console.log(
        `Skipping audio for potentially invalid word: ${wordToCheck}`
      );
    }
    const finalFlashcardData = {
      ...flashcardData,
      audioUrl: audioUrlToSave!,
    };

    const newFlashcard = await this.flashcardRepository.createFlashcard(
      finalFlashcardData
    );

    return newFlashcard;
  }
  public async updateFlashcard(
    userId: string,
    flashcardData: {
      frontContent: string;
      backContent: string;
      exampleSentence?: string;
    },
    flashcardId: string
  ): Promise<Flashcard> {
    const flashcard = await this.flashcardRepository.findFlashcardById(
      flashcardId
    );
    if (!flashcard) {
      throw Error("Flashcard is not exitence!");
    }
    const flashcardDeck =
      await this.flashcardDeckRepository.findFlashcardDeckById(
        flashcard.deckId
      );
    if (flashcardDeck?.userId !== userId) {
      throw Error("Flashcard does not belong to user!");
    }
    let audioUrlToSave;

    const newWordToCheck = flashcardData.frontContent?.toLowerCase().trim();
    if (
      newWordToCheck &&
      newWordToCheck !== flashcard.frontContent?.toLowerCase().trim() &&
      (englishWords === null || englishWords.has(newWordToCheck))
    ) {
      // console.log(
      //   `Regenerating audio for updated valid word: ${newWordToCheck}`
      // );
      audioUrlToSave = await this.getAudioUrlFromTTS(
        flashcardData.frontContent,
        "en_US"
      );
    } else if (
      newWordToCheck &&
      newWordToCheck !== flashcard.frontContent?.toLowerCase().trim()
    ) {
      console.log(
        `Skipping audio regeneration for potentially invalid updated word: ${newWordToCheck}`
      );
    } else if (
      newWordToCheck === flashcard.frontContent?.toLowerCase().trim()
    ) {
      audioUrlToSave = flashcard.audioUrl;
    }
    const finalFlashcardData = {
      ...flashcardData,
      audioUrl: audioUrlToSave!,
    };

    const updateFlashcard = await this.flashcardRepository.updateFlashcard(
      finalFlashcardData,
      flashcardId
    );
    return updateFlashcard;
  }
  public async deleteFlashcard(id: string, userId: string): Promise<void> {
    try {
      const flashcard = await this.flashcardRepository.findFlashcardById(id);
      if (!flashcard) {
        throw Error("Flashcard is not exitence!");
      }
      const flashcardDeck =
        await this.flashcardDeckRepository.findFlashcardDeckById(
          flashcard.deckId
        );
      if (flashcardDeck?.userId !== userId) {
        throw Error("Flashcard does not belong to user!");
      }

      await this.flashcardRepository.deleteFlashcard(id);
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new Error(
          "Flashcard deck not found or user does not have permission."
        );
      }
      throw error;
    }
  }
}
