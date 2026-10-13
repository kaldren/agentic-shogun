# Course: Deep Dive into LLMs like ChatGPT

Content for spec 013. It becomes the seed data in the database
(`supabase/migrations/20261013210000_course_llm_deep_dive.sql`). Based on Andrej Karpathy's video
[Deep Dive into LLMs like ChatGPT](https://www.youtube.com/watch?v=7xTGNNLPyMI); the timestamps point to the
part of the video each lesson covers. All text is our own.

In multiple choice, the correct answer is marked with **✓**. In ordering, steps are
listed in the mixed order the learner sees, with their correct position in brackets.
In categorize, each item shows its correct group after **→**. In architecture,
each slot lists its correct card after **→**. In system builder, nodes marked **✓**
belong on the canvas; the others are distractors.

- **Role:** Software developers
- **Course:** Deep Dive into LLMs like ChatGPT

## Section 1: Pretraining: from the internet to a base model

### Lesson 1.1: Collecting the internet

Video: 0:01:00

#### 1.1.1 (multiple choice)

**Question:** Where does most of the text for pretraining an LLM come from?

- Private chats from people using the app
- Only books scanned from libraries
- Text the model wrote about itself
- Public web pages, collected by crawlers and then cleaned ✓

**Explanation:** Pretraining starts from a huge crawl of the public web (for example Common Crawl). That raw crawl is then cleaned and filtered into a training dataset.

#### 1.1.2 (ordering)

**Question:** Put the steps of building a pretraining dataset in order.

**Scenario:** You start with billions of raw web pages and want clean, useful text at the end.

**Steps, as shown (correct position):**

- Remove duplicate pages (5)
- Crawl public web pages (1)
- Remove personal information (6)
- Block unwanted sites by their URL (2)
- Keep pages in the languages you want (4)
- Pull the plain text out of the HTML (3)

**Explanation:** First you collect pages, then drop whole sites you never want (spam, malware, adult content). Next you strip the HTML down to text, keep the right languages, remove near-copies and finally scrub personal details such as addresses and phone numbers.

#### 1.1.3 (categorize)

**Question:** Which of these end up in the training data, and which are filtered out?

**Groups:** Keep for training, Filter out

**Items, as shown:**

- A page from a known spam site → Filter out
- A step-by-step cooking guide → Keep for training
- Someone's home address and phone number → Filter out
- A detailed encyclopedia article → Keep for training
- Navigation menus and HTML markup → Filter out
- A forum thread explaining a math problem → Keep for training

**Explanation:** The goal is lots of varied, good-quality text. Spam, page markup and personal details add nothing useful and can do harm, so they are removed before training.

#### 1.1.4 (multiple choice)

**Question:** Why do teams filter the web data so carefully?

- The model learns the patterns in its data, so junk in means junk out ✓
- Filtering makes the model run faster after training
- The law requires every page to be read by a person
- Unfiltered text can't be turned into tokens

**Explanation:** An LLM picks up whatever patterns are in its training text. Clean, diverse, high-quality data leads to a better model, so the effort goes into the data first.

#### 1.1.5 (multiple choice)

**Question:** Roughly how big is a large, filtered web dataset like FineWeb?

- There is no limit, it is the whole internet
- About 44 TB of text, around 15 trillion tokens ✓
- About 44 MB, the size of a few books
- About 44 GB, the size of a movie collection

**Explanation:** At the time of the video, FineWeb was about 44 TB, roughly 15 trillion tokens. It's huge, but after filtering it's far smaller than the whole web and fits on a few large hard drives.

#### 1.1.6 (multiple choice, developer scenario)

**Question:** Your team wants to train a small model on your company's support tickets. A colleague suggests using every ticket as-is, without cleaning. What's the main risk?

- Training will be faster, but nothing else changes
- The model will refuse to answer support questions
- The model learns repeated boilerplate and may reproduce customers' personal data ✓
- The tickets can't be split into tokens

**Explanation:** The same cleaning steps apply to your own data: remove duplicates, signatures and noise, and scrub personal information. Otherwise the model learns the noise and can leak private details.

### Lesson 1.2: Tokenization

Video: 0:07:47

#### 1.2.1 (multiple choice)

**Question:** Why is text turned into tokens before it goes into the network?

- Tokens hide the text from the people training the model
- Tokens remove the grammar so the model can learn faster
- The network works with a fixed set of symbols, so text must become a sequence of them ✓
- Each token stores a full sentence

**Explanation:** A neural network takes a sequence of symbols from a fixed vocabulary. Tokenization turns any text into such a sequence of token IDs, and back again.

#### 1.2.2 (ordering)

**Question:** Put these ways of representing text in order, from the longest sequence to the shortest.

**Steps, as shown (correct position):**

- Bytes: 256 possible symbols, 8 times shorter (2)
- Byte pair encoding: common pairs merged into new symbols (3)
- Tokens: about 100,000 symbols, a much shorter sequence (4)
- Bits: only 0 and 1, a very long sequence (1)

**Explanation:** Every step trades a longer sequence for more symbols. Grouping bits into bytes shortens the sequence 8 times, and byte pair encoding keeps merging common pairs until the vocabulary is around 100,000 tokens.

#### 1.2.3 (multiple choice)

**Question:** Byte pair encoding keeps merging frequent pairs of symbols into new symbols. What does that give you?

- Perfect spelling for every word
- One token for every word in every language
- Longer sequences, in exchange for a smaller vocabulary
- Shorter sequences, in exchange for a bigger vocabulary ✓

**Explanation:** Each merge adds a symbol to the vocabulary and makes texts shorter. Shorter sequences matter because the network can only look at a limited number of tokens at once, and each token costs compute.

#### 1.2.4 (multiple choice)

**Question:** About how many different tokens does the GPT-4 tokenizer have?

- About 100,000 ✓
- 256
- Exactly one per English word
- About 10 million

**Explanation:** The GPT-4 tokenizer has a vocabulary of about 100,000 tokens (100,277 at the time of the video). Many common words are a single token, while rare words are split into several.

#### 1.2.5 (categorize)

**Question:** You type "hello world" into a tokenizer viewer. Which changes give you a different token sequence?

**Groups:** Different tokens, Same tokens

**Items, as shown:**

- Capitalizing it as "Hello world" → Different tokens
- Adding an extra space before "world" → Different tokens
- Copying the same text into another app → Same tokens
- Typing exactly "hello world" again → Same tokens
- Writing "hello there" instead → Different tokens

**Explanation:** Tokens depend on the exact characters, including case and spaces. The same text always gives the same tokens, but small edits can change them.

#### 1.2.6 (multiple choice, developer scenario)

**Question:** Your app sends long prompts to an LLM API that charges per token. Which change lowers the bill without losing information?

- Write the prompt in ALL CAPS
- Split the same text into many smaller requests
- Remove the boilerplate text you repeat in every prompt ✓
- Replace every space with an underscore

**Explanation:** You pay for tokens, so sending fewer tokens costs less. Odd formatting usually creates more tokens, and splitting the same text into requests doesn't reduce them.

### Lesson 1.3: Inside the neural network

Video: 0:14:27

#### 1.3.1 (architecture)

**Question:** Drag each part to its place in one training step.

**Scenario:** During pretraining, the network sees a window of tokens from the dataset and has to predict the token that comes next. Then it learns from the right answer.

**Flow "Predict the next token":** Input → Model → Output

**Flow "Learn from the answer":** Output + Right answer → Learning step

**Slots:**

- Input → A window of token IDs from the data
- Model → A neural network with billions of parameters
- Output → A probability for every token in the vocabulary
- Right answer → The token that actually came next
- Learning step → Nudge the parameters toward the right token

**Distractors:** A database of facts, A person typing the answer, A search engine query

**Explanation:** Tokens go in, and the network gives a probability for every possible next token. The real next token from the data is the right answer, and the parameters are nudged so that token gets a slightly higher probability next time.

#### 1.3.2 (multiple choice)

**Question:** What does the network output for a position in the sequence?

- The ID of the web page the text came from
- A probability for every token in the vocabulary ✓
- A yes or no answer
- One finished sentence

**Explanation:** The output is a list of about 100,000 numbers, one per token in the vocabulary, saying how likely each one is to come next.

#### 1.3.3 (multiple choice)

**Question:** What actually changes while the model trains?

- The number of layers in the network
- The tokens in its vocabulary
- The text of the training data
- The values of its parameters ✓

**Explanation:** Training only adjusts the parameters, the billions of numbers inside the network. The architecture, the vocabulary and the data stay the same.

#### 1.3.4 (multiple choice)

**Question:** What is the context window?

- The list of websites the model was trained on
- The time limit for an answer
- The maximum number of tokens the network can look at at once ✓
- The browser window where the chat runs

**Explanation:** The network reads a limited window of tokens. Anything outside the window simply isn't visible to it when it predicts the next token.

#### 1.3.5 (categorize)

**Question:** Which of these are chosen by the people designing the model, and which are learned in training?

**Groups:** Chosen by the designers, Learned in training

**Items, as shown:**

- The size of the context window → Chosen by the designers
- Which next tokens the model finds likely → Learned in training
- The tokenizer's vocabulary → Chosen by the designers
- How the layers of the network are connected → Chosen by the designers
- The values of the billions of parameters → Learned in training

**Explanation:** The designers fix the shape of the network, the context size and the tokenizer before training. Training then tunes the parameters, and those parameters decide which next tokens look likely.

#### 1.3.6 (multiple choice, developer scenario)

**Question:** You send a 300-page manual to a model whose context window is much smaller than the manual. What happens?

- It learns the manual permanently for future chats
- It reads all of it, just more slowly
- It compresses the manual automatically without losing anything
- It can't see the whole manual at once, so you need to split it or pick the relevant parts ✓

**Explanation:** Text beyond the context window doesn't fit. APIs reject or cut it, so apps send only the relevant parts, for example with retrieval.

### Lesson 1.4: Inference

Video: 0:26:01

#### 1.4.1 (ordering)

**Question:** Put the steps of generating an answer in order.

**Steps, as shown (correct position):**

- Run the network to get next-token probabilities (2)
- Repeat until a stop token or a length limit (5)
- Sample one token from those probabilities (3)
- Add the token to the end of the sequence (4)
- Turn the prompt into tokens (1)

**Explanation:** Generation is a loop. The model predicts probabilities, one token is picked, it's added to the text, and the longer text goes back in to predict the next token.

#### 1.4.2 (multiple choice)

**Question:** You send the same prompt twice and get two different answers. Why?

- The model remembers it already answered and tries something new
- The tokenizer splits the prompt differently each time
- The model changed its parameters after the first answer
- Each next token is sampled from probabilities, so each run can take a different path ✓

**Explanation:** Inference is random by design. Picking a different token early on leads to a different continuation, even with the same prompt and the same model.

#### 1.4.3 (multiple choice)

**Question:** What happens to the model's parameters while you chat with it?

- They update once a day from all chats
- Nothing, they stay fixed and are only read ✓
- They reset at the start of every chat
- They update after every message

**Explanation:** Training is over when you use the model. During inference the parameters are fixed; only the text in the context changes.

#### 1.4.4 (categorize)

**Question:** Does each of these belong to training or to inference?

**Groups:** Training, Inference

**Items, as shown:**

- Picks tokens by sampling from the output → Inference
- Compares predictions with the real next token → Training
- Needs a huge GPU cluster for months → Training
- Parameters change after each step → Training
- Generates text one token at a time → Inference
- Runs every time a user sends a message → Inference

**Explanation:** Training is the long, expensive phase that tunes the parameters. Inference is what happens on every request: a fixed model generates tokens one by one.

#### 1.4.5 (multiple choice)

**Question:** Why does generated text sound like its training data but rarely copies it word for word?

- The training data is deleted after training
- Sampling remixes the patterns the model learned instead of looking documents up ✓
- The model checks every sentence against the internet
- The model is forbidden to use real sentences

**Explanation:** The model doesn't store and fetch documents. It produces new text that follows the statistics of what it saw, so the output is similar in style but usually not identical.

#### 1.4.6 (multiple choice, developer scenario)

**Question:** A test checks that your LLM feature returns one exact sentence. It passes sometimes and fails sometimes. What's the most likely reason?

- The API is returning cached answers from other users
- The output is sampled, so the wording varies between runs ✓
- The model is learning from your test runs
- The test runner changes the prompt

**Explanation:** Sampling makes LLM output vary. Test for meaning, structure or required fields instead of exact text, or reduce randomness where the API allows it.

### Lesson 1.5: Training GPT-2

Video: 0:31:09

#### 1.5.1 (multiple choice)

**Question:** GPT-2 came out in 2019. About how many parameters did its largest version have?

- About 16 thousand
- About 1.6 trillion
- About 1.6 billion ✓
- About 1.6 million

**Explanation:** GPT-2 had about 1.6 billion parameters (often rounded to 1.5 billion). Today's large models have hundreds of billions or more.

#### 1.5.2 (multiple choice)

**Question:** How long was GPT-2's context window?

- 1,024 tokens ✓
- Unlimited
- 1 million tokens
- 10 tokens

**Explanation:** GPT-2 could look at 1,024 tokens at once. Modern models handle hundreds of thousands of tokens or more.

#### 1.5.3 (multiple choice)

**Question:** During training you watch a number called the loss. What do you want it to do?

- Go down, because the model is getting better at predicting the next token ✓
- Go up, because the model is learning more
- Jump around as much as possible
- Stay exactly the same

**Explanation:** The loss measures how wrong the next-token predictions are. A falling loss means the model gives higher probability to the tokens that really come next.

#### 1.5.4 (categorize)

**Question:** What raises the cost of pretraining a model, and what lowers it?

**Groups:** Raises the cost, Lowers the cost

**Items, as shown:**

- More training tokens → Raises the cost
- Software that keeps the GPUs busy → Lowers the cost
- Faster GPUs → Lowers the cost
- More parameters → Raises the cost
- Training for more steps → Raises the cost
- Cleaner, better datasets → Lowers the cost

**Explanation:** Bigger models, more data and more steps all mean more computation. Faster hardware, better data and better software get the same result with less money.

#### 1.5.5 (multiple choice)

**Question:** Why is training done on GPUs?

- Training is a huge number of simple math operations that GPUs run in parallel ✓
- GPUs check the model's answers for mistakes
- GPUs store the training data permanently
- GPUs are the only chips that can read text

**Explanation:** A training step is mostly large matrix multiplications. GPUs do thousands of these operations at the same time, which is why labs build huge GPU clusters.

#### 1.5.6 (multiple choice)

**Question:** Training GPT-2 cost about $40,000 in 2019. What did a similar run cost at the time of the video?

- A few hundred dollars or less ✓
- About the same, $40,000
- Around $4 million
- It was no longer possible

**Explanation:** Better data, faster GPUs and better software made the same training run hundreds of times cheaper in a few years.

#### 1.5.7 (multiple choice, developer scenario)

**Question:** Your manager asks if you could pretrain your own frontier-class model for a side project. What's the realistic answer?

- No. That takes thousands of GPUs for months, so start from an existing model instead ✓
- Yes, if you use a smaller tokenizer
- Yes, a laptop can do it over a weekend
- Yes, pretraining is cheap now, only fine-tuning is expensive

**Explanation:** Small models like GPT-2 are now cheap to train, but frontier models still need enormous compute. For product work, you use or fine-tune existing models.

### Lesson 1.6: Base models in action

Video: 0:42:52

#### 1.6.1 (multiple choice)

**Question:** What is a base model?

- A small model used to test the tokenizer
- A helpful assistant that answers questions
- A search engine over its training data
- A document simulator: it continues any text with likely next tokens ✓

**Explanation:** Pretraining produces a base model. It has learned what internet text looks like and continues whatever you give it, but it wasn't trained to act as an assistant.

#### 1.6.2 (multiple choice)

**Question:** You type "What is 2 + 2?" into a base model. What is most likely to happen?

- It answers "4" and stops, like an assistant
- It continues the text like a web page might, for example with more questions ✓
- It refuses to answer
- It asks you what you mean

**Explanation:** A base model doesn't know it's being asked something. It just continues the document, which could be a quiz page, a forum post or a list of questions.

#### 1.6.3 (multiple choice)

**Question:** You paste the opening sentence of a famous Wikipedia article into a base model, and it continues almost word for word. Why?

- The model looks the article up online
- It's a coincidence
- The model has a copy of Wikipedia attached
- Popular high-quality pages appear many times in training, so the model memorized them ✓

**Explanation:** Text the model sees many times can end up memorized in its parameters. That's called regurgitation, and it's usually not what you want.

#### 1.6.4 (multiple choice)

**Question:** You ask a base model about something that happened after its training data was collected. What happens?

- It searches the web for the answer
- It refuses to continue
- It says it doesn't know
- It makes up a plausible continuation, because it never saw those events ✓

**Explanation:** The model has no knowledge after its cutoff, but it still has to produce likely next tokens. So it writes something that sounds right, a confident guess.

#### 1.6.5 (multiple choice)

**Question:** Which prompt gets a base model to translate a new English word into Korean most reliably?

- "You are a translator."
- Ten lines like "apple: 사과", followed by "teacher:" ✓
- "teacher"
- "Translate teacher into Korean please."

**Explanation:** A base model is great at continuing patterns. A list of examples (a few-shot prompt) makes the next line's pattern obvious, so the likeliest continuation is the translation.

#### 1.6.6 (categorize)

**Question:** Is each of these about a base model or an assistant model?

**Groups:** Base model, Assistant model

**Items, as shown:**

- Was fine-tuned on example conversations → Assistant model
- Is the direct result of pretraining → Base model
- Continues any text with likely next tokens → Base model
- Declines some harmful requests → Assistant model
- Can act like an assistant if the prompt looks like a chat transcript → Base model
- Answers questions in a helpful, chat-like way → Assistant model

**Explanation:** The base model knows a lot but only continues documents. The assistant is the same knowledge after post-training on conversations, which gives it its helpful, safer behavior.

#### 1.6.7 (multiple choice, developer scenario)

**Question:** You need varied, natural-sounding forum posts to load-test your search feature, but an assistant model keeps writing in the same polite style. What could help?

- Asking the assistant to be polite
- Turning off tokenization
- A base model, prompted with a few real-looking example posts ✓
- A bigger context window

**Explanation:** Base models continue documents in their own style, so a few example posts produce many varied new ones. Assistants are tuned toward one helpful voice.

## Section 2: Post-training: from base model to assistant

### Lesson 2.1: Conversations as training data

Video: 1:01:06

#### 2.1.1 (multiple choice)

**Question:** Post-training turns a base model into an assistant. What data does it train on?

- Example conversations: prompts with ideal assistant answers ✓
- Lists of facts with no questions
- The chats of real users, without review
- More web pages, like in pretraining

**Explanation:** The model keeps training, now on a dataset of conversations. It learns to answer in the way those example answers do.

#### 2.1.2 (ordering)

**Question:** How does one conversation become training data? Put the steps in order.

**Steps, as shown (correct position):**

- The template is turned into one sequence of tokens (3)
- The model is trained to predict the assistant's tokens (4)
- The conversation is wrapped in a chat template with special tokens (2)
- A person writes a prompt and an ideal answer, following guidelines (1)

**Explanation:** Conversations are written first, then formatted with special tokens that mark each turn, then tokenized. Training then works just like pretraining: predict the next token.

#### 2.1.3 (multiple choice)

**Question:** Why does a chat template add special tokens around each message?

- To mark where each turn starts and ends and who is speaking ✓
- To tell the model which website the chat came from
- To make the text shorter
- To encrypt the conversation

**Explanation:** The network only sees one long sequence of tokens. Special tokens mark the user and assistant turns, so the model knows when it's its turn and when to stop.

#### 2.1.4 (categorize)

**Question:** Is each of these about pretraining or post-training on conversations?

**Groups:** Pretraining, Post-training

**Items, as shown:**

- Can take hours, on far less data → Post-training
- Takes months on thousands of GPUs → Pretraining
- Gives the model most of its knowledge → Pretraining
- Trains on example conversations → Post-training
- Trains on internet documents → Pretraining
- Gives the model its assistant style → Post-training

**Explanation:** Pretraining is the big, expensive step that builds knowledge. Post-training is much smaller and cheaper, and it shapes how the model behaves and responds.

#### 2.1.5 (multiple choice)

**Question:** The people who write example answers follow guidelines such as being helpful, truthful and harmless. What does that mean for the answers you get?

- The guidelines are only used for marketing
- Every answer was checked by a person before you see it
- The assistant imitates how a skilled person following those guidelines would answer ✓
- The assistant has its own opinions on what's helpful

**Explanation:** The assistant learned from examples written under those guidelines. Its answers are a statistical imitation of that kind of person, not a person checking your specific answer.

#### 2.1.6 (multiple choice)

**Question:** Where does most of the conversation data for modern assistants come from?

- Copied from public chat apps
- Mostly generated by LLMs, then checked and edited by people ✓
- Only written by hand by human labelers
- Generated at random

**Explanation:** Early datasets were written by hand. Today, models draft much of the data and people review and fix it, which makes it possible to build very large datasets.

#### 2.1.7 (multiple choice, developer scenario)

**Question:** Your company wants its internal assistant to always answer in short bullet points with links to the wiki. What's the post-training way to get that?

- Fine-tune it on many example conversations that answer in that format ✓
- Add more web pages to the training data
- Pretrain a new model from scratch
- Make the context window larger

**Explanation:** Post-training teaches style and format through examples. A set of conversations written the way you want is the direct way to change how the assistant answers.

### Lesson 2.2: Hallucinations and tools

Video: 1:20:32

#### 2.2.1 (multiple choice)

**Question:** You ask an assistant about a person who doesn't exist, and it writes a confident biography. Why?

- The tokenizer mixed up the name
- It's lying on purpose
- It learned the confident style of answers in its training, even for things it doesn't know ✓
- It found a real person with that name online

**Explanation:** In the training conversations, questions like that are answered confidently. Without special training, the model copies that style, even when it has nothing to base the answer on.

#### 2.2.2 (multiple choice)

**Question:** How can model makers teach a model to say "I don't know"?

- Make the model bigger until it knows everything
- Remove all hard questions from the training data
- Find questions it gets wrong by testing it, and train on examples where the answer is "I don't know" ✓
- Tell users to ask simpler questions

**Explanation:** You can probe what the model actually knows. Where it keeps getting things wrong, you add training examples that refuse to guess, so it learns to link its own uncertainty to saying so.

#### 2.2.3 (system builder)

**Question:** Build an assistant that can look things up: add the parts you need and connect them.

**Scenario:** The assistant should search the web instead of guessing. When it needs facts, the model writes a search query, your app runs it, and the results go back into the model's context before it answers.

**Nodes (name — role), in palette order:**

- Search tool — Runs the query ✓
- Image generator — Creates pictures
- GPU cluster — Pretrains the model
- Language model — Writes answers and queries ✓
- Tokenizer trainer — Builds a new vocabulary
- Chat app — Sends messages, shows answers ✓
- Context window — Holds the chat and the results ✓

**Connections:**

- Chat app → Context window
- Context window → Language model
- Language model → Search tool
- Search tool → Context window
- Language model → Chat app

**Explanation:** The user's message goes into the context, and the model reads it. When it needs facts, it writes a query, the search tool runs it and the results are added to the context. The model then answers from text it can actually see.

#### 2.2.4 (multiple choice)

**Question:** When a model uses a search tool, where do the search results go?

- Straight to the user, without the model seeing them
- Into the context window, where the model can read them while it answers ✓
- Into the model's parameters, permanently
- Into the tokenizer's vocabulary

**Explanation:** Tool results are pasted into the conversation. The model reads them like any other text in its context, which is far more reliable than recalling facts from its parameters.

#### 2.2.5 (multiple choice)

**Question:** Which question is a model without tools most likely to answer with made-up facts?

- "What is the capital of France?"
- "What did the mayor of a small town say at last week's council meeting?" ✓
- "Write a short poem about the sea."
- "Explain what a for loop does."

**Explanation:** Obscure, specific and recent facts are the riskiest. The model likely never saw them, but it will still produce a fluent answer.

#### 2.2.6 (multiple choice, developer scenario)

**Question:** Your support bot invents return policies that don't exist. Which fix targets the cause?

- Make its answers shorter
- Ask users to rephrase their questions
- Put the real policy documents into the context, and tell it to say when the answer isn't there ✓
- Ask it to answer more confidently

**Explanation:** The bot guesses because the policies aren't in front of it. Giving it the real documents, plus permission to say "I don't know", removes the reason to make things up.

### Lesson 2.3: Knowledge vs working memory

Video: 1:20:32

#### 2.3.1 (multiple choice)

**Question:** What is knowledge stored in the model's parameters most like?

- A vague memory of something you read a long time ago ✓
- Notes you're looking at right now
- A perfect copy of every web page
- A database you can query exactly

**Explanation:** Pretraining compresses a huge amount of text into the parameters. What's left is a fuzzy recollection: good for common things, unreliable for details.

#### 2.3.2 (multiple choice)

**Question:** What is text in the context window most like?

- A new part of the model's parameters
- Background noise the model ignores
- Working memory: the model can use it directly and precisely ✓
- Long-term memory that lasts after the chat

**Explanation:** Everything in the context is directly available while the model generates. That's why answers about text you paste in are much more accurate.

#### 2.3.3 (categorize)

**Question:** Where does each kind of information live?

**Groups:** In the parameters (vague memory), In the context window (working memory)

**Items, as shown:**

- Search results a tool just returned → In the context window (working memory)
- A general sense of grammar and style → In the parameters (vague memory)
- Earlier messages in this conversation → In the context window (working memory)
- Facts from web pages seen in pretraining → In the parameters (vague memory)
- A document you paste into the chat → In the context window (working memory)
- A famous book it read many times in training → In the parameters (vague memory)

**Explanation:** Anything learned in training lives in the parameters. Anything in the current conversation, including pasted text and tool results, sits in the context window.

#### 2.3.4 (multiple choice)

**Question:** You want a good summary of chapter 3 of a book. What gives the best result?

- Ask the model to guess what chapter 3 is about
- Paste the chapter into the prompt and ask for a summary ✓
- Ask for a summary of the whole book
- Ask for a summary of chapter 3 from memory

**Explanation:** With the chapter in the context, the model works from the actual text, not from a vague memory of it.

#### 2.3.5 (multiple choice, developer scenario)

**Question:** You ask a model about functions in your company's private library, and it invents some that don't exist. What's the fix?

- Tell the model the library is important
- Ask the same question more politely
- Put the library's real docs or source code into the context ✓
- Use a model with more parameters

**Explanation:** The model never saw your private code in training, so it can only guess. Giving it the real code turns guessing into reading.

### Lesson 2.4: Knowledge of self

Video: 1:41:46

#### 2.4.1 (multiple choice)

**Question:** You ask an open model "Who made you?" and it says it's ChatGPT by OpenAI, but it isn't. Why?

- It looked up the answer online
- It was secretly made by OpenAI
- It's trying to trick you
- Without training data about itself, it gives the most common answer it saw on the internet ✓

**Explanation:** The model has no built-in sense of identity. If its makers didn't teach it one, it falls back on what is statistically likely, and the internet talks about ChatGPT a lot.

#### 2.4.2 (multiple choice)

**Question:** Does a model remember you between separate chats?

- Only if you mention your name
- Yes, it learns from every chat
- Yes, but only for paying users
- Not by itself. Each chat starts from the same fixed parameters, unless the app adds memory to the context ✓

**Explanation:** The parameters don't change while you chat. Any memory features work by putting saved notes back into the context of a new chat.

#### 2.4.3 (multiple choice)

**Question:** How do model makers give a model the right name and creator?

- It reads its own source code
- They train it on conversations about its identity, or put that information in a system message ✓
- They can't, it's random
- The model picks a name during pretraining

**Explanation:** Identity is added on purpose: either with example conversations about who the assistant is, or with hidden instructions at the start of each chat.

#### 2.4.4 (multiple choice)

**Question:** What's the best way to think about an LLM's "self"?

- It's a person who lives inside the computer
- It's a copy of the people who wrote its training data
- It's the same as the company that made it
- There's no lasting self. It generates each answer from its parameters and the current context ✓

**Explanation:** An LLM is a token predictor that starts fresh with every conversation. Its "personality" is a pattern learned in training, not a continuous being.

#### 2.4.5 (multiple choice, developer scenario)

**Question:** You build a support assistant on an open model and want it to introduce itself as "Ada from Acme". What's the simplest way?

- Put the name and role in the system message of every conversation ✓
- Pretrain the model on Acme's website
- Ask users to call it Ada
- Rename the model file

**Explanation:** A system message is in the context of every chat, so the model reliably uses that identity. Fine-tuning works too, but it's far more effort.

### Lesson 2.5: Models need tokens to think

Video: 1:46:56

#### 2.5.1 (multiple choice)

**Question:** Why can't a model do a lot of reasoning while producing a single token?

- The model is not allowed to think
- Reasoning only happens during training
- Each token gets the same, limited amount of computation ✓
- Tokens are too short to hold numbers

**Explanation:** Producing one token is one pass through the network, with a fixed amount of computation. Hard problems need that work spread over many tokens.

#### 2.5.2 (multiple choice)

**Question:** Sam buys 4 notebooks and 3 pens for $19. A pen costs $1. Which example answer is better to train a model on?

- "$4."
- "The pens cost 3 × $1 = $3. That leaves $19 − $3 = $16 for the notebooks, so each costs $16 ÷ 4 = $4." ✓
- "Each notebook costs $4. The pens cost $3, so the notebooks cost $16, and $16 ÷ 4 = $4."
- "Notebooks usually cost about $4."

**Explanation:** Working first and answering last lets the model build up the result over many tokens. Stating the answer first forces it to compute everything in one token, and the explanation afterwards can't fix a wrong guess.

#### 2.5.3 (ordering)

**Question:** Put this worked solution in a good order for a model to learn from.

**Scenario:** Sam buys 4 notebooks and 3 pens for $19 in total. A pen costs $1. How much is one notebook?

**Steps, as shown (correct position):**

- Subtract it from the total: $19 − $3 = $16 (2)
- Split the rest among the notebooks: $16 ÷ 4 = $4 (3)
- State the answer: one notebook costs $4 (4)
- Work out the cost of the pens: 3 × $1 = $3 (1)

**Explanation:** Each step only needs a little computation and builds on the one before. The final answer comes last, when all the work is already in the context.

#### 2.5.4 (categorize)

**Question:** Which tasks can you just ask for, and which should the model solve with code?

**Groups:** Just ask, Ask it to use code

**Items, as shown:**

- Count how often "error" appears in a 5,000-line log → Ask it to use code
- Multiply two 9-digit numbers → Ask it to use code
- Suggest names for a new feature → Just ask
- Explain what a REST API is → Just ask
- Add up 40 prices from a table → Ask it to use code
- Summarize a short email → Just ask

**Explanation:** Language tasks suit the model well. Exact calculations and counting are where mental math in tokens breaks down, and code gets them exactly right.

#### 2.5.5 (multiple choice)

**Question:** Why is it more reliable to let the model use a code tool for arithmetic?

- Code is shorter than text, so it's cheaper
- The model is not allowed to do math in text
- Code makes the model's parameters bigger
- The code runs exactly, instead of the model doing mental math in a few tokens ✓

**Explanation:** The model writes the code, and an interpreter runs it with exact results. That moves the hard part to a tool that can't make arithmetic slips.

#### 2.5.6 (multiple choice, developer scenario)

**Question:** Your app asks the model to return only the final number for a multi-step pricing question, and it's often wrong. What should you change?

- Ask for the answer in bold
- Let it reason step by step or use code first, then pick out the final number ✓
- Use a shorter prompt
- Ask it to answer faster

**Explanation:** Forcing an instant answer leaves no tokens for the work. Let the model show its steps (or call code), then parse the result in your code.

### Lesson 2.6: Tokens and jagged intelligence

Video: 2:01:11

#### 2.6.1 (multiple choice)

**Question:** Why do models often miscount the letters in a word like "strawberry"?

- The word is too long for the context window
- Counting is turned off in chat
- They never saw the word in training
- They see tokens, chunks of characters, not individual letters ✓

**Explanation:** "strawberry" is only a few tokens for the model. It never looks at the letters one by one, so letter-level questions are surprisingly hard for it.

#### 2.6.2 (multiple choice)

**Question:** A model solves a hard coding problem but then says 9.11 is bigger than 9.9. What's the best way to think about this?

- It only fails when the internet is slow
- The model is lying on purpose
- Its abilities are jagged: very strong in places, with surprising holes, so check its work ✓
- The model is broken and shouldn't be used

**Explanation:** LLM skills don't grow evenly like a person's. They can be brilliant at hard tasks and fail at easy ones, so treat them as powerful tools whose output you verify.

#### 2.6.3 (categorize)

**Question:** Which tasks is a model likely to handle well, and which might trip it up?

**Groups:** Likely fine, Likely to trip it up

**Items, as shown:**

- Count the letters in a long word → Likely to trip it up
- Compare decimals like 9.11 and 9.9 → Likely to trip it up
- Explain the difference between a list and a set → Likely fine
- Reverse the characters of a string → Likely to trip it up
- Translate a common phrase into Spanish → Likely fine
- Rewrite a paragraph in a friendlier tone → Likely fine

**Explanation:** Tasks about meaning and language play to the model's strengths. Tasks about individual characters or exact comparisons hit the limits of tokens and single-token reasoning.

#### 2.6.4 (multiple choice)

**Question:** What's a reliable way to get a character-level task right, like counting letters?

- Ask it to think harder in one word
- Write the question in capital letters
- Ask the model to solve it with a short piece of code ✓
- Ask the same question several times

**Explanation:** Code works on actual characters, so a tiny script gives the exact answer. The model just has to write the code, which it's good at.

#### 2.6.5 (multiple choice, developer scenario)

**Question:** Your app uses an LLM to check that user IDs have exactly 12 characters, and some wrong IDs get through. What should you do?

- Check the length in normal code, and use the model only where you need language understanding ✓
- Send each ID twice
- Use a model with a bigger context window
- Ask the model to be more careful

**Explanation:** Exact rules belong in deterministic code. Use the LLM for fuzzy language tasks, and don't rely on it for character counting.

## Section 3: Reinforcement learning and thinking models

### Lesson 3.1: Why RL: the textbook analogy

Video: 2:07:28

#### 3.1.1 (architecture)

**Question:** Drag each training stage to the part of a textbook it works like.

**Scenario:** A good textbook teaches in three ways: it explains the topic, it shows worked examples, and it gives practice problems with the answers at the back. Training an LLM follows the same idea.

**Flow "How you learn from a textbook":** Explanations that cover the topic → Worked examples with full solutions → Practice problems with only the final answer

**Slots:**

- Explanations that cover the topic → Pretraining
- Worked examples with full solutions → Supervised fine-tuning
- Practice problems with only the final answer → Reinforcement learning

**Distractors:** Inference, Tokenization

**Explanation:** Pretraining is like reading the explanations: broad knowledge. Supervised fine-tuning is like studying an expert's worked examples. Reinforcement learning is like doing practice problems: you try, check the answer and learn what works.

#### 3.1.2 (multiple choice)

**Question:** What can't supervised fine-tuning teach well on its own?

- How to answer in a conversation
- How to use the chat template
- What a helpful answer looks like
- Which way of solving a problem works best for the model itself ✓

**Explanation:** Fine-tuning copies human-written solutions. It can't find out which reasoning steps actually work best for the model's own way of processing tokens.

#### 3.1.3 (multiple choice)

**Question:** What do practice problems give a learner that worked examples don't?

- A full solution to copy
- The chance to try their own approach and check it against the answer ✓
- A shorter textbook
- More background explanations

**Explanation:** With practice problems, you find your own path to the answer. That's what reinforcement learning gives the model.

#### 3.1.4 (multiple choice)

**Question:** In what order are the training stages of a modern LLM usually run?

- All three at the same time
- Pretraining, then supervised fine-tuning, then reinforcement learning ✓
- Fine-tuning, then pretraining, then reinforcement learning
- Reinforcement learning, then pretraining, then fine-tuning

**Explanation:** Each stage builds on the previous one: knowledge first, then the assistant format, then practice that sharpens problem solving.

#### 3.1.5 (multiple choice, developer scenario)

**Question:** You want a model that's better at your team's tricky SQL puzzles, and you can automatically check whether a query returns the right rows. Which training approach fits best?

- More pretraining on random web pages
- Reinforcement learning: let it try many queries and reward the ones that return the right rows ✓
- Removing the chat template
- A bigger tokenizer

**Explanation:** An automatic check of the answer is exactly what RL needs. The model can practice many attempts and learn from the ones that work.

### Lesson 3.2: How RL works

Video: 2:14:42

#### 3.2.1 (ordering)

**Question:** Put the steps of the reinforcement learning loop in order.

**Steps, as shown (correct position):**

- Train the model on the solutions that worked (4)
- Check which solutions reach the right answer (3)
- Give the model a problem with a known answer (1)
- Repeat with many more problems (5)
- Let it write many different solutions (2)

**Explanation:** The model practices: it tries a problem many times, the attempts are checked, and the successful ones are reinforced so they become more likely. Over many problems, it gets better at solving them.

#### 3.2.2 (multiple choice)

**Question:** Why not just train on solutions written by human experts?

- What's easy for a person isn't always easy for the model, so human solutions may skip steps it needs ✓
- Experts refuse to write solutions
- Human text can't be tokenized
- Human solutions are always wrong

**Explanation:** People and models find different things hard. RL lets the model find token sequences that work for it, instead of copying a path that suits a human.

#### 3.2.3 (multiple choice)

**Question:** Where does reinforcement learning get its learning signal from?

- From the size of the answer
- From a person writing each solution
- From more internet text
- From checking whether the final answer is right ✓

**Explanation:** Nobody writes the solutions in RL. The only signal is whether an attempt reached the right result.

#### 3.2.4 (multiple choice)

**Question:** What does it mean that a task is "verifiable"?

- It has a long explanation
- Only experts can solve it
- It was checked by the government
- Its answer can be checked automatically, like a math result or passing tests ✓

**Explanation:** Verifiable tasks have answers you can check without a person, which makes them ideal for RL practice at scale.

#### 3.2.5 (multiple choice, developer scenario)

**Question:** You want to use RL to make a model better at writing code. What can serve as the reward?

- Whether the generated code passes the unit tests ✓
- How many comments the code has
- How long the code is
- Whether the code uses a popular library

**Explanation:** Passing tests is an automatic, meaningful check of whether the code works. That's the kind of reward RL needs.

### Lesson 3.3: Thinking models

Video: 2:27:47

#### 3.3.1 (multiple choice)

**Question:** During RL on math problems, as in the DeepSeek-R1 paper, what appeared without anyone teaching it?

- Answers in a new language
- Longer answers in which the model re-checks its steps and tries other approaches ✓
- Shorter answers with only the final number
- Answers that copy textbook solutions word for word

**Explanation:** As RL went on, answers got longer and more accurate. The model learned on its own to check its work, backtrack and try again, which is what we now call thinking.

#### 3.3.2 (multiple choice)

**Question:** Why do thinking models write long chains of thought before answering?

- They are trained to fill the context window
- To hide the answer from the user
- More tokens mean more computation, and trying, checking and backtracking leads to right answers ✓
- Longer answers cost the user more

**Explanation:** RL rewarded whatever reached the right answer. Spending more tokens on exploring and checking turned out to work, so the model learned to do it.

#### 3.3.3 (categorize)

**Question:** When is a thinking model worth it, and when is a fast regular model fine?

**Groups:** Use a thinking model, A regular model is fine

**Items, as shown:**

- Debug a tricky race condition → Use a thinking model
- Plan a multi-step data migration → Use a thinking model
- Write a friendly reply to a customer → A regular model is fine
- Look up the syntax of a common function → A regular model is fine
- Fix a typo in a README → A regular model is fine
- Prove a math statement → Use a thinking model

**Explanation:** Thinking pays off on problems that need careful reasoning. For simple or knowledge-based questions, a regular model answers just as well, faster and cheaper.

#### 3.3.4 (multiple choice)

**Question:** What's the trade-off of using a thinking model?

- There's no trade-off
- Better on hard problems, but slower and more expensive, because it writes many more tokens ✓
- Cheaper, but only works in English
- Faster, but less accurate

**Explanation:** All the thinking is extra tokens. You pay for them in time and money, so use thinking where it matters.

#### 3.3.5 (multiple choice, developer scenario)

**Question:** Your chat feature uses a thinking model for every message, and users complain it's slow on simple questions. What's a good fix?

- Ask users to type faster
- Make the thinking model think for longer
- Send simple questions to a regular model and keep the thinking model for hard ones ✓
- Remove the chat history

**Explanation:** Routing by difficulty gives quick answers for easy questions and careful reasoning where it's needed.

### Lesson 3.4: AlphaGo and going past human examples

Video: 2:42:07

#### 3.4.1 (multiple choice)

**Question:** What happened when AlphaGo was trained only by imitating expert human games?

- It couldn't learn to play at all
- It beat every human right away
- It only learned the opening moves
- It became strong, but leveled off below the best human players ✓

**Explanation:** Imitation can get you close to the people you copy, but rarely past them. The examples set the ceiling.

#### 3.4.2 (multiple choice)

**Question:** What let AlphaGo beat the world's best players?

- A bigger board
- Help from human players during matches
- Reinforcement learning: playing many games against itself and learning which moves led to wins ✓
- Studying even more human games

**Explanation:** Winning or losing is easy to check in Go. Self-play with RL let the system practice far beyond the human examples.

#### 3.4.3 (multiple choice)

**Question:** Why is AlphaGo's "move 37" against Lee Sedol famous?

- It was the first move of the game
- Experts thought a human would almost never play it, yet it turned out to be strong ✓
- A human told the system to play it
- It broke the rules of Go

**Explanation:** RL found a move outside human habits that turned out to be brilliant. It showed that practice can discover strategies people never thought of.

#### 3.4.4 (multiple choice)

**Question:** What does AlphaGo suggest about LLMs trained with RL?

- They only work for board games
- They might discover ways of reasoning no person wrote down ✓
- They no longer need any data
- They will always stay below human level

**Explanation:** If RL can go beyond imitation in Go, RL on reasoning tasks could also find new, better ways to solve problems, not only copy ours.

#### 3.4.5 (multiple choice, developer scenario)

**Question:** Your team wants to use RL to make a model write better marketing slogans. What's the main obstacle compared with Go?

- Models can't write slogans
- RL only works on numbers
- There's no automatic way to score a slogan as right or wrong ✓
- Slogans are too short to tokenize

**Explanation:** Go has a clear winner. Slogan quality is a matter of taste, so you need another way to get a reward, which is what RLHF is for.

### Lesson 3.5: RLHF

Video: 2:48:26

#### 3.5.1 (categorize)

**Question:** Which tasks can be checked automatically, and which can't?

**Groups:** Verifiable, Not verifiable

**Items, as shown:**

- Find the shortest route in a graph → Verifiable
- Write a funny joke → Not verifiable
- Summarize an article well → Not verifiable
- Write a poem about autumn → Not verifiable
- Solve an equation → Verifiable
- Make all unit tests pass → Verifiable

**Explanation:** Some tasks have a checkable right answer. Others depend on human taste, and there RL needs a different kind of reward.

#### 3.5.2 (ordering)

**Question:** Put the steps of reinforcement learning from human feedback (RLHF) in order.

**Steps, as shown (correct position):**

- The model writes several answers to a prompt (1)
- People rank the answers from best to worst (2)
- The model is trained with RL to get high scores from the reward model (4)
- A reward model learns to predict those rankings (3)

**Explanation:** People can't score millions of answers by hand. So they rank a smaller set, a reward model learns to imitate their judgment, and RL then runs against that reward model.

#### 3.5.3 (multiple choice)

**Question:** Why do people rank answers instead of writing perfect ones?

- Ranking is much easier than writing, so you get more and better data ✓
- The model can't learn from written answers
- Writing answers is not allowed
- Rankings take up fewer tokens

**Explanation:** Most people can't write a great joke on demand, but almost anyone can tell which of five jokes is funniest. Comparing is the easier job.

#### 3.5.4 (system builder)

**Question:** Build the RLHF training setup: add the parts you need and connect them.

**Scenario:** You want the model to write better jokes, which can't be checked automatically. People rank some of the model's answers. A reward model learns from their rankings and then scores the model's answers during RL.

**Nodes (name — role), in palette order:**

- Language model — Writes candidate answers ✓
- Reward model — Predicts the rankings ✓
- Human raters — Rank some answers ✓
- Web crawler — Collects web pages
- RL trainer — Updates the language model ✓
- Tokenizer — Splits text into tokens
- Unit tests — Check code automatically

**Connections:**

- Language model → Human raters
- Human raters → Reward model
- Language model → Reward model
- Reward model → RL trainer
- RL trainer → Language model

**Explanation:** The model's answers go to people, whose rankings train the reward model. During RL, the reward model scores new answers, and the trainer updates the language model toward higher scores. No unit tests here: jokes can't be checked automatically.

#### 3.5.5 (multiple choice)

**Question:** Why can't RLHF run for as long as RL on math problems?

- Jokes run out
- People get tired of ranking
- The GPUs overheat
- The model learns to game the reward model, finding odd answers that score high but aren't good ✓

**Explanation:** A reward model is only an imitation of human judgment, and it has blind spots. Optimize against it for too long and the model finds them, so RLHF is run only briefly.

#### 3.5.6 (multiple choice, developer scenario)

**Question:** Your team trains a model with RLHF. After many more steps, answers get weirder while the reward scores keep rising. What's happening?

- The model is getting better and the answers just look weird
- The tokenizer broke
- The human raters changed their minds
- The model is exploiting the reward model, so you should stop training earlier ✓

**Explanation:** Rising scores with worse answers are the classic sign of reward hacking. Stop earlier, or improve the reward model, and judge quality with people.

## Section 4: Using LLMs as a developer

### Lesson 4.1: What's coming

Video: 3:09:39

#### 4.1.1 (multiple choice)

**Question:** How can one model handle text, audio and images natively?

- It can't, each type needs a different kind of model
- Audio and images are turned into tokens too, and the model trains on mixed sequences ✓
- The model only reads file names
- A separate person describes each image in text

**Explanation:** The same idea extends beyond text: chop audio and images into tokens and train on sequences that mix them. The core of the model stays the same.

#### 4.1.2 (multiple choice)

**Question:** In this context, what is an agent?

- A model that works on a longer task over many steps, using tools, with a person checking in ✓
- A model that only answers yes or no
- A person who sells AI products
- A browser extension that blocks ads

**Explanation:** Agents take on tasks rather than single questions. Because they can make mistakes, a person supervises them, like a manager with a team.

#### 4.1.3 (multiple choice)

**Question:** What do computer-using agents do?

- Use a keyboard and mouse to carry out tasks in apps and websites ✓
- Repair computer hardware
- Only run in data centers with no screens
- Write new operating systems by themselves

**Explanation:** These agents look at the screen and take actions, like clicking and typing, so they can work in tools that have no API.

#### 4.1.4 (multiple choice)

**Question:** Which of these was still an open research problem at the time of the video?

- Training on internet text
- Turning text into tokens
- Running a model on a GPU
- Handling very long contexts well ✓

**Explanation:** Tokenization, GPU training and pretraining are well understood. Making models work well over very long contexts, like long tasks and documents, was still being researched.

#### 4.1.5 (multiple choice, developer scenario)

**Question:** You let an agent open pull requests for small bug fixes. What's the right way to work with it?

- Never let it touch code
- Only check its pull requests once a year
- Merge everything automatically, since agents don't make mistakes
- Review its changes like a junior teammate's before merging ✓

**Explanation:** Agents can save a lot of work, but they make mistakes. Keep a person in the loop for anything that reaches production.

### Lesson 4.2: Tracking and choosing models

Video: 3:15:15

#### 4.2.1 (multiple choice)

**Question:** On some leaderboards, people compare answers from two hidden models and pick the better one. What does that ranking tell you?

- Which model has the most parameters
- Which models people prefer head to head. It's useful, but test models on your own tasks too ✓
- Which model is the cheapest
- Exactly which model is best for every task

**Explanation:** Human-preference rankings are a good signal of general quality, but your use case may differ. Always try the top candidates on your own problems.

#### 4.2.2 (categorize)

**Question:** Which way of using a model fits each need?

**Groups:** Provider's app or API, Open model on a hosting service, Small model on your own machine

**Items, as shown:**

- The app must work offline on a laptop → Small model on your own machine
- You want to try a base model, not an assistant → Open model on a hosting service
- You need the newest proprietary frontier model → Provider's app or API
- No data may ever leave the device → Small model on your own machine
- You want an open-weight model without managing GPUs → Open model on a hosting service
- You want top quality, and your data may leave your network → Provider's app or API

**Explanation:** Proprietary models are used through their makers' apps and APIs. Open-weight models, including some base models, can be rented from hosting services. Smaller versions can run locally when you need offline use or full data control.

#### 4.2.3 (multiple choice)

**Question:** What does "open weights" mean?

- The training data is public
- The model's parameters are published, so anyone can download and run it ✓
- The model is free to use on the maker's website
- The model has no safety training

**Explanation:** With open weights you get the parameters themselves. You can run, host or fine-tune the model yourself.

#### 4.2.4 (multiple choice)

**Question:** To run a model on a laptop with a tool like LM Studio, what do you usually use?

- A model with no tokenizer
- A smaller, distilled model, often quantized to use less memory ✓
- Only base models
- The largest model available

**Explanation:** Laptops don't have the memory for huge models. Distilled models are smaller versions trained from bigger ones, and quantization stores their parameters with fewer bits.

#### 4.2.5 (multiple choice)

**Question:** The field moves fast. What's a sensible way to keep up?

- Switch to every new model the day it comes out
- Follow a few trusted sources, like a leaderboard and a newsletter, and try new models on your own tasks ✓
- Read only the providers' press releases
- Ignore new models for several years

**Explanation:** A few good sources keep you informed without the noise, and your own tests show whether a new model actually helps you.

#### 4.2.6 (multiple choice, developer scenario)

**Question:** Your client's app must work on a factory floor with no internet, on an ordinary laptop. Which option fits?

- A small open-weight model running locally ✓
- An open model on a hosting service
- A thinking model in the cloud
- The largest proprietary model through its API

**Explanation:** No internet rules out every hosted option. A small local model is the one choice that works offline.

### Lesson 4.3: Capstone: the whole picture

Video: 3:21:46

#### 4.3.1 (system builder)

**Question:** Build the path from internet text to a chat answer: add the parts you need and connect them.

**Scenario:** Connect the main stages of building and using an LLM, from raw web pages to the answer a user sees in a chat app.

**Nodes (name — role), in palette order:**

- Pretraining — Creates the base model ✓
- Document scanner — Reads paper forms
- Spreadsheet — Stores user lists
- Fine-tuning on chats — Creates the assistant ✓
- Reinforcement learning — Practices problems ✓
- Web data — Filtered internet text ✓
- Chat app — Samples an answer ✓
- Tokenizer — Turns text into tokens ✓

**Connections:**

- Web data → Tokenizer
- Tokenizer → Pretraining
- Pretraining → Fine-tuning on chats
- Fine-tuning on chats → Reinforcement learning
- Reinforcement learning → Chat app

**Explanation:** Web text is cleaned and tokenized, pretraining turns it into a base model, fine-tuning on conversations makes it an assistant, and RL sharpens its problem solving. The chat app then samples answers from the finished model.

#### 4.3.2 (ordering)

**Question:** Put the life of one chat message in order.

**Steps, as shown (correct position):**

- You type a message (1)
- The tokens are turned back into text and shown to you (5)
- The text is split into tokens (3)
- The app wraps it in the chat template (2)
- The model predicts and samples tokens one at a time (4)

**Explanation:** Your message is formatted and tokenized, the model generates the reply token by token, and the tokens are turned back into text.

#### 4.3.3 (multiple choice)

**Question:** Which training stage gives the model most of its knowledge?

- RLHF
- Tokenization
- Fine-tuning on conversations
- Pretraining ✓

**Explanation:** Pretraining on trillions of tokens builds the model's knowledge. Later stages mostly shape how it uses that knowledge.

#### 4.3.4 (multiple choice)

**Question:** When you chat with an assistant, what are you really talking to?

- A database of approved answers
- A person typing very fast
- A search engine with a chat window
- A statistical imitation of the people who wrote its training answers, sharpened by RL ✓

**Explanation:** The assistant imitates the example answers it was fine-tuned on, with knowledge from pretraining. Thinking models add problem-solving skills learned through RL.

#### 4.3.5 (multiple choice, developer scenario)

**Question:** You're about to ship a feature that puts an LLM's answer straight into customer emails. What's the best practice?

- Only use the model on weekends
- Treat it as a draft: check facts against sources, use tools for exact details, and keep a review step ✓
- Ask the model if its answer is correct, then send it
- Send it as is, since the model sounds confident

**Explanation:** LLMs are powerful tools with jagged abilities. Give them the right context, use tools for exact work, and check their output before it reaches customers.
