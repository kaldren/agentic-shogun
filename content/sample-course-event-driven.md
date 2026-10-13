# Sample section: Event-driven systems

Test content for spec 008. It becomes the seed data in the database.
It is section 2 of the Software developers course (see `content/sample-course-developers.md`).
In system builder exercises, nodes marked **✓** belong on the canvas; the others are distractors.

- **Role:** Software developers
- **Course:** AI apps on Azure
- **Section 2:** Event-driven systems

## Lesson 1: Build an order pipeline

### 1.1 (system builder)

**Question:** Build the order pipeline: add the services you need and connect them.

**Scenario:** Your online shop must accept orders even when traffic spikes on sale days. The order API should answer customers right away and leave the slow work, saving the order and emailing a confirmation, to a background worker. No order may be lost if the worker is busy or briefly down.

**Nodes (service — role), in palette order:**

- Microsoft Sentinel — Security monitoring
- Azure Service Bus — Order queue ✓
- Azure Static Web Apps — Shop frontend ✓
- Azure IoT Hub — Device messaging
- Azure Cosmos DB — Orders database ✓
- Azure Functions — Order processor ✓
- Azure Virtual Desktop — Remote desktops
- Azure Communication Services — Confirmation email ✓
- Azure Container Apps — Order API ✓

**Connections:**

- Azure Static Web Apps → Azure Container Apps
- Azure Container Apps → Azure Service Bus
- Azure Service Bus → Azure Functions
- Azure Functions → Azure Cosmos DB
- Azure Functions → Azure Communication Services

**Explanation:** The shop frontend on Static Web Apps sends each order to the API on Container Apps. The API puts the order on a Service Bus queue and answers the customer right away. Azure Functions takes orders from the queue at its own pace, saves them in Cosmos DB and sends the confirmation email with Communication Services. If the worker is busy or down, orders wait safely in the queue.
