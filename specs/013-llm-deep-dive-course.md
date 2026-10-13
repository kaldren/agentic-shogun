# 013: Deep Dive into LLMs like ChatGPT course

**Status:** Done

## Goal

Give software developers a course that explains how LLMs like ChatGPT are built and why they behave the way they do: pretraining, post-training and reinforcement learning, and what each means for using LLMs in their work. It's based on Andrej Karpathy's video "Deep Dive into LLMs like ChatGPT" (https://www.youtube.com/watch?v=7xTGNNLPyMI).

## Requirements

- A second course for the Software developers role, "Deep Dive into LLMs like ChatGPT", listed before "AI apps on Azure" in the course switcher (spec 010).
- 4 sections and 20 lessons, following the video's order. Each lesson has 5–8 exercises.
- Each lesson mixes exercise types, picking the one that fits the idea:
  - **Multiple choice** for concepts and developer scenarios ("You're building X. What happens, or what should you do?").
  - **Ordering** (spec 011) for pipelines, loops and life cycles.
  - **Categorize** (spec 012) for telling related ideas apart.
  - **Architecture** (spec 007) for matching parts to their place in a diagram.
  - **System builder** (spec 008) for building a whole pipeline.
  - Every section uses at least three different types. Every lesson ends with at least one developer scenario.
- Outline (lesson titles may be polished while writing):
  - **Section 1: Pretraining: from the internet to a base model**
    1. Collecting the internet: crawling, filtering and cleaning web text (ordering, categorize, multiple choice)
    2. Tokenization: from bytes to tokens, vocabulary size vs sequence length (ordering, multiple choice)
    3. Inside the neural network: context window, next-token probabilities, parameters (architecture, multiple choice)
    4. Inference: sampling one token at a time, why answers vary (ordering, categorize, multiple choice)
    5. Training GPT-2: model size, data, compute and cost (multiple choice, categorize)
    6. Base models in action: document simulators, regurgitation, few-shot prompts (multiple choice, categorize)
  - **Section 2: Post-training: from base model to assistant**
    1. Conversations as training data: chat templates, labelers, synthetic data (ordering, categorize, multiple choice)
    2. Hallucinations and tools: why models make things up, saying "I don't know", web search (multiple choice, system builder)
    3. Knowledge vs working memory: parameters vs the context window (categorize, multiple choice)
    4. Knowledge of self: where a model's "identity" comes from (multiple choice)
    5. Models need tokens to think: spreading reasoning over tokens, using code for math (multiple choice, categorize, ordering)
    6. Tokens and jagged intelligence: spelling, counting and other surprising failures (multiple choice, categorize)
  - **Section 3: Reinforcement learning and thinking models**
    1. Why RL: the textbook analogy (architecture, multiple choice)
    2. How RL works: practice, check, reinforce (ordering, multiple choice)
    3. Thinking models: emergent reasoning, when to use one (multiple choice, categorize)
    4. AlphaGo and going past human examples (multiple choice)
    5. RLHF: reward models for tasks that can't be checked, and their limits (ordering, categorize, system builder, multiple choice)
  - **Section 4: Using LLMs as a developer**
    1. What's coming: multimodal models and agents (multiple choice)
    2. Tracking and choosing models: leaderboards, proprietary vs open-weight, running models locally (categorize, multiple choice)
    3. Capstone: the whole picture, from a prompt to an answer (system builder, ordering, multiple choice)
- Every exercise has a short explanation in plain language, written in our own words, not quoted from the video.
- Facts and numbers (dataset size, vocabulary size, model sizes, costs) match the video. Where the video's numbers have changed since, the explanation says "at the time of the video".
- The content is written in `content/course-llm-deep-dive.md` (in the same format as the other content files, with the source video linked at the top) and added to the seed data in the database.

## Acceptance criteria

- [x] A Software developers user sees "Deep Dive into LLMs like ChatGPT" in the course switcher, first, and "AI apps on Azure" second. Their progress in "AI apps on Azure" is unchanged.
- [x] The course shows 4 sections and 20 lessons in the order above. The first lesson is current and the others are locked.
- [x] Every lesson has 5–8 exercises and ends with a developer scenario. Every section uses at least three exercise types.
- [x] Every exercise can be answered correctly and has an explanation. Every lesson can be played to "Lesson complete!".
- [ ] Every fact and number in the content has been checked against the video. (Not done: the owner marked the spec Done without this check.)
- [x] `content/course-llm-deep-dive.md` and the database content match.
- [x] Applying the migrations to an empty Supabase project creates the course with all its exercises.
- [x] `pnpm lint` and `pnpm typecheck` pass.

## Out of scope

- Video clips, images or embedded parts of the video in lessons.
- New exercise types beyond specs 007, 008, 011 and 012.
- Translations, and courses for other roles.
- Changes to "AI apps on Azure".

## Notes

- Depends on specs 010, 011 and 012 being `Done`.
- Use the video's chapter timestamps to check facts while writing, e.g. tokenization at 0:07:47, base models at 0:42:52, hallucinations at 1:20:32, RL at 2:14:42, RLHF at 2:48:26.
- Distractors in the system builder and architecture exercises should be plausible LLM-pipeline parts (e.g. "Image classifier", "Reward model" where it doesn't belong), not cloud services.
- Added during implementation (owner's choice): architecture and system builder exercises take an optional `noun` (e.g. "part"/"parts", "stage"/"stages") for their cards. Without it they still say "services", so the Azure lessons are unchanged.
- Fact check: the content was written from the video's chapter outline, not the transcript. Numbers worth checking against the video: FineWeb ~44 TB / ~15T tokens (0:01:00), GPT-4 vocabulary ~100,277 (0:07:47), GPT-2 ~1.6B parameters, 1,024-token context, ~$40,000 in 2019 vs a few hundred dollars now (0:31:09).
