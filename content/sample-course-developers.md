# Sample course: AI apps on Azure

Test content for specs 007 and 011. It becomes the seed data in the database.
In architecture exercises, each slot lists its correct card after **→**.
In ordering exercises, steps are listed in the mixed order the learner sees, with their correct position in brackets.

- **Role:** Software developers
- **Course:** AI apps on Azure
- **Section 1:** Build with retrieval-augmented generation (RAG)

## Lesson 1: Design a RAG app on Azure

### 1.1 (architecture)

**Question:** Drag each Azure service to its place in the architecture.

**Scenario:** Your company wants a chat assistant that answers employee questions using internal PDF documents, like HR policies and product manuals. Employees use it in the browser. Answers must be based on the documents, not on what the model happens to remember.

**Flow "Answer a question":** Web frontend → Backend API → Vector and keyword search + LLM and embeddings

**Flow "Add documents":** Document storage → Document processing → Vector and keyword search

**Slots:**

- Web frontend → Azure Static Web Apps
- Backend API → Azure Container Apps
- Vector and keyword search → Azure AI Search
- LLM and embeddings → Azure OpenAI in Microsoft Foundry
- Document storage → Azure Blob Storage
- Document processing → Azure AI Document Intelligence

**Distractors:** Azure IoT Hub, Azure Virtual Desktop, Azure Notification Hubs

**Explanation:** New PDFs land in Blob Storage, Document Intelligence pulls out their text, and AI Search keeps the chunks with their embeddings. When someone asks a question, the frontend on Static Web Apps calls the API on Container Apps. The API finds the best chunks in AI Search and sends them with the question to Azure OpenAI, which writes an answer grounded in your documents.

### 1.2 (ordering)

**Question:** Put the steps in order, from first to last.

**Scenario:** An employee asks the chat assistant from the last exercise a question. What happens next?

**Steps, as shown (correct position):**

- AI Search finds the most relevant document chunks (3)
- The LLM writes an answer based on the chunks (5)
- The employee sends a question from the web app (1)
- The backend sends the question and the chunks to the LLM (4)
- The backend turns the question into an embedding (2)

**Explanation:** The question goes from the web app to the backend, which turns it into an embedding. AI Search uses the embedding to find the chunks that match best. Only then does the backend send the question and those chunks to the LLM, so the answer is based on your documents.
